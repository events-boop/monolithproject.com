import { useEffect } from "react";

interface StructuredDataProps {
    type: "Event" | "Organization" | "BreadcrumbList";
    data: Record<string, any>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": type,
        ...data,
    });

    useEffect(() => {
        // Use a stable ID so re-renders update in place instead of appending duplicates
        const id = `jsonld-${type}`;
        let script = document.head.querySelector<HTMLScriptElement>(`#${id}`);
        if (!script) {
            script = document.createElement("script");
            script.id = id;
            script.type = "application/ld+json";
            document.head.appendChild(script);
        }
        script.text = jsonLd;
        return () => { script.remove(); };
    }, [jsonLd, type]);

    return null;
}

export function EventSchema({
    name,
    startDate,
    endDate,
    location,
    image,
    description,
    offers,
    performer
}: {
    name: string;
    startDate: string;
    endDate?: string;
    location: {
        name: string;
        address: string;
    };
    image: string[];
    description: string;
    offers?: {
        url: string;
        price: string;
        currency: string;
        availability: string;
    };
    performer?: {
        name: string;
        type: "Person" | "PerformingGroup";
    }[];
}) {
    return (
        <StructuredData
            type="Event"
            data={{
                name,
                startDate,
                endDate,
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                location: {
                    "@type": "Place",
                    name: location.name,
                    address: {
                        "@type": "PostalAddress",
                        streetAddress: location.address,
                        addressLocality: "Chicago",
                        addressRegion: "IL",
                        addressCountry: "US",
                    },
                },
                image,
                description,
                offers: offers ? {
                    "@type": "Offer",
                    url: offers.url,
                    price: offers.price,
                    priceCurrency: offers.currency,
                    availability: offers.availability,
                    validFrom: "2025-11-01",
                } : undefined,
                performer: performer?.map(p => ({
                    "@type": p.type,
                    name: p.name,
                })),
                organizer: {
                    "@type": "Organization",
                    name: "The Monolith Project",
                    url: "https://monolithproject.com",
                },
            }}
        />
    );
}
