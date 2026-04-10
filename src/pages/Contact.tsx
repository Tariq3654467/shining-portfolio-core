import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => (
  <div className="py-16">
    <div className="container max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-center">Contact Us</h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">We'd love to hear from you</p>

      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-heading font-semibold mb-6">Get in Touch</h2>
          <div className="space-y-5">
            {[
              { icon: Phone, label: "Phone", value: "+1 (530) 574-9007" },
              { icon: Mail, label: "Email", value: "info@ebihe.com" },
              { icon: MapPin, label: "Address", value: "United States" },
              { icon: Clock, label: "Hours", value: "Mon - Fri, 9AM - 6PM EST" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border rounded-2xl p-8 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
          </div>
          <Input type="email" placeholder="Email" />
          <Input placeholder="Subject" />
          <Textarea placeholder="Your message..." rows={5} />
          <Button className="w-full gradient-primary text-primary-foreground">Send Message</Button>
        </motion.form>
      </div>
    </div>
  </div>
);

export default Contact;
