import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Switch, useLocation, Redirect } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./pages/Home";
import { UIProvider, useUI } from "./contexts/UIContext";
import { InquiryProvider } from "./contexts/InquiryContext";
import ViewportLazy from "./components/ViewportLazy";
import { getSceneForPath } from "./lib/scenes";
import { syncAttributionForNavigation } from "./lib/attribution";
import { SUNSETS_PRELAUNCH_LOCKED } from "./lib/sunsetsTicketing";
import { rememberVisitedPath } from "./lib/visitorContext";
import { ensurePublicSiteData } from "./lib/siteData";
import MetaPixelGate from "./components/MetaPixelGate";
import { ROUTES, ANCHORS, CAMPAIGN_HOSTS } from "@shared/routes";

// Lazy Pages
const InquiryPortal = lazy(() => import("./components/InquiryPortal"));
const Tickets = lazy(() => import("./pages/Tickets"));
const About = lazy(() => import("./pages/About"));
const ArtistProfile = lazy(() => import("./pages/ArtistProfile"));
const SponsorAccess = lazy(() => import("./pages/SponsorAccess"));
const ChasingSunsets = lazy(() => import("./pages/ChasingSunsets"));
const ChasingSunsetsFacts = lazy(() => import("./pages/ChasingSunsetsFacts"));
const SunsetsLinkBio = lazy(() => import("./pages/SunsetsLinkBio"));
const LakeLanding = lazy(() => import("./pages/LakeLanding"));
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
const Monolith = lazy(() => import("./pages/Monolith"));
const Shop = lazy(() => import("./pages/Shop"));
const Ambassadors = lazy(() => import("./pages/Ambassadors"));
const Travel = lazy(() => import("./pages/Travel"));
const Guide = lazy(() => import("./pages/Guide"));
const VIP = lazy(() => import("./pages/VIP"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Insights = lazy(() => import("./pages/Insights"));
const InsightArticle = lazy(() => import("./pages/InsightArticle"));
const ArchiveGalleryPage = lazy(() => import("./pages/ArchiveGalleryPage"));

const isMonolithOpsEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_MONOLITH_OPS === "true";
const AdminDashboard = isMonolithOpsEnabled
  ? lazy(() => import("./pages/AdminDashboard"))
  : null;
const ExperimentalHero = isMonolithOpsEnabled
  ? lazy(() => import("./pages/ExperimentalHero"))
  : null;

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
  Component: React.ComponentType<P>
) {
  return (props: P) => (
    <div className="relative w-full bg-background min-h-screen overflow-x-clip">
      <Suspense fallback={<RouteLoadingFallback />}>
        <Component {...props} />
      </Suspense>
    </div>
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
const SunsetsLinkBioTransition = withTransition(SunsetsLinkBio);
const LakeLandingTransition = withTransition(LakeLanding);
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
const MonolithTransition = withTransition(Monolith);
const ShopTransition = withTransition(Shop);
const AmbassadorsTransition = withTransition(Ambassadors);
const TravelTransition = withTransition(Travel);
const GuideTransition = withTransition(Guide);
const VIPTransition = withTransition(VIP);
const AlertsTransition = withTransition(Alerts);
const ArchiveGalleryPageTransition = withTransition(ArchiveGalleryPage);
const AdminDashboardTransition = AdminDashboard
  ? withTransition(AdminDashboard)
  : null;
const ExperimentalHeroTransition = ExperimentalHero
  ? withTransition(ExperimentalHero)
  : null;

function MonolithOpsRoute() {
  if (!isMonolithOpsEnabled || !AdminDashboardTransition) {
    return <Redirect to={ROUTES.notFound} />;
  }

  return <AdminDashboardTransition />;
}

function SandboxHeroRoute() {
  if (!isMonolithOpsEnabled || !ExperimentalHeroTransition) {
    return <Redirect to={ROUTES.notFound} />;
  }

  return <ExperimentalHeroTransition />;
}

function normalizeRouteLocation(location: string) {
  return (location.split("?")[0].replace(/\/$/, "") || "/").toLowerCase();
}

function getCampaignHostLandingPath(location: string) {
  const normalizedLocation = normalizeRouteLocation(location);
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const isSunsetsHost = host === CAMPAIGN_HOSTS.sunsetsVip || host === CAMPAIGN_HOSTS.sunsetsVipWww;
  const isUntoldHost = host === CAMPAIGN_HOSTS.untoldVip || host === CAMPAIGN_HOSTS.untoldVipWww;

  if (normalizedLocation === ROUTES.home && isSunsetsHost) return ROUTES.sunsets;
  if (normalizedLocation === ROUTES.home && isUntoldHost) return ROUTES.story;

  return normalizedLocation;
}

function Router() {
  const [location] = useLocation();

  return (
    <Switch location={location} key={location}>
      <Route path={ROUTES.home} component={HomeTransition} />
      <Route path={ROUTES.tickets}>
        {SUNSETS_PRELAUNCH_LOCKED ? <Redirect to={ROUTES.sunsets} /> : <TicketsTransition />}
      </Route>
      <Route path="/artists/:id" component={ArtistProfileTransition} />
      <Route path={ROUTES.sponsors} component={SponsorAccessTransition} />
      <Route path={ROUTES.about} component={AboutTransition} />
      <Route path={ROUTES.chasingSunsets} component={ChasingSunsetsTransition} />
      <Route
        path={ROUTES.chasingSunsetsFacts}
        component={ChasingSunsetsFactsTransition}
      />
      <Route path="/SUNSETS">
        <Redirect to={ROUTES.sunsets} />
      </Route>
      <Route path="/SUNSET">
        <Redirect to={ROUTES.sunsets} />
      </Route>
      <Route path="/Sunsets">
        <Redirect to={ROUTES.sunsets} />
      </Route>
      <Route path="/Sunset">
        <Redirect to={ROUTES.sunsets} />
      </Route>
      <Route path="/sunset/">
        <Redirect to={ROUTES.sunsets} />
      </Route>
      <Route path="/sunset">
        <Redirect to={ROUTES.sunsets} />
      </Route>
      <Route path="/sunsets/" component={SunsetsLinkBioTransition} />
      <Route path={ROUTES.sunsets} component={SunsetsLinkBioTransition} />
      <Route path="/lake/" component={LakeLandingTransition} />
      <Route path={ROUTES.lake} component={LakeLandingTransition} />
      <Route
        path="/chasing-sunsets/:season"
        component={ArchiveGalleryPageTransition}
      />
      <Route path={ROUTES.radio} component={RadioTransition} />
      <Route path="/radio/:slug" component={RadioEpisodeTransition} />
      <Route path={ROUTES.story} component={UntoldStoryTransition} />
      <Route path={ROUTES.untoldStory} component={UntoldStoryTransition} />
      <Route
        path="/untold-story/:season"
        component={ArchiveGalleryPageTransition}
      />
      <Route
        path={ROUTES.untoldStoryDeronJuanyBravo}
        component={UntoldStoryTransition}
      />
      <Route path={ROUTES.archive} component={ArchiveTransition} />
      <Route path="/insights/:slug" component={InsightArticleTransition} />
      <Route path={ROUTES.insights} component={InsightsTransition} />
      <Route path={ROUTES.booking} component={BookingTransition} />
      <Route path={ROUTES.submit} component={SubmitTransition} />
      <Route path={ROUTES.lineup} component={LineupTransition} />
      <Route path={ROUTES.schedule} component={ScheduleTransition} />
      <Route path={ROUTES.events} component={ScheduleTransition} />
      <Route path="/events/:slug" component={EventDetailsTransition} />
      <Route path={ROUTES.newsletter} component={NewsletterTransition} />
      <Route path={ROUTES.togetherness}>
        <Redirect to={ROUTES.about + ANCHORS.togetherness} />
      </Route>
      <Route path={ROUTES.innerCircle}>
        <Redirect to={ROUTES.newsletter} />
      </Route>
      <Route path={ROUTES.contact} component={ContactTransition} />
      <Route path={ROUTES.faq} component={FAQTransition} />
      <Route path={ROUTES.partners} component={PartnersTransition} />
      <Route path={ROUTES.press} component={PressTransition} />
      <Route path={ROUTES.vip} component={VIPTransition} />
      <Route path={ROUTES.travel} component={TravelTransition} />
      <Route path={ROUTES.guide} component={GuideTransition} />
      <Route path={ROUTES.shop} component={ShopTransition} />
      <Route path={ROUTES.ambassadors} component={AmbassadorsTransition} />
      <Route path={ROUTES.alerts} component={AlertsTransition} />
      <Route path={ROUTES.terms} component={TermsTransition} />
      <Route path={ROUTES.privacy} component={PrivacyTransition} />
      <Route path={ROUTES.cookies} component={CookiesTransition} />
      <Route path={ROUTES.monolith} component={MonolithTransition} />
      <Route path={ROUTES.theMonolith}>
        <Redirect to={ROUTES.monolith} />
      </Route>
      <Route path={ROUTES.collective}>
        <Redirect to={ROUTES.monolith} />
      </Route>
      <Route path={ROUTES.monolithOps} component={MonolithOpsRoute} />
      <Route path={ROUTES.notFound} component={NotFoundTransition} />
      <Route path={ROUTES.sandboxHero} component={SandboxHeroRoute} />

      <Route component={NotFoundTransition} />
    </Switch>
  );
}

function SceneSync() {
  const [location] = useLocation();

  useEffect(() => {
    const scene = getSceneForPath(getCampaignHostLandingPath(location));
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
    const updateMousePosition = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", updateMousePosition, {
      passive: true,
    });
    return () => window.removeEventListener("mousemove", updateMousePosition);
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
const DeferredShellChrome = lazy(
  () => import("./components/DeferredShellChrome")
);
const CookieConsent = lazy(() => import("./components/CookieConsent"));
const SoundCloudShelf = lazy(() => import("./components/SoundCloudShelf"));
const Footer = lazy(() => import("./components/Footer"));
const GlobalTicketButton = lazy(
  () => import("./components/GlobalTicketButton")
);
const OffCanvasDrawer = lazy(() => import("./components/ui/OffCanvasDrawer"));
const Toaster = lazy(() =>
  import("./components/ui/sonner").then(module => ({ default: module.Toaster }))
);

function DeferredGlobalModules() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShouldLoad(true), 3000);
    return () => window.clearTimeout(id);
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <InquiryPortal />
      <Toaster />
      <DeferredShellChrome />
      <Analytics />
      <CookieConsent />
    </Suspense>
  );
}

function MainContentWrapper() {
  const { activeDrawer, isSensoryOverloadActive } = useUI();
  const [location] = useLocation();
  const isDrawerActive = Boolean(activeDrawer);
  const normalizedLocation = normalizeRouteLocation(location);
  const landingPath = getCampaignHostLandingPath(location);
  const isUntoldRootLanding =
    normalizedLocation === ROUTES.home && landingPath === ROUTES.story;
  const isStandaloneLanding =
    landingPath === ROUTES.sunsets ||
    landingPath === ROUTES.lake ||
    isUntoldRootLanding;

  // GPU-accelerated effects only for the shell body to preserve frame rate
  const shellTransform = isSensoryOverloadActive ? "scale(0.97)" : "none";
  const shellOpacity = isDrawerActive
    ? 0.35
    : isSensoryOverloadActive
      ? 0.4
      : 1;
  const shellFilter = "none";

  return (
    <>
      <GlobalSpotlightSync />
      <SiteDataSync />
      <MetaPixelGate />

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

      {!isStandaloneLanding && (
        <Suspense fallback={null}>
          <GlobalTicketButton />
        </Suspense>
      )}
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
            background:
              "radial-gradient(1000px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), var(--scene-glow, rgba(255,255,255,0.03)), transparent 40%)",
          }}
        />
        {isStandaloneLanding ? (
          landingPath === ROUTES.lake ? (
            <LakeLandingTransition />
          ) : landingPath === ROUTES.story ? (
            <UntoldStoryTransition />
          ) : (
            <SunsetsLinkBioTransition />
          )
        ) : (
          <Router />
        )}
        {!isStandaloneLanding && (
          <>
            <ViewportLazy
              minHeightClassName="min-h-[24rem]"
              rootMargin="360px 0px"
            >
              <Suspense fallback={null}>
                <SoundCloudShelf />
              </Suspense>
            </ViewportLazy>
            <ViewportLazy
              minHeightClassName="min-h-[40rem]"
              rootMargin="420px 0px"
            >
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
            </ViewportLazy>
          </>
        )}
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
              <MainContentWrapper />

              <DeferredGlobalModules />
            </InquiryProvider>
          </UIProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
