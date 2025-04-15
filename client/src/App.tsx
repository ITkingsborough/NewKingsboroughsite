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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
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
