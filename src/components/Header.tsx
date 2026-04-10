import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Active Members", path: "/active-members" },
  { label: "Premium Plans", path: "/premium-plans" },
  { label: "Happy Stories", path: "/happy-stories" },
  { label: "About", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        {/* Top bar info */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-7 w-7 text-primary fill-primary" />
          <span className="text-xl font-heading font-bold text-foreground">
            ebihe<span className="text-primary">.com</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.path
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>+1 (530) 574-9007</span>
          </div>
          <Link to="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gradient-primary text-primary-foreground">
              Registration
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-card pb-4">
          <nav className="container flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-md ${
                  location.pathname === link.path
                    ? "text-primary bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 px-3">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">Log In</Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full gradient-primary text-primary-foreground" size="sm">Register</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
