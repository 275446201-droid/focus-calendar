from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]


def content_crop(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    background = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    diff = ImageChops.difference(rgb, background).convert("L")
    mask = diff.point(lambda value: 255 if value > 7 else 0)
    box = mask.getbbox()
    if not box:
        return rgb
    left, top, right, bottom = box
    pad = 8
    return rgb.crop((max(0, left - pad), max(0, top - pad), min(rgb.width, right + pad), min(rgb.height, bottom + pad)))


def make_comparison(source_path: Path, implementation_path: Path, output_path: Path, crop: bool) -> None:
    source = Image.open(source_path).convert("RGB")
    implementation = Image.open(implementation_path).convert("RGB")
    if crop:
        source = content_crop(source)
        implementation = content_crop(implementation)

    slot_width, slot_height = 1040, 700
    canvas = Image.new("RGB", (slot_width * 2 + 60, slot_height + 80), "#07131f")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default(size=22)

    for index, (label, image) in enumerate((("SOURCE", source), ("IMPLEMENTATION", implementation))):
        fitted = image.copy()
        fitted.thumbnail((slot_width - 28, slot_height - 28), Image.Resampling.LANCZOS)
        x0 = 20 + index * (slot_width + 20)
        y0 = 54
        x = x0 + (slot_width - fitted.width) // 2
        y = y0 + (slot_height - fitted.height) // 2
        canvas.paste(fitted, (x, y))
        draw.text((x0, 16), label, fill="#d9e7f5", font=font)
        draw.rectangle((x0, y0, x0 + slot_width, y0 + slot_height), outline="#38506a", width=2)

    canvas.save(output_path)


if __name__ == "__main__":
    mascot_small = Image.open(ROOT / "qa" / "hello-kitty-mascot-position-final.png").convert("RGB")
    # Browser screenshots in this desktop environment are rasterized at about
    # 0.614x of the requested CSS viewport, with unused pixels left black.
    mascot_small.crop((310, 270, 565, 400)).resize((408, 217), Image.Resampling.LANCZOS).save(
        ROOT / "qa" / "hello-kitty-mascot-position-final-crop.png"
    )
    make_comparison(
        ROOT / "design-references" / "option-2-full.png",
        ROOT / "qa" / "implementation-full.png",
        ROOT / "qa" / "comparison-full.png",
        crop=False,
    )
    make_comparison(
        ROOT / "design-references" / "option-2-compact.png",
        ROOT / "qa" / "implementation-compact.png",
        ROOT / "qa" / "comparison-compact.png",
        crop=True,
    )
    make_comparison(
        ROOT / "design-references" / "hello-kitty-reference.png",
        ROOT / "qa" / "hello-kitty-full-clean.png",
        ROOT / "qa" / "hello-kitty-comparison-strict.png",
        crop=False,
    )
    make_comparison(
        ROOT / "qa" / "hello-kitty-user-reported.png",
        ROOT / "qa" / "hello-kitty-user-size-fixed.png",
        ROOT / "qa" / "hello-kitty-before-after-cleanup.png",
        crop=False,
    )
    make_comparison(
        ROOT / "qa" / "hello-kitty-mascot-position-reported.png",
        ROOT / "qa" / "hello-kitty-mascot-position-final-crop.png",
        ROOT / "qa" / "hello-kitty-mascot-position-comparison.png",
        crop=False,
    )
    make_comparison(
        ROOT / "design-references" / "hello-kitty-reference.png",
        ROOT / "qa" / "audit-20260714" / "08-home-1487x1058-fixed.png",
        ROOT / "qa" / "audit-20260714" / "09-reference-comparison.png",
        crop=False,
    )
