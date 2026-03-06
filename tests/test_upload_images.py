import contextlib
import importlib.util
import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock


MODULE_PATH = (
    Path(__file__).resolve().parents[1] / "scripts" / "upload_images.py"
)

SPEC = importlib.util.spec_from_file_location("upload_images", MODULE_PATH)
upload_images = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(upload_images)


class UploadImagesTests(unittest.TestCase):
    def write_manifest(self, directory: Path, payload) -> Path:
        manifest_path = directory / "manifest.json"
        manifest_path.write_text(json.dumps(payload), encoding="utf-8")
        return manifest_path

    def test_load_manifest_rejects_duplicate_public_ids(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            manifest_path = self.write_manifest(
                tmp_path,
                [
                    {"filename": "a.jpg", "public_id": "dup"},
                    {"filename": "b.jpg", "public_id": "dup"},
                ],
            )

            with self.assertRaises(RuntimeError):
                upload_images.load_manifest(manifest_path)

    def test_resolve_upload_path_rejects_escape(self):
        with tempfile.TemporaryDirectory() as tmp:
            base_dir = Path(tmp).resolve()

            with self.assertRaises(RuntimeError):
                upload_images.resolve_upload_path(base_dir, "../escape.jpg")

    def test_main_returns_zero_for_successful_upload_batch(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            base_dir = tmp_path / "images"
            base_dir.mkdir()
            (base_dir / "a.jpg").write_text("a", encoding="utf-8")
            (base_dir / "b.jpg").write_text("b", encoding="utf-8")
            asset_manifest_out = tmp_path / "assets.json"

            manifest_path = self.write_manifest(
                tmp_path,
                [
                    {"filename": "a.jpg", "public_id": "one"},
                    {"filename": "b.jpg", "public_id": "two"},
                ],
            )

            upload_calls = []

            def fake_upload(path, public_id, overwrite):
                upload_calls.append((path.name, public_id, overwrite))
                return upload_images.AssetRecord(
                    filename=path.name,
                    public_id=public_id,
                    status="uploaded",
                    source_path=str(path),
                    secure_url=f"https://example.com/{public_id}",
                    width=1200,
                    height=800,
                    bytes=12345,
                    format="jpg",
                    version="7",
                )

            stdout = io.StringIO()
            with (
                mock.patch.object(upload_images, "configure_cloudinary"),
                mock.patch.object(upload_images, "upload_image", side_effect=fake_upload),
                contextlib.redirect_stdout(stdout),
            ):
                exit_code = upload_images.main(
                    [
                        "--base-dir",
                        str(base_dir),
                        "--manifest",
                        str(manifest_path),
                        "--asset-manifest-out",
                        str(asset_manifest_out),
                    ]
                )

            self.assertEqual(0, exit_code)
            self.assertEqual(
                [("a.jpg", "one", False), ("b.jpg", "two", False)],
                upload_calls,
            )
            self.assertIn(
                "2 uploaded, 0 planned, 0 missing, 0 failed, 0 invalid paths",
                stdout.getvalue(),
            )
            payload = json.loads(asset_manifest_out.read_text(encoding="utf-8"))
            self.assertEqual(0, payload["summary"]["exit_code"])
            self.assertEqual("uploaded", payload["assets"][0]["status"])
            self.assertEqual("https://example.com/one", payload["assets"][0]["secure_url"])
            self.assertEqual(1200, payload["assets"][0]["width"])

    def test_main_returns_nonzero_for_missing_and_failed_uploads(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            base_dir = tmp_path / "images"
            base_dir.mkdir()
            (base_dir / "a.jpg").write_text("a", encoding="utf-8")
            asset_manifest_out = tmp_path / "assets.json"

            manifest_path = self.write_manifest(
                tmp_path,
                [
                    {"filename": "a.jpg", "public_id": "one"},
                    {"filename": "missing.jpg", "public_id": "two"},
                ],
            )

            stderr = io.StringIO()
            stdout = io.StringIO()
            with (
                mock.patch.object(upload_images, "configure_cloudinary"),
                mock.patch.object(
                    upload_images,
                    "upload_image",
                    return_value=upload_images.AssetRecord(
                        filename="a.jpg",
                        public_id="one",
                        status="failed",
                        source_path=str(base_dir / "a.jpg"),
                        error="Upload failed.",
                    ),
                ),
                contextlib.redirect_stdout(stdout),
                contextlib.redirect_stderr(stderr),
            ):
                exit_code = upload_images.main(
                    [
                        "--base-dir",
                        str(base_dir),
                        "--manifest",
                        str(manifest_path),
                        "--asset-manifest-out",
                        str(asset_manifest_out),
                    ]
                )

            self.assertEqual(1, exit_code)
            self.assertIn("File not found", stderr.getvalue())
            self.assertIn(
                "0 uploaded, 0 planned, 1 missing, 1 failed, 0 invalid paths",
                stdout.getvalue(),
            )
            payload = json.loads(asset_manifest_out.read_text(encoding="utf-8"))
            self.assertEqual("failed", payload["assets"][0]["status"])
            self.assertEqual("missing", payload["assets"][1]["status"])

    def test_main_returns_nonzero_for_invalid_manifest_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            base_dir = tmp_path / "images"
            base_dir.mkdir()
            asset_manifest_out = tmp_path / "assets.json"

            manifest_path = self.write_manifest(
                tmp_path,
                [{"filename": "../escape.jpg", "public_id": "one"}],
            )

            stderr = io.StringIO()
            stdout = io.StringIO()
            with (
                mock.patch.object(upload_images, "configure_cloudinary"),
                contextlib.redirect_stdout(stdout),
                contextlib.redirect_stderr(stderr),
            ):
                exit_code = upload_images.main(
                    [
                        "--base-dir",
                        str(base_dir),
                        "--manifest",
                        str(manifest_path),
                        "--asset-manifest-out",
                        str(asset_manifest_out),
                    ]
                )

            self.assertEqual(1, exit_code)
            self.assertIn("escapes the base directory", stderr.getvalue())
            self.assertIn(
                "0 uploaded, 0 planned, 0 missing, 0 failed, 1 invalid paths",
                stdout.getvalue(),
            )
            payload = json.loads(asset_manifest_out.read_text(encoding="utf-8"))
            self.assertEqual("invalid_path", payload["assets"][0]["status"])

    def test_main_dry_run_skips_cloudinary_setup(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            base_dir = tmp_path / "images"
            base_dir.mkdir()
            (base_dir / "a.jpg").write_text("a", encoding="utf-8")
            asset_manifest_out = tmp_path / "assets.json"

            manifest_path = self.write_manifest(
                tmp_path,
                [{"filename": "a.jpg", "public_id": "one"}],
            )

            stdout = io.StringIO()
            with (
                mock.patch.object(
                    upload_images,
                    "configure_cloudinary",
                    side_effect=AssertionError("configure_cloudinary should not run"),
                ),
                contextlib.redirect_stdout(stdout),
            ):
                exit_code = upload_images.main(
                    [
                        "--base-dir",
                        str(base_dir),
                        "--manifest",
                        str(manifest_path),
                        "--asset-manifest-out",
                        str(asset_manifest_out),
                        "--dry-run",
                    ]
                )

            self.assertEqual(0, exit_code)
            self.assertIn("Dry run: would upload", stdout.getvalue())
            self.assertIn(
                "0 uploaded, 1 planned, 0 missing, 0 failed, 0 invalid paths",
                stdout.getvalue(),
            )
            payload = json.loads(asset_manifest_out.read_text(encoding="utf-8"))
            self.assertTrue(payload["dry_run"])
            self.assertEqual("planned", payload["assets"][0]["status"])

    def test_main_dry_run_honors_overwrite_flag(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            base_dir = tmp_path / "images"
            base_dir.mkdir()
            (base_dir / "a.jpg").write_text("a", encoding="utf-8")
            asset_manifest_out = tmp_path / "assets.json"

            manifest_path = self.write_manifest(
                tmp_path,
                [{"filename": "a.jpg", "public_id": "one"}],
            )

            stdout = io.StringIO()
            with contextlib.redirect_stdout(stdout):
                exit_code = upload_images.main(
                    [
                        "--base-dir",
                        str(base_dir),
                        "--manifest",
                        str(manifest_path),
                        "--asset-manifest-out",
                        str(asset_manifest_out),
                        "--dry-run",
                        "--overwrite",
                    ]
                )

            self.assertEqual(0, exit_code)
            self.assertIn("Dry run: would overwrite", stdout.getvalue())


if __name__ == "__main__":
    unittest.main()
