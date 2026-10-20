"""Generate the social preview image and logo PNG used by the app."""

from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")

FONT_BOLD = "C:/Windows/Fonts/seguisb.ttf"
FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
FONT_SERIF = "C:/Windows/Fonts/georgiab.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def gradient(size, top, bottom) -> Image.Image:
    width, height = size
    image = Image.new("RGB", size)
    draw = ImageDraw.Draw(image)
    for y in range(height):
        ratio = y / max(1, height - 1)
        colour = tuple(int(top[i] + (bottom[i] - top[i]) * ratio) for i in range(3))
        draw.line([(0, y), (width, y)], fill=colour)
    return image


def heart(draw: ImageDraw.ImageDraw, cx: float, cy: float, size: float, colour) -> None:
    r = size / 2
    draw.ellipse([cx - r, cy - r * 0.95, cx, cy + r * 0.1], fill=colour)
    draw.ellipse([cx, cy - r * 0.95, cx + r, cy + r * 0.1], fill=colour)
    draw.polygon([(cx - r * 0.98, cy - r * 0.05), (cx + r * 0.98, cy - r * 0.05), (cx, cy + r * 1.0)], fill=colour)


def mark(draw: ImageDraw.ImageDraw, x: float, y: float, size: float) -> None:
    """The simple app mark: white squircle with a crimson heart."""
    draw.rounded_rectangle(
        [x, y, x + size, y + size],
        radius=size * 0.28,
        fill=(255, 255, 255, 238),
    )
    heart(draw, x + size / 2, y + size / 2, size * 0.54, (215, 38, 61, 255))


def make_og() -> None:
    width, height = 1200, 630
    image = gradient((width, height), (215, 38, 61), (255, 143, 163))
    draw = ImageDraw.Draw(image, "RGBA")

    # soft translucent circles
    for (cx, cy, r, alpha) in [(1050, 90, 220, 26), (110, 560, 260, 22), (980, 560, 150, 18)]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, alpha))

    # floating hearts
    for (cx, cy, size) in [(1080, 160, 54), (130, 130, 40), (1040, 470, 38), (200, 520, 46)]:
        heart(draw, cx, cy, size, (255, 255, 255, 70))

    mark(draw, 72, 58, 84)
    draw.text((176, 66), "whishmydear.com", font=font(FONT_BOLD, 40), fill=(255, 255, 255, 245))

    draw.text((96, 205), "Share love beautifully", font=font(FONT_SERIF, 86), fill=(255, 255, 255, 255))
    draw.text((96, 305), "with a digital gift", font=font(FONT_SERIF, 86), fill=(255, 255, 255, 255))

    draw.text(
        (98, 430),
        "Interactive templates · your photos & music · one link or QR code",
        font=font(FONT_REGULAR, 32),
        fill=(255, 255, 255, 225),
    )

    # pill button
    draw.rounded_rectangle([96, 500, 470, 574], radius=37, fill=(255, 255, 255, 240))
    draw.text((136, 517), "Create your gift now  →", font=font(FONT_BOLD, 28), fill=(164, 18, 42, 255))

    image.save(os.path.join(PUBLIC, "og-image.png"), "PNG")
    print("og-image.png written")


def make_logo() -> None:
    size = 512
    image = gradient((size, size), (215, 38, 61), (255, 143, 163)).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], radius=112, fill=255)
    image.putalpha(mask)

    draw = ImageDraw.Draw(image, "RGBA")
    heart(draw, size / 2, size / 2, 236, (255, 255, 255, 238))

    image.save(os.path.join(PUBLIC, "logo.png"), "PNG")
    print("logo.png written")


if __name__ == "__main__":
    os.makedirs(PUBLIC, exist_ok=True)
    make_og()
    make_logo()
