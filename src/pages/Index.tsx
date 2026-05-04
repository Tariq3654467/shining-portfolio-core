import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Search, MessageCircle, Shield, Heart, CircleCheck as CheckCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stockImages } from "@/constants/stockImages";

const { weddingImage1, weddingImage2, weddingImage3, weddingImage4, nepaliWedding, heroSlide2, heroSlide3, heroSlide4, couple1, couple2, couple3 } = stockImages;

/** Hero background slideshow — using local wedding images */
const HERO_SLIDES = [
  { img: weddingImage1, alt: "Wedding celebration 1" },
  { img: weddingImage2, alt: "Wedding celebration 2" },
  { img: weddingImage3, alt: "Wedding celebration 3" },
  { img: weddingImage4, alt: "Wedding celebration 4" },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const navigate = useNavigate();
  const [storyIdx, setStoryIdx] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);

  const heroSlides = HERO_SLIDES;

  const stories = [
    { img: weddingImage1, names: "Suman & Mina", text: "We wanted something rooted in culture and trust. eBihe.com felt like home — and now we are planning our future together." },
    { img: weddingImage2, names: "Arun & Priya", text: "We found each other on eBihe.com and knew it was meant to be. Thank you for making our dream come true!" },
    { img: weddingImage3, names: "Raj & Sita", text: "eBihe.com helped us connect across continents. Now we are happily married and grateful every day." },
    { img: weddingImage4, names: "Kiran & Anita", text: "The platform made finding my life partner so simple. We are now building a beautiful life together." },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, idx) => (
            <motion.img
              key={idx}
              src={slide.img}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx === heroIdx ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
          ))}
        </div>
        <div className="absolute inset-0 gradient-hero-overlay" />

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === heroIdx ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide Controls */}
        <button
          onClick={() => setHeroIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setHeroIdx((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-10 py-20">
          <motion.div initial="hidden" animate="visible" className="flex flex-col justify-center">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Find Life Partner <span className="text-gradient-primary bg-clip-text" style={{ WebkitTextFillColor: "unset", color: "hsl(346, 90%, 70%)" }}>Effortlessly</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-primary-foreground/80 max-w-md">
              अब आफ्नो जीवनसाथी सजिलै खोज्नुहोस् – eBihe.com, तपाईंको आफ्नै नेपाली प्लेटफर्म।
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-6">
              <Link to="/register">
                <Button size="lg" className="gradient-primary text-primary-foreground text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Registration Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-2xl shadow-2xl p-8 max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            <h2 className="text-2xl font-heading font-bold text-center text-gradient-primary mb-1">Create Your Account</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Fill out the form to get started.</p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate("/expectations"); }}>
              <Select>
                <SelectTrigger><SelectValue placeholder="On Behalf" /></SelectTrigger>
                <SelectContent>
                  {["Self", "Son", "Daughter", "Brother", "Sister", "Friend"].map((v) => (
                    <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select>
                  <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" placeholder="Date of Birth" />
              </div>
              <Input type="email" placeholder="Email address" />
              <Input type="password" placeholder="Password" />
              <Button type="submit" className="w-full gradient-primary text-primary-foreground">Create Account</Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              By signing up you agree to our <Link to="/" className="text-primary underline">terms and conditions</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">How It Works</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            When you realize you want to spend the rest of your life with somebody, you want the rest of your life to start as soon as possible.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: UserPlus, title: "Sign Up", desc: "Register for free & put up your profile" },
              { icon: Search, title: "Connect", desc: "Select & connect with matches you like" },
              { icon: MessageCircle, title: "Interact", desc: "Become a premium member & start a conversation" },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-2xl font-heading font-bold text-primary mb-1">{i + 1}</div>
                <h3 className="text-xl font-heading font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Millions */}
      <section className="py-20">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Trusted by our Verified Users</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Love is the foundation of every meaningful relationship, built on trust, respect, and understanding. At eBihe.com, we believe in helping you find a connection that lasts forever.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Heart, title: "Best Matches", desc: "Smart compatibility matching based on your values" },
              { icon: CheckCircle, title: "Verified Profiles", desc: "Every profile is verified for authenticity" },
              { icon: Shield, title: "100% Privacy", desc: "Your data is always safe and secure" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Stories Carousel */}
      <section className="py-20 bg-accent/30">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-10">Happy Stories</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">
              <img
                src={stories[storyIdx].img}
                alt={stories[storyIdx].names}
                className="w-full h-64 md:h-full object-cover"
                loading="lazy"
                width={640}
                height={640}
              />
              <div className="p-8 flex flex-col justify-center">
                <Star className="h-5 w-5 text-gold mb-3 fill-current" />
                <p className="text-muted-foreground italic mb-4">"{stories[storyIdx].text}"</p>
                <p className="font-heading font-semibold text-primary">{stories[storyIdx].names}</p>
              </div>
            </div>
            <button onClick={() => setStoryIdx((p) => (p - 1 + stories.length) % stories.length)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-card rounded-full shadow-md p-2 hover:bg-muted">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setStoryIdx((p) => (p + 1) % stories.length)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-card rounded-full shadow-md p-2 hover:bg-muted">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center mt-8">
            <Link to="/happy-stories">
              <Button variant="outline" className="border-primary text-primary hover:bg-accent">View More Stories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">Find Your Perfect Match Today</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            Start your journey with confidence — your perfect match might be just one click away.
          </p>
          <Link to="/register">
            <Button size="lg" className="mt-6 bg-card text-foreground hover:bg-card/90 font-semibold text-lg px-8">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
