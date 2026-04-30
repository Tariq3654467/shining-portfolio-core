import { motion } from "framer-motion";
import { Heart, Shield, Users, Target, Globe, Lock, Sparkles, Handshake } from "lucide-react";

const values = [
  { icon: Heart, title: "Purpose-Driven", desc: "Focused on meaningful relationships leading to marriage" },
  { icon: Shield, title: "Safe & Trusted", desc: "Genuine and verified profiles for your peace of mind" },
  { icon: Users, title: "User-Centred", desc: "Designed to make partner search simple and comfortable" },
  { icon: Target, title: "Compatibility Matching", desc: "Based on values, interests, and life goals" },
  { icon: Globe, title: "Cultural Respect", desc: "Embracing traditions while using modern matchmaking" },
  { icon: Lock, title: "Privacy First", desc: "Your data security is our top priority" },
  { icon: Sparkles, title: "Empowering Choice", desc: "Helping individuals make informed decisions" },
  { icon: Handshake, title: "Inclusive Platform", desc: "Open to diverse backgrounds and preferences" },
];

const About = () => (
  <div className="py-16">
    <div className="container max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold">About eBihe.com</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
          eBihe.com is a trusted matrimonial platform dedicated to helping Nepali individuals find meaningful, compatible life partners for marriage. We combine tradition with technology to create genuine, secure, and lasting connections.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border rounded-xl p-6 flex gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <v.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold">{v.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 bg-accent/50 rounded-2xl p-8 text-center"
      >
        <h2 className="text-2xl font-heading font-bold mb-3">Committed to Building Lifelong Connections</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We're not just about matches — we're about building meaningful relationships that stand the test of time. Your happiness is our mission.
        </p>
      </motion.div>
    </div>
  </div>
);

export default About;
