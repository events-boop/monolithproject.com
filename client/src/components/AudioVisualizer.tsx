export default function AudioVisualizer({ isActive }: { isActive: boolean }) {
    if (!isActive) return null;

    return (
        <div className="flex items-end gap-[2px] h-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="w-1 bg-primary rounded-t-sm"
                    style={{
                        animation: `visualizerBar ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                        animationDelay: `${Math.random() * 0.3}s`,
                        height: '20%',
                    }}
                />
            ))}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes visualizerBar {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}} />
        </div>
    );
}
