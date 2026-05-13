import re

with open("client/src/components/ScheduleSection.tsx", "r") as f:
    content = f.read()

# Replace light theme backgrounds
content = content.replace('bg-[#ECEBE6]', 'bg-[#050505]')
content = content.replace('bg-white/75', 'bg-white/[0.02]')
content = content.replace('bg-white/55', 'bg-white/[0.04]')
content = content.replace('bg-white/88', 'bg-white/[0.02]')
content = content.replace('bg-white', 'bg-black')

# Replace text colors
content = content.replace('text-black/85', 'text-white/85')
content = content.replace('text-black/78', 'text-white/78')
content = content.replace('text-black/70', 'text-white/70')
content = content.replace('text-black/65', 'text-white/65')
content = content.replace('text-black/62', 'text-white/62')
content = content.replace('text-black/60', 'text-white/60')
content = content.replace('text-black/58', 'text-white/58')
content = content.replace('text-black/55', 'text-white/55')
content = content.replace('text-black/45', 'text-white/45')
content = content.replace('text-black/30', 'text-white/30')
content = content.replace('text-black', 'text-white')

# Replace border colors
content = content.replace('border-black/15', 'border-white/15')
content = content.replace('border-black/10', 'border-white/10')

# Replace specific styles
content = content.replace('MONOLITH_ORANGE_ON_LIGHT', 'MONOLITH_ORANGE')
content = content.replace('getSeriesColorOnLight', 'getSeriesColor')
content = content.replace('shadow-[0_24px_70px_rgba(0,0,0,0.09),inset_0_1px_0_rgba(255,255,255,0.75)]', 'shadow-[0_24px_70px_rgba(0,0,0,0.4)]')
content = content.replace('shadow-[inset_0_1px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)]', 'shadow-none')

with open("client/src/components/ScheduleSection.tsx", "w") as f:
    f.write(content)
