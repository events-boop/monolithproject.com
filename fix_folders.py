import shutil
import os

src_dir = "/Users/starkindustries/Downloads/monolith-project website /client/public/images"
dst_dir = "/Users/starkindustries/Downloads/monolith-project website/client/public/images"

print(f"Copying from {src_dir} to {dst_dir}")

for filename in os.listdir(src_dir):
    src = os.path.join(src_dir, filename)
    dst = os.path.join(dst_dir, filename)
    if os.path.isfile(src):
        shutil.copy2(src, dst)
        print(f"Copied {filename}")

bad_folder = "/Users/starkindustries/Downloads/monolith-project website "
print(f"Removing {bad_folder}")
shutil.rmtree(bad_folder)
print("Done")
