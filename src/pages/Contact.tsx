import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => setForm((previous) => ({ ...previous, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("feedback").insert({ ...form, user_id: user?.id ?? null });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send feedback");
      return;
    }
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("Thank you for your feedback");
  };

  return <div className="py-16">
    <div className="container max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-center">Contact Us</h1>
      <p className="text-muted-foreground text-center mt-2 mb-12">We'd love to hear from you</p>

      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-xl font-heading font-semibold mb-6">Get in Touch</h2>
          <div className="space-y-5">
            {[
              { icon: Phone, label: "Phone", value: "+1 956-433-2443" },
              { icon: Mail, label: "Email", value: "ebiheteam@gmail.com" },
              { icon: Mail, label: "Email", value: "ebiheofficial@gmail.com" },
              { icon: MapPin, label: "Location", value: "California, USA" },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="font-medium break-words whitespace-normal max-w-[16rem]">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border rounded-2xl p-8 space-y-4"
          onSubmit={submit}
        >
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <Input placeholder="Subject" required value={form.subject} onChange={(e) => update("subject", e.target.value)} />
          <Textarea placeholder="Your message..." required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} />
          <Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground">{submitting ? "Sending..." : "Send Feedback"}</Button>
        </motion.form>
      </div>
    </div>
  </div>;
};

export default Contact;
