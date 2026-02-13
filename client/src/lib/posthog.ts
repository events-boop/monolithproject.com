import posthog from "posthog-js";

export const initPostHog = () => {
    if (import.meta.env.VITE_POSTHOG_KEY) {
        posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
            api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
            person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
            capture_pageview: false, // We handle this manually in the provider
        });
    }
};

export default posthog;
