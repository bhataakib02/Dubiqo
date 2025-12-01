import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";

// Main Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import CaseStudies from "./pages/CaseStudies";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Booking from "./pages/Booking";
import ClientPortal from "./pages/ClientPortal";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import Downloads from "./pages/Downloads";
import AnalyticsDemo from "./pages/AnalyticsDemo";
import PaymentDemo from "./pages/PaymentDemo";

// Service Pages
import Websites from "./pages/services/Websites";
import Portfolios from "./pages/services/Portfolios";
import BillingSystems from "./pages/services/BillingSystems";
import Dashboards from "./pages/services/Dashboards";
import Troubleshooting from "./pages/services/Troubleshooting";
import Maintenance from "./pages/services/Maintenance";

// Legal Pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Refund from "./pages/legal/Refund";
import SLA from "./pages/legal/SLA";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/support" element={<Support />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/client-portal" element={<ClientPortal />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:slug" element={<CareerDetail />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/analytics-demo" element={<AnalyticsDemo />} />
            <Route path="/payment-demo" element={<PaymentDemo />} />

            {/* Service Pages */}
            <Route path="/services/websites" element={<Websites />} />
            <Route path="/services/portfolios" element={<Portfolios />} />
            <Route path="/services/billing-systems" element={<BillingSystems />} />
            <Route path="/services/dashboards" element={<Dashboards />} />
            <Route path="/services/troubleshooting" element={<Troubleshooting />} />
            <Route path="/services/maintenance" element={<Maintenance />} />

            {/* Legal Pages */}
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/refund" element={<Refund />} />
            <Route path="/legal/sla" element={<SLA />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
