import shutil
import os

src = "/Users/starkindustries/.gemini/antigravity/brain/88ea024d-a50e-492a-a906-dd82d7a05f91/uploaded_image_1768625866949.jpg"
dst = "/Users/starkindustries/Downloads/monolith-project website /client/public/images/lazare-profile.jpg"

try:
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Successfully copied {src} to {dst}")
    else:
        print(f"Source file not found: {src}")
except Exception as e:
    print(f"Error copying file: {e}")
