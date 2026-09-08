from pathlib import Path
from PIL import Image
import shutil

MEDIA_ROOT = Path("media")

FILES = [
    "background_images/table-chair-with-white-umbrella-outdoor-patio.jpg",
    "background_images/medium-shot-smiley-woman-using-hair-product.jpg",
    "background_images/group-friends-out-bicycling-together.jpg",
    "background_images/sport-composition-with-modern-elements_omIbh7r.jpg",
]

BACKUP_DIR = MEDIA_ROOT / "_originals_before_compression"


for relative_path in FILES:
    original = MEDIA_ROOT / relative_path

    if not original.exists():
        print(f"NOT FOUND: {original}")
        continue

    # Create backup
    backup = BACKUP_DIR / relative_path
    backup.parent.mkdir(parents=True, exist_ok=True)

    if not backup.exists():
        shutil.copy2(original, backup)
        print(f"Backup created: {backup}")

    try:
        with Image.open(original) as img:
            original_size = original.stat().st_size

            # Convert to RGB for JPEG
            if img.mode != "RGB":
                img = img.convert("RGB")

            # Don't allow unnecessarily huge dimensions.
            # Background images don't need to be enormous.
            max_dimension = 2500

            if max(img.size) > max_dimension:
                ratio = max_dimension / max(img.size)
                new_size = (
                    int(img.width * ratio),
                    int(img.height * ratio),
                )

                img = img.resize(new_size, Image.Resampling.LANCZOS)

            img.save(
                original,
                "JPEG",
                quality=85,
                optimize=True,
                progressive=True,
            )

            new_size = original.stat().st_size

            print(
                f"\nCompressed: {relative_path}"
                f"\n  Before: {original_size / 1024 / 1024:.2f} MB"
                f"\n  After:  {new_size / 1024 / 1024:.2f} MB"
                f"\n  Dimensions: {img.size}"
            )

    except Exception as e:
        print(f"FAILED: {relative_path} → {e}")
