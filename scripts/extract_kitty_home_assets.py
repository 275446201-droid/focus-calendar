from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "design-references" / "hello-kitty-reference.png"
OUTPUT = ROOT / "assets" / "themes" / "hello-kitty" / "home"


# Coordinates are measured against the user's 1487 x 1058 reference image.
CROPS = {
    "corner-bow.png": (31, 15, 94, 58),
    "card-bow.png": (1391, 154, 1445, 194),
    "tiny-bow.png": (218, 794, 250, 823),
    "separator-bow.png": (431, 855, 465, 890),
    "whisker-left.png": (63, 198, 82, 226),
    "whisker-right.png": (267, 198, 286, 226),
    "day-icon.png": (68, 781, 130, 847),
    "week-icon.png": (491, 781, 558, 847),
    "month-icon.png": (879, 781, 956, 847),
    "mascot.png": (1190, 778, 1422, 975),
    "side-heart.png": (1428, 800, 1487, 858),
}


def clear_connected_light_background(image: Image.Image) -> Image.Image:
    """Remove only the pale screenshot background connected to a crop edge.

    Flood filling from the border keeps enclosed white artwork (notably Kitty's
    face) intact while removing the rectangular card background around it.
    """
    image = image.convert("RGBA")
    pixels = image.load()
    width, height = image.size
    transparent = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def is_background(x: int, y: int) -> bool:
        red, green, blue, _ = pixels[x, y]
        return (
            red >= 218
            and green >= 210
            and blue >= 205
            and max(red, green, blue) - min(red, green, blue) <= 38
        )

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if not transparent[index] and is_background(x, y):
            transparent[index] = 1
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    for y in range(height):
        for x in range(width):
            if transparent[y * width + x]:
                pixels[x, y] = (255, 255, 255, 0)

    return image


def remove_small_alpha_components(image: Image.Image, min_area: int) -> Image.Image:
    """Remove isolated screenshot fragments while preserving the real artwork."""
    image = image.copy()
    alpha = image.getchannel("A")
    width, height = image.size
    mask = alpha.load()
    visited = bytearray(width * height)
    keep = bytearray(width * height)

    for start_y in range(height):
        for start_x in range(width):
            start_index = start_y * width + start_x
            if visited[start_index] or mask[start_x, start_y] == 0:
                continue
            visited[start_index] = 1
            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            component: list[tuple[int, int]] = []
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for next_x, next_y in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if not (0 <= next_x < width and 0 <= next_y < height):
                        continue
                    index = next_y * width + next_x
                    if visited[index] or mask[next_x, next_y] == 0:
                        continue
                    visited[index] = 1
                    queue.append((next_x, next_y))
            if len(component) >= min_area:
                for x, y in component:
                    keep[y * width + x] = 1

    pixels = image.load()
    for y in range(height):
        for x in range(width):
            if not keep[y * width + x]:
                red, green, blue, _ = pixels[x, y]
                pixels[x, y] = (red, green, blue, 0)
    return image


def remove_thin_border_spurs(image: Image.Image) -> Image.Image:
    """Strip the one-pixel card borders connected to cropped bow artwork."""
    image = image.copy()
    alpha = image.getchannel("A")
    solid = alpha.point(lambda value: 255 if value else 0)
    opened = solid.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    image.putalpha(ImageChops.multiply(alpha, opened))
    return image


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    if image.size != (1487, 1058):
        raise ValueError(f"Expected 1487x1058 source, got {image.size}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    obsolete_footer = OUTPUT / "footer.png"
    if obsolete_footer.exists():
        obsolete_footer.unlink()
    for name, box in CROPS.items():
        asset = clear_connected_light_background(image.crop(box))
        if name in {"corner-bow.png", "card-bow.png"}:
            asset = remove_thin_border_spurs(asset)
            asset = remove_small_alpha_components(asset, 24)
        elif name == "mascot.png":
            asset = remove_small_alpha_components(asset, 100)
        elif name in {"tiny-bow.png", "separator-bow.png", "side-heart.png"}:
            asset = remove_small_alpha_components(asset, 18)
        asset.save(OUTPUT / name, optimize=True)


if __name__ == "__main__":
    main()
