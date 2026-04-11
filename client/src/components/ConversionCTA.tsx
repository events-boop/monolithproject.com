import { motion } from "framer-motion";
import { ArrowRight, Ticket, Lock, Zap, Clock, CheckCircle2 } from "lucide-react";
import { ScheduledEvent } from "@/data/events";
import { getEventCta, FunnelTool, isEventLowInventory } from "@/lib/cta";
import MagneticButton from "@/components/MagneticButton";
import { useIntentPrefetch } from "@/hooks/useIntentPrefetch";
import { useInquiry } from "@/contexts/InquiryContext";
import { isInquiryHref, parseInquiryType } from "@/lib/cta";

interface ConversionCTAProps {
  event?: ScheduledEvent | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showUrgency?: boolean;
  variant?: "primary" | "secondary" | "outline" | "experiential";
}

export default function ConversionCTA({ 
  event, 
  className = "", 
  size = "md", 
  showUrgency = true,
  variant = "primary"
}: ConversionCTAProps) {
  const cta = getEventCta(event);
  const { preconnectGateway } = useIntentPrefetch();
  const { openInquiry } = useInquiry();
  
  const sizeClasses = {
    sm: "px-5 py-2.5 text-[10px]",
    md: "px-6 py-3.5 md:px-8 md:py-4 text-[11px] md:text-[12px]",
    lg: "px-8 py-4 md:px-10 md:py-5 text-[12px] md:text-[14px]",
    xl: "px-10 py-5 md:px-12 md:py-6 text-[14px] md:text-[16px]",
  };

  const toolIcons: Record<FunnelTool, React.ReactNode> = {
    laylo: <Lock className="w-4 h-4" />,
    posh: <Ticket className="w-4 h-4" />,
    fillout: <Zap className="w-4 h-4" />,
  };

  const toolStyles: Record<FunnelTool | "experiential", string> = {
    posh: "cta-posh",
    laylo: "cta-laylo",
    fillout: "cta-fillout",
    experiential: "cta-experiential",
  };

  const systemReport = event?.status === 'on-sale' && isEventLowInventory(event)
    ? `[ CAPACITY // 94% EQUILIBRIUM ]`
    : null;

  const baseButton = (
    <div className={`flex flex-col items-center gap-0 ${className}`}>
      <a
        href={isInquiryHref(cta.href) ? "#" : cta.href}
        target={cta.isExternal ? "_blank" : undefined}
        rel={cta.isExternal ? "noopener noreferrer" : undefined}
        onClick={(e) => {
          if (isInquiryHref(cta.href)) {
            e.preventDefault();
            openInquiry(parseInquiryType(cta.href));
          }
        }}
        onMouseEnter={() => {
          if (cta.isExternal) preconnectGateway(cta.href);
        }}
        className={`
          group relative flex items-center justify-center gap-4 
          transition-all duration-500 rounded-none
          ${sizeClasses[size]} w-full sm:w-auto
          ${variant === 'experiential' ? toolStyles.experiential : toolStyles[cta.tool]}
          shadow-[0_20px_50px_rgba(0,0,0,0.15)]
          hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)]
          active:scale-[0.98]
        `}
      >
        <span className="relative z-10 flex items-center gap-3">
          {toolIcons[cta.tool]}
          {cta.label}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </a>

      {showUrgency && systemReport && (
        <div className="flex flex-col items-center w-full">
           {/* Architectural Data Bridge */}
           <motion.div 
             initial={{ height: 0 }}
             animate={{ height: size === 'sm' ? 12 : 16 }}
             className="w-[1px] bg-white/10 group-hover:bg-primary/30 transition-colors"
           />
           
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
              flex items-center gap-3 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] 
              px-4 py-1.5 border border-white/5 bg-white/[0.02]
              text-primary shadow-[0_4px_12px_rgba(0,0,0,0.2)]
            `}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            {systemReport}
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <MagneticButton strength={size === 'xl' ? 0.3 : 0.2}>
      {baseButton}
    </MagneticButton>
  );
}
