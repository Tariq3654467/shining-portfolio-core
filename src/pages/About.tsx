import { motion } from "framer-motion";
import { Heart, Shield, Users, Target, Globe, Lock, Sparkles, Handshake } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const fastestGrowingCountries = ["Australia", "United States", "Canada", "Japan", "South Korea", "Portugal"];
const usStates = ["Texas", "New York", "California", "Ohio", "Virginia", "Maryland", "Massachusetts", "Colorado"];
const indianStates = ["West Bengal (especially Darjeeling)", "Sikkim", "Assam", "Uttarakhand", "Maharashtra", "Delhi"];
const usCommunities = [
  "Irving/Dallas (Texas)",
  "New York City & Queens",
  "Columbus (Ohio)",
  "Northern Virginia",
  "Harrisburg area (Pennsylvania)",
  "San Francisco Bay Area & Sacramento area in California",
];
const cityRanking = [
  ["New York City", "~60,000 metro-wide"],
  ["Columbus", "~20,000"],
  ["Dallas", "~15,000 metro-wide"],
  ["Washington metro area", "~10,000+"],
  ["San Francisco Bay Area", "~7,000+"],
  ["Boston metro area", "~10,000–15,000"],
  ["Houston", "Growing community"],
  ["Sacramento", "Large Bhutanese-Nepali + Nepali community"],
];
const globalCityRanking = [
  ["New Delhi", "India", "Huge long-term Nepali population"],
  ["Mumbai", "India", "Large working-class community"],
  ["Bengaluru", "India", "Security/service sector workers"],
  ["Doha", "Qatar", "Massive labor migrant population"],
  ["Dubai", "United Arab Emirates", "Workers + business owners"],
  ["Kuala Lumpur", "Malaysia", "One of the largest overseas Nepali worker hubs"],
  ["New York City", "United States", "Largest Nepali hub in America"],
  ["London", "United Kingdom", "Gurkha, student, and professional population"],
  ["Sydney", "Australia", "Fast-growing student population"],
  ["Tokyo", "Japan", "Growing student and professional community"],
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

      <Tabs defaultValue="about" className="mb-12">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="about">About eBihe.com</TabsTrigger>
          <TabsTrigger value="communities">Nepali Communities</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
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
        </TabsContent>
        <TabsContent value="communities" className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <CommunityList title="Fastest-growing communities" items={fastestGrowingCountries} />
            <RankedList title="US states with the most Nepalis" items={usStates} />
            <RankedList title="Indian states with the most Nepalis" items={indianStates} />
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <CommunityList title="Major US Nepali communities" items={usCommunities} />
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">Top US city and metro areas</h2>
              <div className="space-y-3">
                {cityRanking.map(([city, estimate], index) => (
                  <div key={city} className="flex items-start gap-3 text-sm">
                    <span className="text-primary font-semibold w-5">{index + 1}</span>
                    <span className="font-medium flex-1">{city}</span>
                    <span className="text-muted-foreground text-right">{estimate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 overflow-x-auto">
            <h2 className="font-heading font-semibold text-lg mb-4">Largest Nepali communities worldwide</h2>
            <table className="w-full text-sm text-left">
              <thead className="text-muted-foreground border-b">
                <tr><th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">City</th><th className="py-2 pr-4">Country</th><th className="py-2">Notes</th></tr>
              </thead>
              <tbody>
                {globalCityRanking.map(([city, country, notes], index) => (
                  <tr key={city} className="border-b last:border-0">
                    <td className="py-3 pr-4 text-primary font-semibold">{index + 1}</td>
                    <td className="py-3 pr-4 font-medium">{city}</td>
                    <td className="py-3 pr-4">{country}</td>
                    <td className="py-3 text-muted-foreground">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

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

const CommunityList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-card border rounded-xl p-6">
    <h2 className="font-heading font-semibold text-lg mb-4">{title}</h2>
    <ul className="space-y-3 text-sm text-muted-foreground">
      {items.map((item) => <li key={item} className="flex gap-2"><span className="text-primary">•</span><span>{item}</span></li>)}
    </ul>
  </div>
);

const RankedList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="bg-card border rounded-xl p-6">
    <h2 className="font-heading font-semibold text-lg mb-4">{title}</h2>
    <ol className="space-y-3 text-sm">
      {items.map((item, index) => <li key={item} className="flex gap-3"><span className="text-primary font-semibold w-4">{index + 1}.</span><span>{item}</span></li>)}
    </ol>
  </div>
);

export default About;
