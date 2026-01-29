import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Tickets from "./pages/Tickets";
import About from "./pages/About";
import ArtistProfile from "./pages/ArtistProfile";

import SponsorAccess from "./pages/SponsorAccess";
import ChasingSunsets from "./pages/ChasingSunsets";
import Radio from "./pages/Radio";
import UntoldStory from "./pages/UntoldStory";
import Booking from "./pages/Booking";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/tickets"} component={Tickets} />
      <Route path={"/artists/:id"} component={ArtistProfile} />
      <Route path={"/sponsors"} component={SponsorAccess} />
      <Route path={"/about"} component={About} />
      <Route path={"/chasing-sunsets"} component={ChasingSunsets} />
      <Route path={"/radio"} component={Radio} />
      <Route path={"/story"} component={UntoldStory} />
      <Route path={"/booking"} component={Booking} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

import AudioPlayer from "@/components/AudioPlayer";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />

          <Router />

        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
