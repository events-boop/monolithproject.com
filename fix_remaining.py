import os

replacements = {
    "client/src/pages/Partners.tsx": [
        ("bg-zinc-950/70", "bg-[#111111]/70"),
        ("bg-zinc-950/60", "bg-[#111111]/60"),
        ("bg-zinc-950/40", "bg-[#111111]/40"),
        ("bg-zinc-900/50", "bg-[#1a1a1a]/50"),
        ("bg-zinc-950", "bg-[#111111]"),
    ],
    "client/src/components/EntityBoostStrip.tsx": [
        ("text-charcoal", "text-black"),
        ("border-charcoal", "border-black"),
        ("luxe-surface-light", "luxe-surface-dark"),
        ("luxe-surface-warm", "luxe-surface-dark"),
    ],
    "client/src/components/untold-story/UntoldContent.tsx": [
        ("hover:bg-gray-100", "hover:bg-[#e7e5e4]"),
    ],
    "client/src/components/SocialGrid.tsx": [
        ("charcoal", "black"),
    ]
}

for filepath, reps in replacements.items():
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    with open(filepath, "r") as f:
        content = f.read()
    
    modified = content
    for old, new in reps:
        modified = modified.replace(old, new)
        
    if modified != content:
        with open(filepath, "w") as f:
            f.write(modified)
        print(f"Updated {filepath}")

