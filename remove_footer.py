import os
import glob
import re

directory = "./client/src/pages"
files = glob.glob(os.path.join(directory, "*.tsx"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove import
    content = re.sub(r'import\s+Footer\s+from\s+["\'].*Footer["\'];?\n', '', content)
    
    # Remove <Footer />
    # Also <Footer></Footer> just in case, though it's usually self-closing
    content = re.sub(r'^\s*<Footer\s*/>\s*\n', '', content, flags=re.MULTILINE)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Removed Footer from {len(files)} files.")
