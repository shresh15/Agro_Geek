import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dhutra from "../assets/serv1.png";
import l2 from "../assets/serv2.png";
import leaves from "../assets/serv3.png";

const images = [dhutra, l2, leaves];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row">
      <div className="h-[100vh] w-[50vw] flex flex-col justify-center items-center overflow-hidden relative">
        <AnimatePresence mode="wait">
          {images.map(
            (image, i) =>
              i === index && (
                <motion.div
                  key={i}
                  style={{
                    width: "25vw",
                    height: "55vh",
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    position: "absolute",
                  }}
                  className="w-[25vw] h-[55vh] rounded-xl shadow-xl mt-[140px] ml-[2vw]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                ></motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
