import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import imageone from "../assets/darkened_image1.png";
import imagetwo from "../assets/darkened_image2.png";
import imagethree from "../assets/darkened_image3.png";
import logonew from "../assets/Logonew.png";
import collagepage from "../assets/collageremoved.png";
import { useEffect, useState } from "react";
import { Element } from "react-scroll";
import { 
  FiMenu, 
  FiX, 
  FiArrowRight, 
  FiCheckCircle, 
  FiCpu, 
  FiTrendingUp, 
  FiLayers, 
  FiCloudRain, 
  FiArrowUpRight 
} from "react-icons/fi";
import { 
  FaTwitter, 
  FaLinkedinIn, 
  FaGithub, 
  FaFacebookF 
} from "react-icons/fa";

import ImageSlider from "./ImageSlider";
import "/public/home.css";

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for navbar styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = () => {
    navigate("/register");
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 90; // Fixed navbar offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Animation configurations
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.15
      }
    },
    viewport: { once: true, margin: "-100px" }
  };

  return (
    <div className="bg-[#fcfdfc] text-[#1b2e1e] min-h-screen">
      
      {/* 🔹 FLOATING GLASSMORPHIC NAVBAR */}
      <nav 
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-16 rounded-2xl z-[100] transition-all duration-300 flex items-center justify-between px-6 md:px-8 ${
          scrolled 
            ? "glass-nav shadow-lg border-emerald-100/50" 
            : "bg-white/50 backdrop-blur-sm border border-white/20"
        }`}
      >
        {/* Brand/Logo */}
        <div 
          onClick={() => scrollToSection("hero")} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="font-brand text-2xl text-emerald-800 font-bold tracking-wide transition-colors group-hover:text-emerald-600">
            AgroGeek
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-700">
          <li 
            onClick={() => scrollToSection("hero")}
            className="cursor-pointer hover:text-emerald-700 transition-colors"
          >
            Home
          </li>
          <li 
            onClick={() => scrollToSection("about")}
            className="cursor-pointer hover:text-emerald-700 transition-colors"
          >
            About Us
          </li>
          <li 
            onClick={() => scrollToSection("services")}
            className="cursor-pointer hover:text-emerald-700 transition-colors"
          >
            Services
          </li>
          <li 
            onClick={() => scrollToSection("how-it-works")}
            className="cursor-pointer hover:text-emerald-700 transition-colors"
          >
            Workflow
          </li>
        </ul>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={handleNavigation}
            className="h-10 px-5 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-800/10 transition-all duration-200"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-0 right-0 p-6 rounded-2xl glass-card shadow-xl border border-emerald-100/50 flex flex-col gap-4 z-50 md:hidden mx-2"
            >
              <ul className="flex flex-col gap-4 text-slate-800 font-medium">
                <li onClick={() => scrollToSection("hero")} className="py-2 border-b border-slate-100 cursor-pointer">Home</li>
                <li onClick={() => scrollToSection("about")} className="py-2 border-b border-slate-100 cursor-pointer">About Us</li>
                <li onClick={() => scrollToSection("services")} className="py-2 border-b border-slate-100 cursor-pointer">Services</li>
                <li onClick={() => scrollToSection("how-it-works")} className="py-2 border-b border-slate-100 cursor-pointer">Workflow</li>
              </ul>
              <button 
                onClick={handleNavigation}
                className="w-full py-3 rounded-xl bg-emerald-800 text-white font-semibold text-center hover:bg-emerald-700 transition-colors mt-2"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🔹 HERO SECTION */}
      <Element name="hero">
        <div 
          id="hero" 
          className="relative min-h-screen pt-28 pb-16 flex items-center justify-center bg-gradient-to-b from-emerald-50/40 via-white to-transparent"
        >
          {/* Subtle background overlay grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.08rem,transparent_0.08rem)] [background-size:1.5rem_1.5rem] opacity-[0.06] pointer-events-none" />
          
          <div className="w-[90%] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col text-left items-start"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100/60 text-emerald-800 font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Connecting Harvesters & Buyers
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
                Sustainable Sourcing, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-700">
                  Smarter Agriculture.
                </span>
              </h1>
              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
                AgroGeek bridges the gap between local farmers and sustainable industries. 
                We eliminate middlemen, empowering local communities by turning agricultural 
                waste and unutilized flora into valuable raw material resources.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={handleNavigation}
                  className="px-8 py-4 rounded-xl bg-emerald-800 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-800/10 transition-all duration-200"
                >
                  Join the Marketplace
                  <FiArrowRight size={18} />
                </button>
                <button 
                  onClick={() => scrollToSection("about")}
                  className="px-8 py-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50/50 transition-all"
                >
                  Learn Our Mission
                </button>
              </div>
            </motion.div>

            {/* Right Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center items-center relative"
            >
              {/* Floating blur circles */}
              <div className="absolute w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl -z-10 -top-10 -left-10" />
              <div className="absolute w-64 h-64 rounded-full bg-green-200/30 blur-3xl -z-10 -bottom-10 -right-10" />
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/60 glass-card p-4 flex flex-col justify-between"
              >
                <div 
                  className="w-full h-[78%] rounded-2xl bg-cover bg-center shadow-inner relative"
                  style={{ backgroundImage: `url(${logonew})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl" />
                </div>
                <div className="h-[18%] flex flex-col justify-center px-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Direct B2B Integration</h4>
                      <p className="text-xs text-slate-500">100% Certified Sourcing</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
                      Live Portal
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Element>

      {/* 🔹 STATS BAR */}
      <div className="bg-emerald-950 py-12 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="w-[90%] max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10 text-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-400">5,000+</h3>
            <p className="text-slate-300 text-xs md:text-sm mt-2 font-medium">Farmers Connected</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-400">150+</h3>
            <p className="text-slate-300 text-xs md:text-sm mt-2 font-medium">Industrial Buyers</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-400">20k+ Tons</h3>
            <p className="text-slate-300 text-xs md:text-sm mt-2 font-medium">Waste Sourced</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-400">100%</h3>
            <p className="text-slate-300 text-xs md:text-sm mt-2 font-medium">Direct Transparency</p>
          </div>
        </div>
      </div>

      {/* 🔹 ABOUT US SECTION */}
      <Element name="about">
        <div 
          id="about" 
          className="py-24 bg-white"
        >
          <div className="w-[90%] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Responsive Image Slider Container */}
            <motion.div 
              {...fadeInUp}
              className="w-full flex justify-center"
            >
              <div className="w-full max-w-md lg:max-w-none">
                <ImageSlider />
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div 
              {...fadeInUp}
              className="flex flex-col text-left items-start justify-center"
            >
              <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md mb-4">
                The Crisis
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                A Crisis We Can't Ignore
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our local environment faces dual challenges: organic resources are routinely wasted, 
                and leaves or wood are incinerated, contributing to severe air quality decline. 
                At the same time, domestic Ayurvedic and pharmaceutical organizations are forced 
                to import native flora from international suppliers.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                <strong>AgroGeek</strong> intercepts this supply-chain failure. By collecting 
                and cataloging unutilized vegetation and manufacturing waste, we create a verified, 
                fair-value bridge directly connecting local harvesters with national enterprises.
              </p>

              {/* Mini Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <FiCheckCircle className="text-emerald-600 shrink-0" size={20} />
                  <span>Waste Valorization</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <FiCheckCircle className="text-emerald-600 shrink-0" size={20} />
                  <span>Zero Middlemen Fees</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <FiCheckCircle className="text-emerald-600 shrink-0" size={20} />
                  <span>Medicinal Supply Chains</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                  <FiCheckCircle className="text-emerald-600 shrink-0" size={20} />
                  <span>Verified Sourcing</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </Element>

      {/* 🔹 SERVICES SECTION */}
      <Element name="services">
        <div 
          id="services" 
          className="py-24 bg-gradient-to-b from-white via-emerald-50/20 to-emerald-50/40 border-y border-emerald-100/30"
        >
          <div className="w-[90%] max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md mb-4 inline-block">
                Core Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
                Services We Provide
              </h2>
              <p className="text-slate-600 text-base md:text-lg">
                Fostering an ecosystem built on trust, efficiency, and resource optimization. 
                Discover how our specialized digital tools serve both buyers and suppliers.
              </p>
            </div>

            {/* Services Grid */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            >
              {/* Card 1 */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                    <FiTrendingUp size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Direct Marketplace</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Eliminate broker fees. Direct negotiation interface between agricultural producers and business owners.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <span onClick={handleNavigation} className="text-xs font-semibold text-emerald-800 hover:text-emerald-600 flex items-center gap-1 cursor-pointer">
                    Access Marketplace <FiArrowUpRight />
                  </span>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                    <FiLayers size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Waste Sourcing</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Sell agricultural leftovers, timber fragments, and excess flora that would otherwise be discarded or burned.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <span onClick={handleNavigation} className="text-xs font-semibold text-emerald-800 hover:text-emerald-600 flex items-center gap-1 cursor-pointer">
                    List Resources <FiArrowUpRight />
                  </span>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                    <FiCpu size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">AI Sourcing Guide</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Leverage machine learning tools for crop demand analysis, smart pricing models, and botanical matching.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <a href="https://ayurvai.streamlit.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-800 hover:text-emerald-600 flex items-center gap-1">
                    Open AI Portal <FiArrowUpRight />
                  </a>
                </div>
              </motion.div>

              {/* Card 4 */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                    <FiCloudRain size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Weather Analytics</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Check immediate local weather reports to plan planting, harvesting, and logistic windows accurately.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50">
                  <span onClick={() => navigate("/weather")} className="text-xs font-semibold text-emerald-800 hover:text-emerald-600 flex items-center gap-1 cursor-pointer">
                    View Weather Forecast <FiArrowUpRight />
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Collage Subsection */}
            <motion.div 
              {...fadeInUp}
              className="mt-20 p-8 md:p-12 rounded-3xl bg-white border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-12 items-center"
            >
              <div className="w-full lg:w-1/2">
                <img 
                  src={collagepage} 
                  alt="Agricultural Ecosystem Collage" 
                  className="w-full h-auto max-h-[380px] object-contain rounded-2xl" 
                />
              </div>
              <div className="w-full lg:w-1/2 text-left flex flex-col items-start justify-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Unlocking Value from Environmental Waste
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  By cataloging agricultural byproduct locations, we minimize supply delays, 
                  cut transportation footprints, and guarantee fair-trade values for farmers. 
                  Businesses get local access to raw ingredients, and local areas get cleaner air 
                  by keeping waste out of firepits.
                </p>
                <button 
                  onClick={handleNavigation}
                  className="h-11 px-6 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
                >
                  Join the Network
                  <FiArrowRight size={16} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </Element>

      {/* 🔹 WORKFLOW SECTION */}
      <Element name="how-it-works">
        <div id="how-it-works" className="py-24 bg-white">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md mb-4 inline-block">
                Onboarding Flow
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
                How It Works
              </h2>
              <p className="text-slate-600">
                A simple three-step architecture designed to transition unused materials into economic assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line for large screens */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 -z-10" />

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-extrabold text-xl flex items-center justify-center mb-6 shadow-md bg-white">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Create Account</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Register as a Seller (Farmer/Harvester) or Buyer (Ayurvedic/Industrial Enterprise) to build your profile.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-extrabold text-xl flex items-center justify-center mb-6 shadow-md bg-white">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">List or Discover</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Sellers catalog their local flora or timber waste. Companies browse geo-mapped listings looking for matching components.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-extrabold text-xl flex items-center justify-center mb-6 shadow-md bg-white">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Execute Secure Trade</h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Establish straight-to-producer trade pipelines with clear specifications, locked pricing, and direct communications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Element>

      {/* 🔹 CALL TO ACTION BANNER */}
      <div className="py-20 bg-gradient-to-r from-emerald-800 to-green-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-emerald-700),transparent_50%)] opacity-30" />
        <div className="w-[90%] max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
            Ready to Revolutionize Your Agricultural Procurement?
          </h2>
          <p className="text-slate-200 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Whether you want to earn value from organic waste products or secure localized raw botanical materials, AgroGeek is here for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate("/details?role=farmer")}
              className="px-8 py-4 rounded-xl bg-white text-emerald-950 font-bold hover:bg-slate-100 hover:shadow-lg transition-all"
            >
              Register as Seller
            </button>
            <button 
              onClick={() => navigate("/details?role=company")}
              className="px-8 py-4 rounded-xl bg-emerald-700 border border-emerald-600 text-white font-bold hover:bg-emerald-600 hover:shadow-lg transition-all"
            >
              Partner as Company
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 PROFESSIONAL FOOTER */}
      <footer id="footer" className="bg-emerald-950 border-t border-emerald-900/60 pt-16 pb-8 text-slate-300 relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.05rem,transparent_0.05rem)] [background-size:2rem_2rem] opacity-[0.03] pointer-events-none" />
        
        <div className="w-[90%] max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-emerald-900 z-10 relative">
          
          {/* Col 1: Bio */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <span className="font-brand text-2xl text-white font-bold tracking-wide mb-4">
              AgroGeek
            </span>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
              Transforming B2B agricultural sourcing by turning localized flora and organic leftovers into high-value raw material pipelines.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-emerald-900/50 hover:bg-emerald-500 hover:text-emerald-950 flex items-center justify-center transition-colors text-slate-300" aria-label="Twitter">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-emerald-900/50 hover:bg-emerald-500 hover:text-emerald-950 flex items-center justify-center transition-colors text-slate-300" aria-label="LinkedIn">
                <FaLinkedinIn size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-emerald-900/50 hover:bg-emerald-500 hover:text-emerald-950 flex items-center justify-center transition-colors text-slate-300" aria-label="GitHub">
                <FaGithub size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-emerald-900/50 hover:bg-emerald-500 hover:text-emerald-950 flex items-center justify-center transition-colors text-slate-300" aria-label="Facebook">
                <FaFacebookF size={15} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 lg:pl-8 text-left">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-4">Platform</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li><span onClick={() => scrollToSection("hero")} className="hover:text-emerald-400 cursor-pointer transition-colors">Home</span></li>
              <li><span onClick={() => scrollToSection("about")} className="hover:text-emerald-400 cursor-pointer transition-colors">About Us</span></li>
              <li><span onClick={() => scrollToSection("services")} className="hover:text-emerald-400 cursor-pointer transition-colors">Services</span></li>
              <li><span onClick={() => navigate("/weather")} className="hover:text-emerald-400 cursor-pointer transition-colors">Weather Reports</span></li>
              <li><a href="https://ayurvai.streamlit.app/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">AI Sourcing Guide</a></li>
            </ul>
          </div>

          {/* Col 3: Developer */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-4">Developer</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li>
                <p className="text-white font-medium">Shrestha</p>
                <p className="text-xs text-slate-500">Lead Developer</p>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-4">Stay In Touch</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Get updates about regional raw materials directories and marketplace announcements.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="w-full h-11 px-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-emerald-950 font-bold text-sm tracking-wide transition-all shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright area */}
        <div className="w-[90%] max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgroGeek. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Security</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
