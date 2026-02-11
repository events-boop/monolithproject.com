import shutil
import os

src = "/Users/starkindustries/.gemini/antigravity/brain/4eca15b2-d7b7-451d-b0d3-32f3255be22f/.tempmediaStorage/media_4eca15b2-d7b7-451d-b0d3-32f3255be22f_1770696083683.png"
dst = "client/public/images/untold-story-juany-deron.png"

# Use absolute path for destination
dst = os.path.abspath(dst)

print(f"Copying {src} to {dst}")
try:
    shutil.copy2(src, dst)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
