import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const services = [
  {
    name: 'Custom Websites',
    href: '/services/websites',
    description: 'Beautiful, responsive websites that convert',
  },
  {
    name: 'Web Applications',
    href: '/services/web-apps',
    description: 'Full-stack apps with modern architecture',
  },
  {
    name: 'Dashboards',
    href: '/services/dashboards',
    description: 'Data visualization & admin panels',
  },
  {
    name: 'E-Commerce',
    href: '/services/ecommerce',
    description: 'Online stores that drive sales',
  },
  {
    name: 'Portfolio Making',
    href: '/services/portfolios',
    description: 'Professional portfolios for showcasing your work',
  },
  {
    name: 'Site Repair',
    href: '/services/repair',
    description: 'Fix broken sites & performance issues',
  },
  { name: 'Maintenance', href: '/services/maintenance', description: 'Ongoing support & updates' },
];

const navLinks = [
  { name: 'Services', href: '/services', hasDropdown: true },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/Logo.png" 
            alt="Dubiqo Logo" 
            className="h-14 w-auto group-hover:opacity-80 transition-opacity"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <NavigationMenuItem key={link.name}>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-muted/50 data-[state=open]:bg-muted/50">
                      {link.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[500px] gap-2 p-4 md:grid-cols-2">
                        {services.map((service) => (
                          <li key={service.name}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={service.href}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/50 focus:bg-muted/50 group"
                              >
                                <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                  {service.name}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                  {service.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={link.name}>
                    <Link
                      to={link.href}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary',
                        location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {link.name}
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/client-portal">Client Portal</Link>
          </Button>
          <Button asChild className="glow-primary">
            <Link to="/quote">Get Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'block py-2 text-lg font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3 border-t border-border">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/client-portal">Client Portal</Link>
              </Button>
              <Button className="w-full glow-primary" asChild>
                <Link to="/quote">Get Quote</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
