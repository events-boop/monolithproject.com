import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import PageTransition from "./components/PageTransition";
import { useUI, UIProvider } from "./contexts/UIContext";
import ViewportLazy from "./components/ViewportLazy";
import { getSceneForPath } from "./lib/scenes";
import { syncAttributionForNavigation } from "./lib/attribution";
import { rememberVisitedPath } from "./lib/visitorContext";
import { ensurePublicSiteData } from "./lib/siteData";

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

function RouteLoadingFallback() {
  return (
    <div
      className="min-h-[100svh] bg-background text-foreground flex items-center justify-center px-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm border border-white/8 bg-black/30 px-5 py-6 backdrop-blur-sm">
        <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/45">
          Loading Next Scene
        </div>
        <div className="mt-4 h-px overflow-hidden bg-white/8">
          <div className="h-full w-1/3 animate-[route-loader_1.2s_var(--motion-luxe)_infinite] bg-[var(--scene-accent)]" />
        </div>
      </div>
    </div>
  );
}

const withTransition = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <PageTransition>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Component {...props} />
      </Suspense>
    </PageTransition>
  );
};

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
        <Route path="/togetherness" component={AboutTransition} />
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
        <Route path="/inner-circle" component={NewsletterTransition} />
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
  useEffect(() => {
    rememberVisitedPath(location);
  }, [location]);
  return null;
}

function AttributionSync() {
  const [location] = useLocation();

  useEffect(() => {
    syncAttributionForNavigation();
  }, [location]);

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
const Footer = lazy(() => import("./components/Footer"));
const GlobalTicketButton = lazy(() => import("./components/GlobalTicketButton"));
const AmbientAudioEngine = lazy(() => import("./components/AmbientAudioEngine"));
const OffCanvasDrawer = lazy(() => import("./components/ui/OffCanvasDrawer"));
const Toaster = lazy(() => import("@/components/ui/sonner").then((module) => ({ default: module.Toaster })));
function MainContentWrapper() {
  const { activeDrawer, isSensoryOverloadActive } = useUI();
  const isDrawerActive = Boolean(activeDrawer);

  // GPU-accelerated effects only. Filters (like blur) on the main app shell destroy Lighthouse scores.
  const shellTransform = "none";
  const shellOpacity = isDrawerActive ? 0.35 : isSensoryOverloadActive ? 0.15 : 1;
  const shellFilter = "none";

  return (
    <>
      <SiteDataSync />
      <SceneSync />
      <RouteMemory />
      <AttributionSync />
      <Suspense fallback={null}>
        {activeDrawer ? <OffCanvasDrawer /> : null}
      </Suspense>
      <Suspense fallback={null}>
        <GlobalTicketButton />
        <AmbientAudioEngine />
      </Suspense>
      <div
        id="app-shell"
        className="w-full origin-top transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] h-full"
        style={{
          transform: shellTransform,
          opacity: shellOpacity,
          filter: shellFilter,
        }}
      >
        <Router />
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
            <div className="film-grain" />
            <MainContentWrapper />
            
            <Suspense fallback={null}>
              <Toaster />
              <DeferredShellChrome />
              <Analytics />
              <CookieConsent />
            </Suspense>
          </UIProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
