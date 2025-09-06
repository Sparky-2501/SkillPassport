import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Globe, 
  Zap, 
  Award, 
  Briefcase, 
  TrendingUp, 
  Users,
  ChevronUp,
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import type { LandingProps } from "../types";

export default function Landing({ setHasVisited }: LandingProps) {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => {
    localStorage.setItem("visited", "true");
    setHasVisited(true);
    navigate("/login");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2c] via-[#1c1f40] to-[#2d1b69] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
        
        <motion.div 
          className="max-w-6xl mx-auto text-center relative z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            variants={fadeInUp}
          >
            Your Professional Credentials{" "}
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Verified Forever
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            variants={fadeInUp}
          >
            The world's first decentralized skill passport. Collect tamper-proof credentials, 
            showcase verified abilities, and unlock limitless opportunities with blockchain-secured proof of your expertise.
          </motion.p>

          <motion.button
            onClick={handleStart}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-5 rounded-2xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl mb-16"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Building Your Passport
            <ArrowRight className="inline-block ml-2 w-6 h-6" />
          </motion.button>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
          >
            {[
              { number: "50K+", label: "Verified Credentials", icon: CheckCircle },
              { number: "500+", label: "Trusted Issuers", icon: Shield },
              { number: "1M+", label: "Verifications", icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <stat.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose SkillPassport */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              variants={fadeInUp}
            >
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                SkillPassport?
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Tamper-Proof Verification",
                  description: "Your credentials can't be faked or altered thanks to blockchain technology and cryptographic security.",
                  gradient: "from-green-500 to-emerald-600"
                },
                {
                  icon: Globe,
                  title: "Universally Portable",
                  description: "Carry your skills anywhere in the world. Your credentials work across borders and industries.",
                  gradient: "from-blue-500 to-cyan-600"
                },
                {
                  icon: Zap,
                  title: "Instant Verification",
                  description: "Get proof of expertise in seconds. No more waiting for manual verification processes.",
                  gradient: "from-purple-500 to-pink-600"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-[#11152e] p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group"
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Benefits */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#0f1419] to-[#1a1d3a]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              variants={fadeInUp}
            >
              Professional{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Benefits
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Award,
                  title: "Showcase Verified Abilities",
                  description: "Display your skills with cryptographic proof that employers can trust instantly."
                },
                {
                  icon: Globe,
                  title: "Unlock Global Opportunities",
                  description: "Access international job markets with universally recognized credentials."
                },
                {
                  icon: TrendingUp,
                  title: "Gain Competitive Advantage",
                  description: "Stand out from the crowd with verifiable proof of your expertise and achievements."
                },
                {
                  icon: Users,
                  title: "Build Trust with Employers",
                  description: "Eliminate hiring friction with transparent, verifiable professional credentials."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <benefit.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Organizations */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-8"
              variants={fadeInUp}
            >
              Trusted by{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Leading Organizations
              </span>
            </motion.h2>

            <motion.p 
              className="text-xl text-gray-300 text-center mb-16"
              variants={fadeInUp}
            >
              Recognized and accepted by industry leaders worldwide
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center"
              variants={staggerContainer}
            >
              {["Google", "AWS", "Microsoft", "IBM", "Meta"].map((company, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 flex items-center justify-center"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-white">{company}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-8"
              variants={fadeInUp}
            >
              Ready to Build Your{" "}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Digital Skill Passport?
              </span>
            </motion.h2>

            <motion.p 
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Join thousands of professionals who have already secured their credentials on the blockchain.
            </motion.p>

            <motion.button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create My Passport Now
              <ArrowRight className="inline-block ml-3 w-8 h-8" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-2xl z-50 transition-all duration-300"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </div>
  );
}