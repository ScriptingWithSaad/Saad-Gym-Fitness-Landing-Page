"""Build responsive WebP versions of the repository's original photographs."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/optimized'
SOURCES = {
    'hero': ('pexels-pixabay-416809.jpg', [640, 1000, 1600]),
    'strength': ('barbell row.png', [480, 800]),
    'conditioning': ('jogging.png', [480, 800]),
    'mobility': ('yoga.png', [480, 800]),
    'coaching': ('trainer.jpg', [640, 1000]),
}
OUT.mkdir(parents=True, exist_ok=True)
for name, (source, widths) in SOURCES.items():
    image = ImageOps.exif_transpose(Image.open(ROOT / 'assets/images' / source)).convert('RGB')
    for width in widths:
        width = min(width, image.width)
        resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        resized.save(OUT / f'{name}-{width}.webp', quality=84, method=6)
print(f'{len(list(OUT.glob("*.webp")))} images, {sum(p.stat().st_size for p in OUT.glob("*.webp")):,} bytes')
