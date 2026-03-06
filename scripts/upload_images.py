import argparse
from datetime import datetime, timezone
import json
import os
import sys
from dataclasses import asdict
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Optional, Sequence


DEFAULT_MANIFEST_PATH = Path(__file__).with_name("upload_images_manifest.json")
DEFAULT_ASSET_MANIFEST_PATH = Path(__file__).with_name("uploaded_assets.json")


@dataclass(frozen=True)
class ImageUpload:
    filename: str
    public_id: str


@dataclass(frozen=True)
class AssetRecord:
    filename: str
    public_id: str
    status: str
    source_path: str
    secure_url: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    bytes: Optional[int] = None
    format: Optional[str] = None
    version: Optional[str] = None
    error: Optional[str] = None


@dataclass(frozen=True)
class UploadSummary:
    successful_uploads: int = 0
    planned_uploads: int = 0
    missing_files: int = 0
    failed_uploads: int = 0
    invalid_paths: int = 0

    @property
    def exit_code(self) -> int:
        return (
            0
            if not (self.missing_files or self.failed_uploads or self.invalid_paths)
            else 1
        )


@dataclass(frozen=True)
class UploadRun:
    summary: UploadSummary
    assets: list[AssetRecord]


def increment_summary(
    summary: UploadSummary,
    *,
    successful_uploads: int = 0,
    planned_uploads: int = 0,
    missing_files: int = 0,
    failed_uploads: int = 0,
    invalid_paths: int = 0,
) -> UploadSummary:
    return UploadSummary(
        successful_uploads=summary.successful_uploads + successful_uploads,
        planned_uploads=summary.planned_uploads + planned_uploads,
        missing_files=summary.missing_files + missing_files,
        failed_uploads=summary.failed_uploads + failed_uploads,
        invalid_paths=summary.invalid_paths + invalid_paths,
    )


def get_required_env(name: str) -> str:
    value = os.getenv(name)
    if value:
        return value
    raise RuntimeError(f"Missing required environment variable: {name}")


def get_cloudinary_modules():
    try:
        import cloudinary
        import cloudinary.uploader
    except ImportError as exc:
        raise RuntimeError(
            "The 'cloudinary' package is required to run uploads."
        ) from exc

    return cloudinary, cloudinary.uploader


def configure_cloudinary() -> None:
    cloudinary, _ = get_cloudinary_modules()
    cloudinary.config(
        cloud_name=get_required_env("CLOUDINARY_CLOUD_NAME"),
        api_key=get_required_env("CLOUDINARY_API_KEY"),
        api_secret=get_required_env("CLOUDINARY_API_SECRET"),
    )


def upload_image(file_path: Path, public_id: str, overwrite: bool) -> AssetRecord:
    _, uploader = get_cloudinary_modules()

    try:
        response = uploader.upload(
            str(file_path),
            public_id=public_id,
            unique_filename=False,
            overwrite=overwrite,
        )
        print(f"Uploaded {public_id}: {response['secure_url']}")
        return AssetRecord(
            filename=file_path.name,
            public_id=public_id,
            status="uploaded",
            source_path=str(file_path),
            secure_url=response.get("secure_url"),
            width=response.get("width"),
            height=response.get("height"),
            bytes=response.get("bytes"),
            format=response.get("format"),
            version=str(response["version"]) if response.get("version") else None,
        )
    except Exception as exc:
        print(f"Error uploading {file_path}: {exc}", file=sys.stderr)
        return AssetRecord(
            filename=file_path.name,
            public_id=public_id,
            status="failed",
            source_path=str(file_path),
            error=str(exc),
        )


def parse_args(argv: Optional[Sequence[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Upload the Monolith image set to Cloudinary."
    )
    parser.add_argument(
        "--base-dir",
        default=os.getenv("IMAGE_UPLOAD_BASE_DIR"),
        help="Directory containing the local source images.",
    )
    parser.add_argument(
        "--manifest",
        default=os.getenv("IMAGE_UPLOAD_MANIFEST", str(DEFAULT_MANIFEST_PATH)),
        help="JSON manifest containing filename/public_id pairs.",
    )
    parser.add_argument(
        "--asset-manifest-out",
        default=os.getenv(
            "IMAGE_UPLOAD_ASSET_MANIFEST_OUT",
            str(DEFAULT_ASSET_MANIFEST_PATH),
        ),
        help="Write upload results and Cloudinary metadata to this JSON file.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing Cloudinary assets with the same public ID.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate inputs and print planned uploads without calling Cloudinary.",
    )
    return parser.parse_args(argv)


def load_manifest(manifest_path: Path) -> list[ImageUpload]:
    if not manifest_path.is_file():
        raise RuntimeError(f"Manifest file does not exist: {manifest_path}")

    try:
        with manifest_path.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Manifest is not valid JSON: {manifest_path}") from exc

    if not isinstance(payload, list):
        raise RuntimeError("Manifest must be a JSON array.")

    uploads: list[ImageUpload] = []
    seen_public_ids: set[str] = set()

    for index, item in enumerate(payload, start=1):
        if not isinstance(item, dict):
            raise RuntimeError(f"Manifest entry {index} must be an object.")

        filename = str(item.get("filename", "")).strip()
        public_id = str(item.get("public_id", "")).strip()

        if not filename or not public_id:
            raise RuntimeError(
                f"Manifest entry {index} must include non-empty filename and public_id."
            )

        if public_id in seen_public_ids:
            raise RuntimeError(f"Duplicate public_id in manifest: {public_id}")

        seen_public_ids.add(public_id)
        uploads.append(ImageUpload(filename=filename, public_id=public_id))

    if not uploads:
        raise RuntimeError("Manifest must contain at least one upload entry.")

    return uploads


def resolve_upload_path(base_dir: Path, filename: str) -> Path:
    relative_path = Path(filename)

    if relative_path.is_absolute():
        raise RuntimeError(f"Manifest filename must be relative: {filename}")

    candidate = (base_dir / relative_path).resolve()

    try:
        candidate.relative_to(base_dir)
    except ValueError as exc:
        raise RuntimeError(
            f"Manifest filename escapes the base directory: {filename}"
        ) from exc

    return candidate


def dry_run_upload(path: Path, public_id: str, overwrite: bool) -> AssetRecord:
    action = "overwrite" if overwrite else "upload"
    print(f"Dry run: would {action} {path} as {public_id}")
    return AssetRecord(
        filename=path.name,
        public_id=public_id,
        status="planned",
        source_path=str(path),
    )


def write_asset_manifest(
    output_path: Path,
    *,
    base_dir: Path,
    source_manifest: Path,
    summary: UploadSummary,
    assets: list[AssetRecord],
    dry_run: bool,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "dry_run": dry_run,
        "base_dir": str(base_dir),
        "source_manifest": str(source_manifest),
        "summary": {
            "successful_uploads": summary.successful_uploads,
            "planned_uploads": summary.planned_uploads,
            "missing_files": summary.missing_files,
            "failed_uploads": summary.failed_uploads,
            "invalid_paths": summary.invalid_paths,
            "exit_code": summary.exit_code,
        },
        "assets": [asdict(asset) for asset in assets],
    }

    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def run_uploads(
    base_dir: Path,
    uploads: list[ImageUpload],
    overwrite: bool,
    upload_func: Optional[Callable[[Path, str, bool], AssetRecord]] = None,
) -> UploadRun:
    if upload_func is None:
        upload_func = upload_image

    summary = UploadSummary()
    assets: list[AssetRecord] = []

    for upload in uploads:
        try:
            path = resolve_upload_path(base_dir, upload.filename)
        except RuntimeError as exc:
            print(str(exc), file=sys.stderr)
            assets.append(
                AssetRecord(
                    filename=upload.filename,
                    public_id=upload.public_id,
                    status="invalid_path",
                    source_path=str(base_dir / upload.filename),
                    error=str(exc),
                )
            )
            summary = increment_summary(summary, invalid_paths=1)
            continue

        if not path.is_file():
            print(f"File not found: {path}", file=sys.stderr)
            assets.append(
                AssetRecord(
                    filename=upload.filename,
                    public_id=upload.public_id,
                    status="missing",
                    source_path=str(path),
                    error="File not found.",
                )
            )
            summary = increment_summary(summary, missing_files=1)
            continue

        result = upload_func(path, upload.public_id, overwrite=overwrite)
        assets.append(result)

        if result.status == "failed":
            summary = increment_summary(summary, failed_uploads=1)
            continue

        if result.status == "planned":
            summary = increment_summary(summary, planned_uploads=1)
            continue

        summary = increment_summary(summary, successful_uploads=1)

    return UploadRun(summary=summary, assets=assets)


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = parse_args(argv)

    if not args.base_dir:
        print(
            "Set IMAGE_UPLOAD_BASE_DIR or pass --base-dir before running uploads.",
            file=sys.stderr,
        )
        return 1

    base_dir = Path(args.base_dir).expanduser().resolve()
    if not base_dir.is_dir():
        print(f"Base directory does not exist: {base_dir}", file=sys.stderr)
        return 1

    manifest_path = Path(args.manifest).expanduser().resolve()
    try:
        uploads = load_manifest(manifest_path)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    asset_manifest_out = Path(args.asset_manifest_out).expanduser().resolve()

    if args.dry_run:
        run = run_uploads(
            base_dir,
            uploads,
            overwrite=args.overwrite,
            upload_func=dry_run_upload,
        )
    else:
        try:
            configure_cloudinary()
        except RuntimeError as exc:
            print(str(exc), file=sys.stderr)
            return 1

        run = run_uploads(base_dir, uploads, overwrite=args.overwrite)

    write_asset_manifest(
        asset_manifest_out,
        base_dir=base_dir,
        source_manifest=manifest_path,
        summary=run.summary,
        assets=run.assets,
        dry_run=args.dry_run,
    )

    print(
        "Upload summary: "
        f"{run.summary.successful_uploads} uploaded, "
        f"{run.summary.planned_uploads} planned, "
        f"{run.summary.missing_files} missing, "
        f"{run.summary.failed_uploads} failed, "
        f"{run.summary.invalid_paths} invalid paths."
    )
    print(f"Asset manifest written to {asset_manifest_out}")

    return run.summary.exit_code


if __name__ == "__main__":
    sys.exit(main())
