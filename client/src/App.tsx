import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Analytics from "./components/Analytics";
import DeferredEnhancements from "./components/DeferredEnhancements";
import EventBanner from "./components/EventBanner";

import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
const Home = lazy(() => import("./pages/Home"));

const Tickets = lazy(() => import("./pages/Tickets"));
const About = lazy(() => import("./pages/About"));
const ArtistProfile = lazy(() => import("./pages/ArtistProfile"));
const SponsorAccess = lazy(() => import("./pages/SponsorAccess"));
const ChasingSunsets = lazy(() => import("./pages/ChasingSunsets"));
const Radio = lazy(() => import("./pages/Radio"));
const UntoldStory = lazy(() => import("./pages/UntoldStory"));
const Booking = lazy(() => import("./pages/Booking"));
const Partners = lazy(() => import("./pages/Partners"));
const Lineup = lazy(() => import("./pages/Lineup"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const Contact = lazy(() => import("./pages/Contact"));
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
        <Route path={"/radio"} component={RadioTransition} />
        <Route path={"/story"} component={UntoldStoryTransition} />
        <Route path={"/untold-story-deron-juany-bravo"} component={UntoldStoryTransition} />
        <Route path={"/booking"} component={BookingTransition} />
        <Route path={"/lineup"} component={LineupTransition} />
        <Route path={"/schedule"} component={ScheduleTransition} />
        <Route path={"/newsletter"} component={NewsletterTransition} />
        <Route path={"/contact"} component={ContactTransition} />
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
const RadioTransition = withTransition(Radio);
const UntoldStoryTransition = withTransition(UntoldStory);
const BookingTransition = withTransition(Booking);
const LineupTransition = withTransition(Lineup);
const ScheduleTransition = withTransition(Schedule);
const NewsletterTransition = withTransition(Newsletter);
const ContactTransition = withTransition(Contact);
const PartnersTransition = withTransition(Partners);
const TermsTransition = withTransition(Terms);
const PrivacyTransition = withTransition(Privacy);
const CookiesTransition = withTransition(Cookies);
const NotFoundTransition = withTransition(NotFoundLazy);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Analytics />
          <EventBanner />
          <DeferredEnhancements />
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            {/* Skip-link target; pages may define their own <main>, so avoid nesting <main> here. */}
            <div id="main-content" tabIndex={-1} className="w-full">
              <div className="origin-top">
                <Router />
              </div>
            </div>
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
