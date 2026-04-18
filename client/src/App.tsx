import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation, Redirect } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import PageTransition from "./components/PageTransition";
import { UIProvider, useUI } from "./contexts/UIContext";
import { InquiryProvider } from "./contexts/InquiryContext";
import ViewportLazy from "./components/ViewportLazy";
import { getSceneForPath } from "./lib/scenes";
import { syncAttributionForNavigation } from "./lib/attribution";
import { rememberVisitedPath } from "./lib/visitorContext";
import { ensurePublicSiteData } from "./lib/siteData";
import InquiryPortal from "./components/InquiryPortal";
import MonolithPreloader from "./components/MonolithPreloader";


// Lazy Pages
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
const EventDetails = lazy(() => import("./pages/EventDetails"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Press = lazy(() => import("./pages/Press"));
const Archive = lazy(() => import("./pages/Archive"));
const Submit = lazy(() => import("./pages/Submit"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const NotFoundLazy = lazy(() => import("./pages/NotFound"));
const Shop = lazy(() => import("./pages/Shop"));
const Ambassadors = lazy(() => import("./pages/Ambassadors"));
const Travel = lazy(() => import("./pages/Travel"));
const Guide = lazy(() => import("./pages/Guide"));
const VIP = lazy(() => import("./pages/VIP"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Insights = lazy(() => import("./pages/Insights"));
const InsightArticle = lazy(() => import("./pages/InsightArticle"));
const ArchiveGalleryPage = lazy(() => import("./pages/ArchiveGalleryPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const isMonolithOpsEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_MONOLITH_OPS === "true";

function RouteLoadingFallback() {
  return (
    <div
      className="min-h-[100svh] bg-background text-foreground flex items-center justify-center px-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm border border-white/10 bg-black/30 px-5 py-6 backdrop-blur-sm">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
          Loading Next Scene
        </div>
        <div className="mt-4 h-px overflow-hidden bg-white/8">
          <div className="h-full w-1/3 animate-[route-loader_1.2s_var(--motion-luxe)_infinite] bg-[var(--scene-accent)]" />
        </div>
      </div>
    </div>
  );
}

type RouteParams = Record<string, string | undefined>;
type RouteProps = { params?: RouteParams };

function withTransition<P extends RouteProps>(
  Component: React.ComponentType<P>,
) {
  return (props: P) => (
    <PageTransition>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Component {...props} />
      </Suspense>
    </PageTransition>
  );
}

// Transition Wrappers
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
const SubmitTransition = withTransition(Submit);
const LineupTransition = withTransition(Lineup);
const ScheduleTransition = withTransition(Schedule);
const EventDetailsTransition = withTransition(EventDetails);
const NewsletterTransition = withTransition(Newsletter);
const ContactTransition = withTransition(Contact);
const FAQTransition = withTransition(FAQ);
const PartnersTransition = withTransition(Partners);
const PressTransition = withTransition(Press);
const ArchiveTransition = withTransition(Archive);
const InsightsTransition = withTransition(Insights);
const InsightArticleTransition = withTransition(InsightArticle);
const TermsTransition = withTransition(Terms);
const PrivacyTransition = withTransition(Privacy);
const CookiesTransition = withTransition(Cookies);
const NotFoundTransition = withTransition(NotFoundLazy);
const ShopTransition = withTransition(Shop);
const AmbassadorsTransition = withTransition(Ambassadors);
const TravelTransition = withTransition(Travel);
const GuideTransition = withTransition(Guide);
const VIPTransition = withTransition(VIP);
const AlertsTransition = withTransition(Alerts);
const ArchiveGalleryPageTransition = withTransition(ArchiveGalleryPage);
const AdminDashboardTransition = withTransition(AdminDashboard);

function MonolithOpsRoute() {
  if (!isMonolithOpsEnabled) {
    return <Redirect to="/404" />;
  }

  return <AdminDashboardTransition />;
}

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/" component={HomeTransition} />
        <Route path="/tickets" component={TicketsTransition} />
        <Route path="/artists/:id" component={ArtistProfileTransition} />
        <Route path="/sponsors" component={SponsorAccessTransition} />
        <Route path="/about" component={AboutTransition} />
        <Route path="/chasing-sunsets" component={ChasingSunsetsTransition} />
        <Route path="/chasing-sunsets-facts" component={ChasingSunsetsFactsTransition} />
        <Route path="/chasing-sunsets/:season" component={ArchiveGalleryPageTransition} />
        <Route path="/radio" component={RadioTransition} />
        <Route path="/radio/:slug" component={RadioEpisodeTransition} />
        <Route path="/story" component={UntoldStoryTransition} />
        <Route path="/untold-story/:season" component={ArchiveGalleryPageTransition} />
        <Route path="/untold-story-deron-juany-bravo" component={UntoldStoryTransition} />
        <Route path="/archive" component={ArchiveTransition} />
        <Route path="/insights/:slug" component={InsightArticleTransition} />
        <Route path="/insights" component={InsightsTransition} />
        <Route path="/booking" component={BookingTransition} />
        <Route path="/submit" component={SubmitTransition} />
        <Route path="/lineup" component={LineupTransition} />
        <Route path="/schedule" component={ScheduleTransition} />
        <Route path="/events/:slug" component={EventDetailsTransition} />
        <Route path="/newsletter" component={NewsletterTransition} />
        <Route path="/togetherness">
          <Redirect to="/about#togetherness" />
        </Route>
        <Route path="/inner-circle">
          <Redirect to="/newsletter" />
        </Route>
        <Route path="/contact" component={ContactTransition} />
        <Route path="/faq" component={FAQTransition} />
        <Route path="/partners" component={PartnersTransition} />
        <Route path="/press" component={PressTransition} />
        <Route path="/vip" component={VIPTransition} />
        <Route path="/travel" component={TravelTransition} />
        <Route path="/guide" component={GuideTransition} />
        <Route path="/shop" component={ShopTransition} />
        <Route path="/ambassadors" component={AmbassadorsTransition} />
        <Route path="/alerts" component={AlertsTransition} />
        <Route path="/terms" component={TermsTransition} />
        <Route path="/privacy" component={PrivacyTransition} />
        <Route path="/cookies" component={CookiesTransition} />
        <Route path="/monolith-ops" component={MonolithOpsRoute} />
        <Route path="/404" component={NotFoundTransition} />

        <Route component={NotFoundTransition} />
      </Switch>
    </AnimatePresence>
  );
}

function SceneSync() {
  const [location] = useLocation();

  useEffect(() => {
    const scene = getSceneForPath(location);
    const root = document.documentElement;
    root.dataset.scene = scene.id;
    root.style.setProperty("--scene-accent", scene.accent);
    root.style.setProperty("--scene-glow", scene.glow);
    return () => root.removeAttribute("data-scene");
  }, [location]);

  return null;
}

function RouteMemory() {
  const [location] = useLocation();
  const { closeDrawer } = useUI();
  useEffect(() => {
    rememberVisitedPath(location);
    closeDrawer(); // Ensure drawers always close when navigating to a new real page route
  }, [location, closeDrawer]);
  return null;
}

function AttributionSync() {
  const [location] = useLocation();

  useEffect(() => {
    syncAttributionForNavigation();
  }, [location]);

  return null;
}

function GlobalSpotlightSync() {
  useEffect(() => {
    let ticking = false;
    const updateMousePosition = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };
    // Passive true ensures it doesn't block scrolling thread
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  return null;
}

function SiteDataSync() {
  const [location] = useLocation();

  useEffect(() => {
    void ensurePublicSiteData(location).catch(() => {
      // Keep the current route alive if the refresh fails; the initial boot path
      // is already loaded before the app renders.
    });
  }, [location]);

  return null;
}

const Analytics = lazy(() => import("./components/Analytics"));
const DeferredShellChrome = lazy(() => import("./components/DeferredShellChrome"));
const CookieConsent = lazy(() => import("./components/CookieConsent"));
const SoundCloudShelf = lazy(() => import("./components/SoundCloudShelf"));
const Footer = lazy(() => import("./components/Footer"));
const GlobalTicketButton = lazy(() => import("./components/GlobalTicketButton"));
const OffCanvasDrawer = lazy(() => import("./components/ui/OffCanvasDrawer"));
const Toaster = lazy(() => import("./components/ui/sonner").then((module) => ({ default: module.Toaster })));
function MainContentWrapper() {
  const { activeDrawer, isSensoryOverloadActive } = useUI();
  const isDrawerActive = Boolean(activeDrawer);

  // GPU-accelerated effects only for the shell body to preserve frame rate
  const shellTransform = isSensoryOverloadActive ? "scale(0.97)" : "none";
  const shellOpacity = isDrawerActive ? 0.35 : isSensoryOverloadActive ? 0.4 : 1;
  const shellFilter = "none";

  return (
    <>
      <GlobalSpotlightSync />
      <SiteDataSync />

      <SceneSync />
      <RouteMemory />
      <AttributionSync />
      <Suspense fallback={null}>
        {activeDrawer ? <OffCanvasDrawer /> : null}
      </Suspense>
      
      {/* Sensory Overload Cinematic Overlay vault effect */}
      <div 
        className="fixed inset-0 z-[90] pointer-events-none transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] bg-black/50 backdrop-blur-[12px] grayscale"
        style={{ opacity: isSensoryOverloadActive ? 1 : 0 }}
        aria-hidden="true"
      />

      <Suspense fallback={null}>
        <GlobalTicketButton />
      </Suspense>
      <div
        id="app-shell"
        className="w-full origin-top transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-screen relative"
        style={{
          transform: shellTransform,
          opacity: shellOpacity,
          filter: shellFilter,
        }}
      >
        {/* Global Cinematic Spotlight */}
        <div 
           className="fixed inset-0 pointer-events-none z-[1] opacity-70 mix-blend-screen transition-opacity duration-1000 hidden md:block" 
           style={{
             background: 'radial-gradient(1000px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), var(--scene-glow, rgba(255,255,255,0.03)), transparent 40%)'
           }}
        />
        <Router />
        <ViewportLazy minHeightClassName="min-h-[24rem]" rootMargin="360px 0px">
          <Suspense fallback={null}>
            <SoundCloudShelf />
          </Suspense>
        </ViewportLazy>
        <ViewportLazy minHeightClassName="min-h-[40rem]" rootMargin="420px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ViewportLazy>
      </div>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="dark">
          <UIProvider>
            <InquiryProvider>
              <div className="film-grain" />
              <MonolithPreloader />
              <MainContentWrapper />
              
              <Suspense fallback={null}>
                <InquiryPortal />
                <Toaster />
                <DeferredShellChrome />
                <Analytics />
                <CookieConsent />
              </Suspense>
            </InquiryProvider>
          </UIProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
