"use client";

import { motion } from "framer-motion";
import { Download, ChevronDown } from "lucide-react";

export default function Hero() {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const preview = () => {
    window.open(process.env.NEXT_PUBLIC_RESUME_LINK, "_blank");
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden mt-6"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto text-center">
        <motion.div initial="hidden" animate="visible" className="space-y-6">
          <motion.h1
            custom={0}
            variants={textVariants}
            className="text-2xl sm:text-4xl lg:text-6xl font-bold leading-tight"
          >
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Nishit Khatri
            </span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={textVariants}
            className="text-sm sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300"
          >
            Full Stack Web Developer
          </motion.p>

          <motion.p
            custom={2}
            variants={textVariants}
            className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 max-w-md sm:max-w-2xl mx-auto leading-relaxed"
          >
            I’m a highly motivated Full Stack Web Developer currently pursuing a
            B.Tech in Electronics and Computer Science. I’m passionate about
            transforming ideas into impactful and user-friendly web applications
            using technologies like React, Next.js, and Tailwind CSS. I strongly
            believe in continuous learning and thrive on tackling challenges
            that help me grow both technically and personally.
          </motion.p>

          <motion.div
            custom={3}
            variants={textVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <motion.button
              onClick={preview}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 shadow-md"
            >
              <Download size={18} />
              <a
                href="./media/Nishit Khatri Resume.pdf"
                download="Nishit-Khatri-Resume.pdf"
              >
                Download Resume
              </a>
            </motion.button>

            <motion.a
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold text-sm sm:text-base hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              View My Work
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 flex justify-center z-50 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400 dark:text-gray-500 text-xs sm:text-sm"
          >
            <span className="mb-1">Scroll Down</span>
            <ChevronDown size={20} className="animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
