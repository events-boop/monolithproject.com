import { motion, useScroll, useTransform } from "framer-motion";
import { Ticket } from "lucide-react";
import { POSH_TICKET_URL } from "@/data/events";

export default function FixedTicketBadge() {
    const { scrollY } = useScroll();
    const rotate = useTransform(scrollY, [0, 1000], [0, 360]);

    return (
        <div className="fixed bottom-6 right-6 z-50 hidden md:block mix-blend-difference">
            <a
                href={POSH_TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-32 h-32 rounded-full cursor-pointer"
                aria-label="Get Tickets"
            >
                {/* Rotating Text Ring */}
                <motion.div
                    style={{ rotate }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                    <svg viewBox="0 0 100 100" width="100%" height="100%" className="animate-[spin_10s_linear_infinite]">
                        <defs>
                            <path
                                id="circlePath"
                                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                            />
                        </defs>
                        <text className="text-[11px] font-bold uppercase tracking-[0.18em] fill-white font-mono">
                            <textPath xlinkHref="#circlePath" startOffset="0%">
                                Get Tickets • The Monolith Project • Get Tickets •
                            </textPath>
                        </text>
                    </svg>
                </motion.div>

                {/* Center Icon */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-110">
                    <Ticket className="w-5 h-5" />
                </div>
            </a>
        </div>
    );
}
