import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { MapPin, Send, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import MagneticButton from "@/components/MagneticButton";

// Form Schema
const bookingSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    entity: z.string().min(2, "Company or Artist name is required"),
    type: z.enum(["partner-on-location", "artist-booking", "sponsorship", "general"]),
    location: z.string().optional(),
    message: z.string().min(10, "Please provide more details"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Booking() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            type: "partner-on-location"
        }
    });

    const selectedType = watch("type");

    const onSubmit = async (data: BookingFormValues) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Form Submitted:", data);
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <Link href="/">
                        <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm tracking-widest uppercase mb-8 cursor-pointer">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Signal
                        </a>
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-5xl md:text-7xl mb-6"
                    >
                        INITIATE <span className="text-primary">SEQUENCE</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground font-light max-w-2xl"
                    >
                        Submit your transmission. Whether you represent a venue, an artist, or a brand,
                        we review every signal for alignment with the Monolith.
                    </motion.p>
                </div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card/30 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-lg relative overflow-hidden"
                >
                    {/* Decorative Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                    {isSubmitted ? (
                        <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500"
                            >
                                <CheckCircle className="w-10 h-10" />
                            </motion.div>
                            <h3 className="font-display text-3xl mb-4">TRANSMISSION RECEIVED</h3>
                            <p className="text-muted-foreground max-w-md">
                                Your signal has been captured. Our team will decode your request and respond if alignment is detected.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">

                            {/* Request Type Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                                        Signal Type
                                    </label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { id: "partner-on-location", label: "Partner on Location" },
                                            { id: "artist-booking", label: "Artist Booking" },
                                            { id: "sponsorship", label: "Sponsorship" },
                                            { id: "general", label: "General Inquiry" },
                                        ].map((type) => (
                                            <label
                                                key={type.id}
                                                className={`cursor-pointer border p-4 rounded-md text-center transition-all duration-300 ${watch("type") === type.id
                                                    ? "bg-primary/20 border-primary text-primary"
                                                    : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    value={type.id}
                                                    {...register("type")}
                                                    className="sr-only"
                                                />
                                                <span className="text-xs font-bold uppercase tracking-wider">{type.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Personal Info */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                                            Identity Name
                                        </label>
                                        <input
                                            {...register("name")}
                                            className="w-full bg-black/50 border border-white/10 rounded p-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                            placeholder="Enter full name"
                                        />
                                        {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                                            Digital Contact
                                        </label>
                                        <input
                                            {...register("email")}
                                            className="w-full bg-black/50 border border-white/10 rounded p-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                            placeholder="email@address.com"
                                        />
                                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                                    </div>
                                </div>

                                {/* Entity Info */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                                            Entity / Organization
                                        </label>
                                        <input
                                            {...register("entity")}
                                            className="w-full bg-black/50 border border-white/10 rounded p-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                            placeholder="Company, Venue, or Artist Name"
                                        />
                                        {errors.entity && <span className="text-red-500 text-xs mt-1">{errors.entity.message}</span>}
                                    </div>

                                    {/* Conditional Location Field */}
                                    <motion.div
                                        initial={{ opacity: 0.5 }}
                                        animate={{ opacity: selectedType === "partner-on-location" ? 1 : 0.5 }}
                                    >
                                        <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> Location / Venue
                                        </label>
                                        <input
                                            {...register("location")}
                                            disabled={selectedType !== "partner-on-location"}
                                            className={`w-full bg-black/50 border border-white/10 rounded p-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${selectedType !== 'partner-on-location' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            placeholder={selectedType === "partner-on-location" ? "City, State, or Venue Name" : "N/A"}
                                        />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                                    Transmission Details
                                </label>
                                <textarea
                                    {...register("message")}
                                    rows={6}
                                    className="w-full bg-black/50 border border-white/10 rounded p-4 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                                    placeholder="Tell us about your proposal, dates, or vision..."
                                />
                                {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <MagneticButton strength={0.2}>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase rounded hover:bg-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-pulse">Transmitting...</span>
                                        ) : (
                                            <>
                                                <span>Broadcast Signal</span>
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </MagneticButton>
                            </div>

                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
