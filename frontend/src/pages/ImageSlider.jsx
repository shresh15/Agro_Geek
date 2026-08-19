import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dhutra from "../assets/dhutra.jpeg";
import l2 from "../assets/l2.jpg";
import leaves from "../assets/leaves.jpg";
import wood from "../assets/wood.png";

const images = [
  { src: dhutra, alt: "Dhutra plant medicinal source" },
  { src: l2, alt: "Agricultural leaves under inspection" },
  { src: leaves, alt: "Lush green ayurvedic herbs" },
  { src: wood, alt: "Natural agricultural waste wood" }
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/60 bg-emerald-50/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            backgroundImage: `url(${images[index].src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label={images[index].alt}
        />
      </AnimatePresence>

      {/* Modern gradient overlay on slide for premium appearance */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Active Dot Indicators (Fully transparent wrapper, clear floating dots) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-row gap-2.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md ${
              i === index ? "bg-emerald-500 w-6" : "bg-white/80 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
