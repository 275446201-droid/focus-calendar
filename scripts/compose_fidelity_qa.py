from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / "qa" / "fidelity-20260714"


def fit(image: Image.Image, width: int, height: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((width, height), Image.Resampling.LANCZOS)
    return result


def normalized_reference() -> Image.Image:
    image = Image.open(QA / "00-reference-1487x1058.png").convert("RGB")
    # The footer strip was explicitly removed from the product direction. Keep
    # the reference canvas size, but blank only that superseded decoration.
    background = image.getpixel((image.width - 1, image.height - 1))
    ImageDraw.Draw(image).rectangle((0, 976, image.width, image.height), fill=background)
    return image


def compare(reference: Image.Image, implementation: Image.Image, output: Path) -> None:
    slot_width, slot_height = 920, 654
    canvas = Image.new("RGB", (slot_width * 2 + 54, slot_height + 76), "#251f22")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default(size=22)

    for index, (label, source) in enumerate((("REFERENCE", reference), ("IMPLEMENTATION", implementation))):
        fitted = fit(source, slot_width, slot_height)
        x0 = 18 + index * (slot_width + 18)
        y0 = 54
        x = x0 + (slot_width - fitted.width) // 2
        y = y0 + (slot_height - fitted.height) // 2
        canvas.paste(fitted, (x, y))
        draw.text((x0, 16), label, fill="#fff7f7", font=font)
        draw.rectangle((x0, y0, x0 + slot_width, y0 + slot_height), outline="#805c67", width=2)

    canvas.save(output)


def overlay(reference: Image.Image, implementation: Image.Image, output: Path) -> None:
    reference = reference.convert("RGBA")
    implementation = implementation.convert("RGBA")
    Image.blend(reference, implementation, 0.5).convert("RGB").save(output)


def diff(reference: Image.Image, implementation: Image.Image, output: Path) -> None:
    delta = ImageChops.difference(reference.convert("RGB"), implementation.convert("RGB"))
    delta = delta.point(lambda value: min(255, value * 3))
    delta.save(output)


def focused_compare(reference: Image.Image, implementation: Image.Image, box: tuple[int, int, int, int], output: Path) -> None:
    left = reference.crop(box)
    right = implementation.crop(box)
    canvas = Image.new("RGB", (left.width * 2 + 24, left.height + 46), "#251f22")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default(size=18)
    draw.text((4, 10), "REFERENCE", fill="#fff7f7", font=font)
    draw.text((left.width + 16, 10), "IMPLEMENTATION", fill="#fff7f7", font=font)
    canvas.paste(left, (0, 46))
    canvas.paste(right, (left.width + 24, 46))
    canvas.save(output)


if __name__ == "__main__":
    QA.mkdir(parents=True, exist_ok=True)
    reference = normalized_reference()
    implementation = Image.open(QA / "02-implementation-1487x1058.png").convert("RGB")
    reference.save(QA / "04-reference-without-footer.png")
    compare(reference, implementation, QA / "05-reference-vs-implementation.png")
    overlay(reference, implementation, QA / "06-overlay.png")
    diff(reference, implementation, QA / "07-amplified-diff.png")
    focused_compare(reference, implementation, (45, 160, 1442, 755), QA / "08-hero-focus.png")
    focused_compare(reference, implementation, (45, 755, 1442, 985), QA / "09-summary-focus.png")
    pass_two_path = QA / "10-implementation-1487x1058-pass2.png"
    if pass_two_path.exists():
        pass_two = Image.open(pass_two_path).convert("RGB")
        compare(reference, pass_two, QA / "11-reference-vs-pass2.png")
        overlay(reference, pass_two, QA / "12-overlay-pass2.png")
        focused_compare(reference, pass_two, (45, 160, 1442, 755), QA / "13-hero-focus-pass2.png")
        focused_compare(reference, pass_two, (45, 755, 1442, 985), QA / "14-summary-focus-pass2.png")
    final_path = QA / "15-final-1487x1058.png"
    if final_path.exists():
        final = Image.open(final_path).convert("RGB")
        compare(reference, final, QA / "18-final-comparison.png")
        overlay(reference, final, QA / "19-final-overlay.png")
