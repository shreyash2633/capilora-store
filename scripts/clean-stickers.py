"""Clean Capilora sticker photos into white-background packshots.

Reads:  C:\\Users\\shrey\\Downloads\\Capilora\\*.jpeg  (passed as source dir)
Writes: public/products/{slug}.png  (square, subject centered on white)

Run from capilora-store/:  python scripts/clean-stickers.py
"""
import os
import sys
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

SOURCE_DIR = r"C:\Users\shrey\Downloads\Capilora"
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "products")

SLUGS = {
    "WhatsApp Image 2026-09-07 at 10.29.47 PM (1).jpeg": "water-resistant-sunscreen-spf-50",
    "WhatsApp Image 2026-09-07 at 10.29.47 PM (2).jpeg": "vitamin-c-face-serum",
    "WhatsApp Image 2026-09-07 at 10.29.47 PM.jpeg": "dandruff-control-shampoo",
    "WhatsApp Image 2026-09-07 at 10.29.48 PM (1).jpeg": "foaming-face-wash",
    "WhatsApp Image 2026-09-07 at 10.29.48 PM.jpeg": "acne-control-face-serum",
    "WhatsApp Image 2026-09-07 at 10.29.49 PM (1).jpeg": "hair-fall-control-conditioner",
    "WhatsApp Image 2026-09-07 at 10.29.49 PM.jpeg": "intense-underarm-cream",
    "WhatsApp Image 2026-09-07 at 10.29.50 PM.jpeg": "deep-repair-hair-mask",
}


def corner_bg(im, box=12):
    """Average color of the four corner patches (assumed background)."""
    w, h = im.size
    px = im.load()
    pts = []
    for (x0, y0) in [(0, 0), (w - box, 0), (0, h - box), (w - box, h - box)]:
        for dx in range(box):
            for dy in range(box):
                pts.append(px[x0 + dx, y0 + dy])
    n = len(pts)
    return tuple(sum(p[i] for p in pts) // n for i in range(3))


def content_bbox(im, delta=26):
    """Bounding box of pixels that differ from the corner background color."""
    bg = corner_bg(im)
    gray = im.convert("L")
    w, h = im.size
    small = gray.resize((w // 4 or 1, h // 4 or 1))
    px = small.load()
    sw, sh = small.size
    minx, miny, maxx, maxy = sw, sh, 0, 0
    for y in range(sh):
        for x in range(sw):
            r, g, b = im.load()[x * 4, y * 4][:3]
            if abs(r - bg[0]) > delta or abs(g - bg[1]) > delta or abs(b - bg[2]) > delta:
                minx, miny = min(minx, x), min(miny, y)
                maxx, maxy = max(maxx, x), max(maxy, y)
    if maxx <= minx or maxy <= miny:
        return (0, 0, w, h)
    return (minx * 4, miny * 4, min(maxx * 4 + 4, w), min(maxy * 4 + 4, h))


def process(fname, slug):
    src = os.path.join(SOURCE_DIR, fname)
    im = Image.open(src).convert("RGB")
    im = ImageOps.exif_transpose(im)

    bbox = content_bbox(im)
    im = im.crop(bbox)

    # add small padding around subject
    pw, ph = im.size
    pad = int(max(pw, ph) * 0.05)
    im = ImageOps.expand(im, border=pad, fill=(255, 255, 255))

    # square white canvas, subject centered with margin
    side = max(im.size)
    canvas_side = int(side * 1.08)
    canvas = Image.new("RGB", (canvas_side, canvas_side), (255, 255, 255))
    canvas.paste(im, ((canvas_side - im.width) // 2, (canvas_side - im.height) // 2))

    # polish: mild autocontrast, saturation, sharpen
    canvas = ImageOps.autocontrast(canvas, cutoff=1)
    canvas = ImageEnhance.Color(canvas).enhance(1.06)
    canvas = ImageEnhance.Sharpness(canvas).enhance(1.15)
    canvas = canvas.resize((1200, 1200), Image.LANCZOS)

    out = os.path.join(OUT_DIR, f"{slug}.png")
    canvas.save(out, "PNG", optimize=True)
    print(f"  {slug}.png  <-  {fname}  ({canvas_side}px cleaned)")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Cleaning stickers from {SOURCE_DIR}")
    for fname, slug in SLUGS.items():
        path = os.path.join(SOURCE_DIR, fname)
        if not os.path.exists(path):
            print(f"  !! missing: {fname}")
            continue
        process(fname, slug)
    print("Done.")


if __name__ == "__main__":
    main()
