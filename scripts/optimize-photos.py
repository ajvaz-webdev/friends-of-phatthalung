"""Make web-sized WebP copies of the site photos.

The original JPGs in public/photos stay untouched. For every JPG this writes
public/photos/web/<name>-640.webp, -1080.webp and -1600.webp, which the page
serves through srcset so phones download a small file and the lightbox gets a
sharp one.

Run after adding or replacing a photo:
    pip install pillow
    python scripts/optimize-photos.py
Existing outputs are skipped unless the source photo is newer.
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "photos"
OUT = SRC / "web"
WIDTHS = (640, 1080, 1600)
QUALITY = 74


def main() -> None:
    OUT.mkdir(exist_ok=True)
    before = after = 0
    for photo in sorted(SRC.glob("*.jpg")):
        before += photo.stat().st_size
        with Image.open(photo) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            for width in WIDTHS:
                target = OUT / f"{photo.stem}-{width}.webp"
                if not target.exists() or target.stat().st_mtime < photo.stat().st_mtime:
                    resized = image
                    if image.width > width:
                        height = round(image.height * width / image.width)
                        resized = image.resize((width, height), Image.LANCZOS)
                    resized.save(target, "WEBP", quality=QUALITY, method=6)
                after += target.stat().st_size
    print(f"{before / 1e6:.1f} MB of JPGs -> {after / 1e6:.1f} MB of WebP (all sizes)")


if __name__ == "__main__":
    main()
