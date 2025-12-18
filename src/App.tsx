import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Quote from './pages/Quote';
import Booking from './pages/Booking';
import Downloads from './pages/Downloads';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import Auth from './pages/Auth';
import ClientPortal from './pages/ClientPortal';
import StaffDashboard from './pages/StaffDashboard';
import AnalyticsDemo from './pages/AnalyticsDemo';
import PaymentDemo from './pages/PaymentDemo';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import Refund from './pages/legal/Refund';
import SLA from './pages/legal/SLA';

// Service Pages
import Websites from './pages/services/Websites';
import Portfolios from './pages/services/Portfolios';
import BillingSystems from './pages/services/BillingSystems';
import Dashboards from './pages/services/Dashboards';
import Troubleshooting from './pages/services/Troubleshooting';
import Maintenance from './pages/services/Maintenance';

// Admin Pages (Hidden - No public links)
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProjects from './pages/admin/Projects';
import AdminTickets from './pages/admin/Tickets';
import AdminQuotes from './pages/admin/Quotes';
import AdminInvoices from './pages/admin/Invoices';
import AdminBookings from './pages/admin/Bookings';
import AdminDownloads from './pages/admin/Downloads';
import AdminPortfolio from './pages/admin/PortfolioAdmin';
import AdminCaseStudies from './pages/admin/CaseStudiesAdmin';
import AdminBlogs from './pages/admin/BlogsAdmin';
import AdminPricing from './pages/admin/PricingAdmin';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Marketing Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/services/websites" element={<Websites />} />
          <Route path="/services/portfolios" element={<Portfolios />} />
          <Route path="/services/billing-systems" element={<BillingSystems />} />
          <Route path="/services/dashboards" element={<Dashboards />} />
          <Route path="/services/troubleshooting" element={<Troubleshooting />} />
          <Route path="/services/maintenance" element={<Maintenance />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/downloads" element={<Downloads />} />

          {/* Interactive Flows */}
          <Route path="/quote" element={<Quote />} />
          <Route path="/booking" element={<Booking />} />

          {/* Auth & Portals */}
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/client-portal"
            element={
              <ProtectedRoute>
                <ClientPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute requiredRole={['staff', 'admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Hidden Admin Portal - No public links, robots.txt blocked */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quotes"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminQuotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminInvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/portfolio"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminPortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pricing"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminPricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/case-studies"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminCaseStudies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/downloads"
            element={
              <ProtectedRoute requiredRole={['admin', 'staff']}>
                <AdminDownloads />
              </ProtectedRoute>
            }
          />

          {/* Demo Pages */}
          <Route path="/analytics-demo" element={<AnalyticsDemo />} />
          <Route path="/payment-demo" element={<PaymentDemo />} />

          {/* Legal */}
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/refund" element={<Refund />} />
          <Route path="/legal/sla" element={<SLA />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
