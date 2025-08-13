"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Component,
  Boxes,
  Wind,
  Braces,
  Sparkles,
  Server,
  Database,
  Route,
  Radio,
  Link,
  GitBranch,
  SquareCode,
  Send,
  Triangle,
  Package,
} from "lucide-react";
import { LucideProps } from "lucide-react";

export default function Skills() {
  type Skill = {
    name: string;
    icon: React.ComponentType<LucideProps>;
  };

  const ALL_SKILLS: Skill[] = [
    { name: "React", icon: Component },
    { name: "Next.js", icon: Boxes },
    { name: "Tailwind", icon: Wind },
    { name: "JavaScript", icon: Braces },
    { name: "Framer Motion", icon: Sparkles },
    { name: "Node.js", icon: Server },
    { name: "MongoDB", icon: Database },
    { name: "Express", icon: Route },
    { name: "Socket.io", icon: Radio },
    { name: "Mongoose", icon: Link },
    { name: "Git", icon: GitBranch },
    { name: "VS Code", icon: SquareCode },
    { name: "Postman", icon: Send },
    { name: "Vercel", icon: Triangle },
    { name: "npm", icon: Package },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  function VariantShineGlow() {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
      <section className="py-14">
        <div className="relative bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-8 overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-24 w-[22rem] h-[22rem] rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />

          <div className="relative flex flex-wrap gap-3 sm:gap-4">
            {ALL_SKILLS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative rounded-full p-[1px] bg-gradient-to-r from-blue-600/0 via-indigo-500/0 to-purple-600/0 group-hover:from-blue-600/40 group-hover:via-indigo-500/40 group-hover:to-purple-600/40 transition-colors duration-300"
                  >
                    <motion.button
                      type="button"
                      onHoverStart={() => setHovered(i)}
                      onHoverEnd={() => setHovered(null)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative flex items-center gap-2.5 sm:gap-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-3 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
                      aria-label={`${s.name}`}
                    >
                      <Icon
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="font-medium">{s.name}</span>

                      {/* Continuous shine sweep while hovered */}
                      <motion.span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                        <motion.span
                          className="absolute top-0 h-full w-[160%] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          style={{ left: "-30%" }}
                          initial={{ x: "-120%", opacity: 0 }}
                          animate={
                            hovered === i
                              ? { x: ["-120%", "120%"], opacity: 1 }
                              : { x: "-120%", opacity: 0 }
                          }
                          transition={
                            hovered === i
                              ? {
                                  duration: 1.2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }
                              : { duration: 0.2, ease: "easeOut" }
                          }
                          aria-hidden="true"
                        />
                      </motion.span>

                      {/* Subtle ripple */}
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ opacity: 0.18, scale: 1.05 }}
                        transition={{ duration: 0.35 }}
                        style={{
                          background:
                            "radial-gradient(70% 70% at 50% 50%, rgba(99,102,241,0.25), rgba(124,58,237,0) 65%)",
                        }}
                      />
                    </motion.button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
          >
            My <span className="text-blue-600 dark:text-blue-400">Skills</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"
          />
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Here are the technologies and tools I work with to bring ideas to
            life
          </motion.p>
        </motion.div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VariantShineGlow />
      </div>
    </section>
  );
}
