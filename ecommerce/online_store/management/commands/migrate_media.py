from pathlib import Path

import cloudinary.uploader

from django.conf import settings
from django.core.management.base import BaseCommand

from online_store.models import CustomUser, Store, Category, ProductImage


class Command(BaseCommand):
    help = "Upload local media files to Cloudinary without modifying database image names."

    def handle(self, *args, **options):

        media_root = Path(settings.MEDIA_ROOT)

        image_fields = [
            (CustomUser, "profile_image"),
            (Store, "store_image"),
            (Store, "store_banner"),
            (Category, "background_image"),
            (Category, "icon"),
            (ProductImage, "image"),
        ]

        files = []

        self.stdout.write("Scanning database for images...\n")

        for model, field_name in image_fields:
            for obj in model.objects.all():
                field = getattr(obj, field_name)

                if not field or not field.name:
                    continue

                local_path = media_root / field.name

                if not local_path.exists():
                    self.stdout.write(
                        self.style.WARNING(
                            f"SKIP - file not found: {local_path}"
                        )
                    )
                    continue

                files.append((local_path, field.name))

        # Remove duplicates while preserving order
        unique_files = {}
        for local_path, name in files:
            unique_files[name] = local_path

        files = list(unique_files.items())

        total = len(files)

        self.stdout.write(
            self.style.SUCCESS(
                f"\nFound {total} local image files.\n"
            )
        )

        successful = 0
        failed = 0

        for index, (name, local_path) in enumerate(files, start=1):

            public_id = Path(name).with_suffix("").as_posix()

            self.stdout.write(
                f"[{index}/{total}] Uploading {name}..."
            )

            try:
                result = cloudinary.uploader.upload(
                    str(local_path),
                    public_id=public_id,
                    resource_type="image",
                    overwrite=False,
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f" OK → {result['public_id']}"
                    )
                )

                successful += 1

            except Exception as e:

                # If the asset already exists, that's okay.
                if "already exists" in str(e).lower():
                    self.stdout.write(
                        self.style.WARNING(
                            " already exists — skipped"
                        )
                    )
                    successful += 1
                else:
                    self.stdout.write(
                        self.style.ERROR(
                            f" FAILED → {e}"
                        )
                    )
                    failed += 1

        self.stdout.write("\n" + "=" * 60)

        self.stdout.write(
            self.style.SUCCESS(
                f"Migration complete!\n"
                f"Successful: {successful}\n"
                f"Failed: {failed}\n"
                f"Total: {total}"
            )
        )