import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Handshake, Music, Camera, Info, Send, CheckCircle2 } from "lucide-react";
import { useInquiry } from "@/contexts/InquiryContext";
import MagneticButton from "./MagneticButton";
import { useEffect, useState } from "react";
import RevealText from "./RevealText";
import { cn } from "@/lib/utils";

export default function InquiryPortal() {
  const { isOpen, type, closeInquiry } = useInquiry();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSubmitted(false);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const titles: Record<string, string> = {
    sponsor: "Partnership Inquiry",
    venue: "Venue Collaboration",
    artist: "Artist Submission",
    general: "Contact Office",
    booking: "Private Event Booking",
    press: "Media & Press Access"
  };

  const descriptions: Record<string, string> = {
    sponsor: "Inquire about strategic brand partnerships and event activations.",
    venue: "Submit your venue or space for project consideration and logistics review.",
    artist: "Submit your audio portfolio and technical riders for our talent roster.",
    general: "Direct all general inquiries regarding project operations and network access.",
    booking: "Request professional booking for a Monolith-managed production or experience.",
    press: "Request media credentials or professional assets for editorial use."
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-end overflow-hidden p-0 md:p-6 lg:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeInquiry}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-crosshair"
        />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="relative z-10 h-full w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-y-auto scrollbar-hide"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-8 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary">Office / Inquiry</span>
              <h2 className="font-display text-2xl uppercase tracking-tight text-white">{titles[type]}</h2>
            </div>
            <MagneticButton strength={0.2}>
              <button 
                onClick={closeInquiry}
                className="p-3 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Portal"
              >
                <X className="w-5 h-5" />
              </button>
            </MagneticButton>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-12">
            {!submitted ? (
              <div className="flex flex-col gap-12">
                <div>
                  <RevealText 
                    text={descriptions[type]}
                    className="text-white/60 text-lg font-light leading-relaxed max-w-lg mb-8"
                  />
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="flex flex-col gap-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InquiryField label="Full Name" placeholder="Alex Rivera" required />
                    <InquiryField label="Email Address" placeholder="alex@frequency.com" type="email" required />
                  </div>

                  <InquiryField label="Organization / Project" placeholder="Brand or Collective Name" />

                  {type === "artist" ? (
                    <InquiryField label="Streaming Link" placeholder="SoundCloud, Spotify, or Mixcloud" required />
                  ) : type === "venue" ? (
                    <InquiryField label="Venue Location" placeholder="City, Neighborhood" required />
                  ) : type === "sponsor" ? (
                    <InquiryField label="Partnership Goals" placeholder="What are you looking to achieve?" multiline />
                  ) : (
                    <InquiryField label="Message / Project Brief" placeholder="Enter project details and operational requirements..." multiline required />
                  )}

                  <div className="mt-8">
                    <button 
                      type="submit"
                      className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black font-display text-xs uppercase tracking-[0.4em] font-black transition-all hover:bg-primary hover:text-white hover:scale-[1.02]"
                    >
                      <Send className="w-4 h-4" />
                      SUBMIT ENQUIRY
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-3xl uppercase tracking-tighter text-white mb-4">Signal Captured</h3>
                <p className="text-white/50 max-w-sm leading-relaxed mb-12">
                  Your submission has been logged into the Monolith database. Our operational team will review the brief and contact you via the provided signal.
                </p>
                <button 
                  onClick={closeInquiry}
                  className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function InquiryField({ label, placeholder, type = "text", required = false, multiline = false }: any) {
  const InputComponent = multiline ? "textarea" : "input";
  return (
    <div className="flex flex-col gap-3 group">
      <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 group-focus-within:text-primary transition-colors">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <InputComponent
        type={type}
        required={required}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 outline-none focus:border-primary transition-colors font-light text-lg md:text-xl"
      />
    </div>
  );
}
