import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Analytics from "./components/Analytics";
import DeferredEnhancements from "./components/DeferredEnhancements";
import EventBanner from "./components/EventBanner";

import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import Home from "./pages/Home";
import GlobalSVGFilters from "./components/ui/GlobalSVGFilters";

const Tickets = lazy(() => import("./pages/Tickets"));
const About = lazy(() => import("./pages/About"));
const ArtistProfile = lazy(() => import("./pages/ArtistProfile"));
const SponsorAccess = lazy(() => import("./pages/SponsorAccess"));
const ChasingSunsets = lazy(() => import("./pages/ChasingSunsets"));
const ChasingSunsetsFacts = lazy(() => import("./pages/ChasingSunsetsFacts"));
const Radio = lazy(() => import("./pages/Radio"));
const RadioEpisode = lazy(() => import("./pages/RadioEpisode"));
const UntoldStory = lazy(() => import("./pages/UntoldStory"));
const Booking = lazy(() => import("./pages/Booking"));
const Partners = lazy(() => import("./pages/Partners"));
const Lineup = lazy(() => import("./pages/Lineup"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFoundLazy = lazy(() => import("./pages/NotFound"));

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path={"/"} component={HomeTransition} />
        <Route path={"/tickets"} component={TicketsTransition} />
        <Route path={"/artists/:id"} component={ArtistProfileTransition} />
        <Route path={"/sponsors"} component={SponsorAccessTransition} />
        <Route path={"/about"} component={AboutTransition} />
        <Route path={"/togetherness"} component={AboutTransition} />
        <Route path={"/chasing-sunsets"} component={ChasingSunsetsTransition} />
        <Route path={"/chasing-sunsets/:season"} component={ArchiveGalleryPageTransition} />
        <Route path={"/radio"} component={RadioTransition} />
        <Route path={"/radio/:slug"} component={RadioEpisodeTransition} />
        <Route path={"/story"} component={UntoldStoryTransition} />
        <Route path={"/untold-story/:season"} component={ArchiveGalleryPageTransition} />
        <Route path={"/untold-story-deron-juany-bravo"} component={UntoldStoryTransition} />
        <Route path={"/booking"} component={BookingTransition} />
        <Route path={"/lineup"} component={LineupTransition} />
        <Route path={"/schedule"} component={ScheduleTransition} />
        <Route path={"/newsletter"} component={NewsletterTransition} />
        <Route path={"/contact"} component={ContactTransition} />
        <Route path={"/faq"} component={FAQTransition} />
        <Route path={"/partners"} component={PartnersTransition} />
        <Route path={"/terms"} component={TermsTransition} />
        <Route path={"/privacy"} component={PrivacyTransition} />
        <Route path={"/cookies"} component={CookiesTransition} />
        <Route path={"/404"} component={NotFoundTransition} />
        <Route component={NotFoundTransition} />
      </Switch>
    </AnimatePresence>
  );
}

import PageTransition from "./components/PageTransition";

const withTransition = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
      className="w-full"
    >
      <Component {...props} />
    </motion.div>
  );
};

const HomeTransition = withTransition(Home);
const TicketsTransition = withTransition(Tickets);
const ArtistProfileTransition = withTransition(ArtistProfile);
const SponsorAccessTransition = withTransition(SponsorAccess);
const AboutTransition = withTransition(About);
const ChasingSunsetsTransition = withTransition(ChasingSunsets);
const ChasingSunsetsFactsTransition = withTransition(ChasingSunsetsFacts);
const RadioTransition = withTransition(Radio);
const RadioEpisodeTransition = withTransition(RadioEpisode);
const UntoldStoryTransition = withTransition(UntoldStory);
const BookingTransition = withTransition(Booking);
const LineupTransition = withTransition(Lineup);
const ScheduleTransition = withTransition(Schedule);
const NewsletterTransition = withTransition(Newsletter);
const ContactTransition = withTransition(Contact);
const FAQTransition = withTransition(FAQ);
const PartnersTransition = withTransition(Partners);
const TermsTransition = withTransition(Terms);
const PrivacyTransition = withTransition(Privacy);
const CookiesTransition = withTransition(Cookies);
const NotFoundTransition = withTransition(NotFoundLazy);
const ShopTransition = withTransition(Shop);
const AmbassadorsTransition = withTransition(Ambassadors);
const TravelTransition = withTransition(Travel);
const GuideTransition = withTransition(Guide);
const VIPTransition = withTransition(VIP);
const ArchiveGalleryPageTransition = withTransition(
  lazy(() => import("./pages/ArchiveGalleryPage"))
);


const Analytics = lazy(() => import("./components/Analytics"));
const DeferredEnhancements = lazy(() => import("./components/DeferredEnhancements"));
const EventBanner = lazy(() => import("./components/EventBanner"));
const KineticGrain = lazy(() => import("./components/ui/CinematicGrain").then(module => ({ default: module.KineticGrain })));
const CustomCursor = lazy(() => import("./components/CustomCursor"));
const CookieConsent = lazy(() => import("./components/CookieConsent"));

// ... (Router component remains unchanged)

import SmoothScroll from "./components/SmoothScroll";
import { UIProvider } from "./contexts/UIContext";
import OffCanvasDrawer from "./components/ui/OffCanvasDrawer";
import GlobalTicketButton from "./components/GlobalTicketButton";

// ... existing imports ...

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark">
          <UIProvider>
            <TooltipProvider>
              <SmoothScroll />
              <Toaster />
              <Suspense fallback={null}>
                <KineticGrain />
                <CustomCursor />
                <Preloader onComplete={() => { }} />
                <Analytics />
                <EventBanner />
                <DeferredEnhancements />
                <CookieConsent />

                <OffCanvasDrawer />
                <GlobalTicketButton />

                {/* Skip-link target; pages may define their own <main>, so avoid nesting <main> here. */}
                <div id="main-content" tabIndex={-1} className="w-full">
                  <div className="origin-top">
                    <Router />
                  </div>
                </div>
              </Suspense>
            </TooltipProvider>
          </UIProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
