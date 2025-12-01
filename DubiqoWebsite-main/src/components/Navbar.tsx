import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isServiceActive = () => location.pathname.startsWith("/services");

  const serviceLinks = [
    { label: "Websites", path: "/services/websites" },
    { label: "Portfolios", path: "/services/portfolios" },
    { label: "Billing Systems", path: "/services/billing-systems" },
    { label: "Dashboards", path: "/services/dashboards" },
    { label: "Troubleshooting", path: "/services/troubleshooting" },
    { label: "Maintenance", path: "/services/maintenance" },
  ];

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Case Studies", path: "/case-studies" },
    { label: "Pricing", path: "/pricing" },
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
    { label: "Support", path: "/support" },
    { label: "Careers", path: "/careers" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/40 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gradient">Dubiqo</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                isServiceActive() ? "text-primary" : "text-foreground/80"
              }`}>
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass border-border/40 w-56">
                <DropdownMenuItem asChild>
                  <Link to="/services" className="w-full font-medium">All Services</Link>
                </DropdownMenuItem>
                <div className="my-1 border-t border-border/40" />
                {serviceLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link 
                      to={link.path} 
                      className={`w-full ${isActive(link.path) ? "text-primary" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/client-portal">Client Portal</Link>
            </Button>

            <Button asChild className="gradient-primary">
              <Link to="/quote">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-border/40 animate-fade-in">
            <Link
              to="/"
              className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive("/") ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Services</p>
            </div>
            <Link
              to="/services"
              className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive("/services") ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted/50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              All Services
            </Link>
            {serviceLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-6 py-2 text-sm rounded-lg transition-colors ${
                  isActive(link.path) ? "bg-primary/10 text-primary" : "text-foreground/60 hover:bg-muted/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="my-2 border-t border-border/40" />
            
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path) ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="px-4 pt-4 space-y-3 border-t border-border/40 mt-4">
              <Button asChild variant="outline" className="w-full border-primary/50">
                <Link to="/client-portal" onClick={() => setIsMenuOpen(false)}>
                  Client Portal
                </Link>
              </Button>
              <Button asChild className="w-full gradient-primary">
                <Link to="/quote" onClick={() => setIsMenuOpen(false)}>
                  Get a Quote
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
