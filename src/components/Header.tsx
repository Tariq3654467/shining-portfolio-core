import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Heart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
 
const navLinks = [
  { label: "Home", path: "/" },
  { label: "Active Members", path: "/active-members" },
  { label: "Search", path: "/search" },
  { label: "Premium Plans", path: "/premium-plans" },
  { label: "Happy Stories", path: "/happy-stories" },
  { label: "About", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];
 
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // FIX: Don't destructure loading — use it to avoid showing auth buttons during init
  const { user, profile, loading, signOut } = useAuth();
 
  const handleLogout = async () => {
    // signOut now clears state immediately, so navigation is instant
    await signOut();
    navigate("/login");
  };
 
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
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
 
        {/* CTA / User Menu */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-2">
            <Phone className="h-4 w-4" />
            <span>+1 (530) 574-9007</span>
          </div>
 
          {/* FIX: Don't render auth buttons until loading is done to prevent flicker */}
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
                    <User className="h-4 w-4 text-primary" /> {profile?.first_name || "Profile"}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gradient-primary text-primary-foreground">
                    Registration
                  </Button>
                </Link>
              </>
            )
          )}
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
 
            <div className="flex flex-col gap-2 mt-3 px-3">
              {!loading && (
                user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" /> Profile: {profile?.first_name}
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-500" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" /> Log Out
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">Log In</Button>
                    </Link>
                    <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full gradient-primary text-primary-foreground" size="sm">Register</Button>
                    </Link>
                  </div>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
 
export default Header;
 