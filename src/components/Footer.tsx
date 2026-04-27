import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground text-background/80">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="ebihe.com logo" className="h-9 w-9 object-contain" />
            <span className="text-lg font-heading font-bold text-background">
              ebihe<span className="text-primary">.com</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-background/60">
            A trusted matrimonial platform dedicated to helping individuals find meaningful, compatible life partners.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-background mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/active-members" className="hover:text-primary transition-colors">Active Members</Link>
            <Link to="/premium-plans" className="hover:text-primary transition-colors">Premium Plans</Link>
            <Link to="/happy-stories" className="hover:text-primary transition-colors">Happy Stories</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-background mb-4">Company</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link to="/" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-background mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>+1 (530) 574-9007</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>info@ebihe.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <span>USA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 mt-8 pt-6 text-center text-sm text-background/40">
        © {new Date().getFullYear()} ebihe.com. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
