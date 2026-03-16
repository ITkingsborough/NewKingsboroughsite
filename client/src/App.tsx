import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Ministries from "@/pages/Ministries";
import Events from "@/pages/Events";
import Sermons from "@/pages/Sermons";
import Gallery from "@/pages/Gallery";
import Giving from "@/pages/Giving";
import Contact from "@/pages/Contact";
import Hadassah from "@/pages/Hadassah";
import Kingsmen from "@/pages/Kingsmen";
import Crown from "@/pages/Crown";
import Community from "@/pages/Community";
import Shop from "@/pages/Shop";
import WorshipMinistry from "@/pages/WorshipMinistry";
import KidsMinistry from "@/pages/KidsMinistry";
import CommunityOutreach from "@/pages/CommunityOutreach";
import PrayerMinistry from "@/pages/PrayerMinistry";
import VenueHire from "@/pages/VenueHire";
import LoginPage from "@/pages/auth/login-page";
import DirectLoginPage from "@/pages/auth/direct-login";
import DashboardPage from "@/pages/cms/dashboard-page";
import SermonsPage from "@/pages/cms/sermons-page";
import EventsPage from "@/pages/cms/events-page";
import GalleryPage from "@/pages/cms/gallery-page";
import MagazinesPage from "@/pages/cms/magazines-page";
import ContactPage from "@/pages/cms/contact-page";
import CommunityDashboard from "@/pages/cms/community-dashboard";
import ThemePage from "@/pages/cms/theme-page";
import UnauthorizedPage from "@/pages/cms/unauthorized-page";
import CookieConsent from "@/components/ui/CookieConsent";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageTransition from "@/components/ui/PageTransition";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/SocialSidebar";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { useSmoothScroll } from "./hooks/use-smooth-scroll";

function App() {
  // Initialize smooth scrolling
  useSmoothScroll();
  const [location] = useLocation();
  
  // Prevent Flash Of Unstyled Content (FOUC)
  useEffect(() => {
    document.documentElement.classList.add('is-loaded');
  }, []);

  // Check if we're in the CMS section
  const isCmsRoute = location.startsWith("/cms");
  const isAuthRoute = location.startsWith("/auth") && location !== "/direct-login";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {!isCmsRoute && !isAuthRoute ? (
          // Main website layout
          <div className="flex flex-col min-h-screen">
            <Header />
            <SocialSidebar />
            <main className="flex-grow">
              <PageTransition>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/about" component={About} />
                  <Route path="/ministries" component={Ministries} />
                  <Route path="/events" component={Events} />
                  <Route path="/sermons" component={Sermons} />
                  <Route path="/gallery" component={Gallery} />
                  <Route path="/giving" component={Giving} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/hadassah" component={Hadassah} />
                  <Route path="/kingsmen" component={Kingsmen} />
                  <Route path="/crown" component={Crown} />
                  <Route path="/community" component={Community} />
                  <Route path="/shop" component={Shop} />
                  <Route path="/worship-ministry" component={WorshipMinistry} />
                  <Route path="/kids-ministry" component={KidsMinistry} />
                  <Route path="/community-outreach" component={CommunityOutreach} />
                  <Route path="/prayer-ministry" component={PrayerMinistry} />
                  <Route path="/venue-hire" component={VenueHire} />
                  <Route path="/auth/login" component={LoginPage} />
                  <Route path="/direct-login" component={DirectLoginPage} />
                  <Route component={NotFound} />
                </Switch>
              </PageTransition>
            </main>
            <Footer />
            <CookieConsent />
            <ScrollToTop />
          </div>
        ) : (
          // CMS routes don't use the main layout
          <Switch>
            {/* Auth routes */}
            <Route path="/auth">
              <LoginPage />
            </Route>
            <Route path="/auth/login" component={LoginPage} />
            <Route path="/direct-login">
              <DirectLoginPage />
            </Route>
            
            {/* Protected CMS routes */}
            <Route path="/cms/dashboard">
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/sermons">
              <ProtectedRoute>
                <SermonsPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/events">
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/gallery">
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/contact">
              <ProtectedRoute>
                <ContactPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/magazines">
              <ProtectedRoute>
                <MagazinesPage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/community">
              <ProtectedRoute>
                <CommunityDashboard />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/theme">
              <ProtectedRoute>
                <ThemePage />
              </ProtectedRoute>
            </Route>
            
            <Route path="/cms/unauthorized" component={UnauthorizedPage} />
            
            {/* Fallback */}
            <Route>
              <NotFound />
            </Route>
          </Switch>
        )}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
