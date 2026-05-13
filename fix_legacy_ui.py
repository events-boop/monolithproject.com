import os
import glob

replacements = {
    "btn-pill-neutral": "btn-pill-monolith",
    "btn-pill-dark": "btn-pill-monolith",
    "bg-[#F4ECD9]": "bg-[#050505]",
    "bg-[#F4ECD9]/90": "bg-[#050505]/90",
    "text-[#121212]": "text-white",
    "text-[#A8492E]": "text-primary",
    "border-black/10": "border-white/10",
    "text-black/70": "text-white/70",
    "text-black/75": "text-white/75",
    "bg-white/45": "bg-white/[0.04]",
}

files_to_check = [
    "client/src/components/SlimSubscribeStrip.tsx",
    "client/src/components/JoinSignalSection.tsx",
    "client/src/components/InquiryPortal.tsx",
    "client/src/components/NewsletterSection.tsx",
    "client/src/pages/NotFound.tsx",
    "client/src/pages/InsightArticle.tsx",
    "client/src/pages/AdminDashboard.tsx",
    "client/src/pages/FAQ.tsx",
    "client/src/components/InteractiveNavigationOverlay.tsx",
    "client/src/pages/Home.tsx",
    "client/src/components/SectionDivider.tsx",
    "client/src/components/EntityBoostStrip.tsx",
    "client/src/pages/ChasingSunsetsFacts.tsx",
    "client/src/pages/RadioEpisode.tsx"
]

for filepath in files_to_check:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r") as f:
        content = f.read()
    
    modified = content
    for old, new in replacements.items():
        modified = modified.replace(old, new)
        
    if modified != content:
        with open(filepath, "w") as f:
            f.write(modified)
        print(f"Updated {filepath}")

