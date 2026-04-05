import { motion } from "framer-motion";
import { ArrowRight, Ticket, Lock, Zap, Clock, CheckCircle2 } from "lucide-react";
import { ScheduledEvent } from "@/data/events";
import { getEventCta, FunnelTool, isEventLowInventory } from "@/lib/cta";
import MagneticButton from "@/components/MagneticButton";

interface ConversionCTAProps {
  event?: ScheduledEvent | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showUrgency?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export default function ConversionCTA({ 
  event, 
  className = "", 
  size = "md", 
  showUrgency = true,
  variant = "primary"
}: ConversionCTAProps) {
  const cta = getEventCta(event);
  
  const sizeClasses = {
    sm: "px-6 py-3 text-[10px]",
    md: "px-8 py-4 text-[12px]",
    lg: "px-10 py-5 text-[14px]",
    xl: "px-12 py-6 text-[16px]",
  };

  const toolIcons: Record<FunnelTool, React.ReactNode> = {
    laylo: <Lock className="w-4 h-4" />,
    posh: <Ticket className="w-4 h-4" />,
    fillout: <Zap className="w-4 h-4" />,
  };

  const toolStyles: Record<FunnelTool, string> = {
    posh: "cta-posh",
    laylo: "cta-laylo",
    fillout: "cta-fillout",
  };

  const urgencyText = event?.status === 'on-sale' && isEventLowInventory(event)
    ? "Final Tier — 90% Sold Out"
    : event?.status === 'coming-soon'
    ? "Join 12,000+ on the priority list"
    : null;

  const baseButton = (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <a
        href={cta.href}
        target={cta.isExternal ? "_blank" : undefined}
        rel={cta.isExternal ? "noopener noreferrer" : undefined}
        className={`
          group relative flex items-center justify-center gap-4 
          transition-all duration-500 rounded-none
          ${sizeClasses[size]} w-full sm:w-auto
          ${toolStyles[cta.tool]}
        `}
      >
        <span className="relative z-10 flex items-center gap-3">
          {toolIcons[cta.tool]}
          {cta.label}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </a>

      {showUrgency && urgencyText && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/40"
        >
          <Clock className="w-3 h-3 text-primary/60" />
          {urgencyText}
        </motion.div>
      )}
    </div>
  );

  return (
    <MagneticButton strength={size === 'xl' ? 0.3 : 0.2}>
      {baseButton}
    </MagneticButton>
  );
}
