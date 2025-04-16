import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Ministries from "@/pages/Ministries";
import Events from "@/pages/Events";
import Sermons from "@/pages/Sermons";
import Giving from "@/pages/Giving";
import Contact from "@/pages/Contact";
import CookieConsent from "@/components/ui/CookieConsent";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PageTransition from "@/components/ui/PageTransition";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { useSmoothScroll } from "./hooks/use-smooth-scroll";

function App() {
  // Initialize smooth scrolling
  useSmoothScroll();
  
  // Prevent Flash Of Unstyled Content (FOUC)
  useEffect(() => {
    document.documentElement.classList.add('is-loaded');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <PageTransition>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/ministries" component={Ministries} />
              <Route path="/events" component={Events} />
              <Route path="/sermons" component={Sermons} />
              <Route path="/giving" component={Giving} />
              <Route path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </PageTransition>
        </main>
        <Footer />
        <CookieConsent />
        <ScrollToTop />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
