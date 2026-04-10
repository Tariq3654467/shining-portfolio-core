import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import couple1 from "@/assets/happy-couple-1.jpg";
import couple2 from "@/assets/happy-couple-2.jpg";
import couple3 from "@/assets/happy-couple-3.jpg";

const stories = [
  { img: couple1, names: "Arun & Priya", location: "Kathmandu, Nepal", text: "We found each other on ebihe.com and knew it was meant to be. The platform made the entire process feel natural and respectful. Thank you for making our dream come true!", date: "Married in 2024" },
  { img: couple2, names: "Raj & Sita", location: "New York, USA", text: "ebihe.com helped us connect across continents. Despite the distance, the platform made communication so easy. Now we are happily married and grateful every day.", date: "Married in 2023" },
  { img: couple3, names: "Kiran & Anita", location: "London, UK", text: "The platform made finding my life partner so simple. The verified profiles gave us confidence, and we connected on a deeper level right from the start.", date: "Married in 2024" },
];

const HappyStories = () => (
  <div className="py-16">
    <div className="container">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-center">Happy Stories</h1>
      <p className="text-muted-foreground text-center mt-2 mb-12 max-w-lg mx-auto">
        Real couples who found their soulmates through ebihe.com
      </p>

      <div className="space-y-12">
        {stories.map((s, i) => (
          <motion.div
            key={s.names}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`bg-card rounded-2xl border overflow-hidden grid md:grid-cols-2 ${
              i % 2 === 1 ? "md:direction-rtl" : ""
            }`}
          >
            <img
              src={s.img}
              alt={s.names}
              className={`w-full h-72 md:h-full object-cover ${i % 2 === 1 ? "md:order-2" : ""}`}
              loading="lazy"
              width={640}
              height={640}
            />
            <div className={`p-8 md:p-10 flex flex-col justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-muted-foreground italic leading-relaxed">{s.text}</p>
              <div className="flex gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-gold fill-current" />
                ))}
              </div>
              <div className="mt-4">
                <p className="font-heading font-semibold text-lg">{s.names}</p>
                <p className="text-sm text-muted-foreground">{s.location} · {s.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default HappyStories;
