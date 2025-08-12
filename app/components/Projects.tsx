"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Eye } from "lucide-react";
import Image from "next/image";

export default function Projects() {
  const projects = [
    {
      title: "Real Time Chat App",
      description:
        "A sleek and responsive web-based chat application that allows users to exchange messages instantly.",
      image: "/media/Real Time Chat App.png?height=300&width=400",
      technologies: [
        "React",
        "Node.js",
        "Socket.io",
        "Express.js",
        "Tailwind CSS",
      ],
      liveUrl: "https://realtimechatapp-delta.vercel.app/",
      githubUrl: "https://github.com/Nishit-Khatri/Real-Time-Chat-App.git",
      featured: true,
    },
    {
      title: "Recipe Generator App",
      description:
        "An AI-powered web app that helps users discover delicious recipes based on the ingredients they have.",
      image: "/media/Recipe Generator App.png?height=300&width=400",
      technologies: ["React", "Tailwind CSS", "Gemini API", "JavaScript"],
      liveUrl: "https://recipe-creator-app.vercel.app/",
      githubUrl: "https://github.com/Nishit-Khatri/Recipe-Creator-App.git",
      featured: true,
    },
    {
      title: "SecureVault",
      description:
        "SecureVault securely stores and organizes all your passwords in one encrypted vault, accessible anytime, anywhere.",
      image: "/media/SecureVault.png?height=300&width=400",
      technologies: ["Next.js", "Tailwind CSS", "radix-ui", "MongoDB"],
      liveUrl: "https://securevaultapp.vercel.app/",
      githubUrl: "https://github.com/Nishit-Khatri/SecureVault",
      featured: true,
    },
    {
      title: "Weather Forecast App",
      description:
        "A clean and user-friendly web application that provides real-time weather updates for any location",
      image: "/media/Weather Forecast App.png?height=300&width=400",
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "Weather API",
        "radix-ui",
        "framer-motion",
      ],
      liveUrl: "https://myweatherforecastapp.vercel.app/",
      githubUrl: "https://github.com/Nishit-Khatri/Weather-Forecast-App",
      featured: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800/50">
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
            Featured{" "}
            <span className="text-blue-600 dark:text-blue-400">Projects</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"
          />
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Here are some of my recent projects that showcase my skills and
            passion for development
          </motion.p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-8 mb-16"
        >
          {projects
            .filter((project) => project.featured)
            .map((project) => (
              <motion.div
                key={project.title}
                variants={itemVariants}
                whileHover="hover"
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <motion.div variants={cardVariants} className="h-full">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Desktop Hover Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 gap-3 hidden sm:flex"
                    >
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={16} />
                        Live Demo
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                      >
                        <Github size={16} />
                        Code
                      </motion.a>
                    </motion.div>
                  </div>

                  {/* Mobile Buttons */}
                  <div className="sm:hidden flex flex-col gap-2 p-4">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={16} />
                      Live Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
        </motion.div>

        {/* Other Projects */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects
            .filter((project) => !project.featured)
            .map((project) => (
              <motion.div
                key={project.title}
                variants={itemVariants}
                whileHover="hover"
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <motion.div variants={cardVariants}>
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-4 right-4 flex gap-2"
                    >
                      <motion.a
                        href={project.liveUrl}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </motion.a>
                      <motion.a
                        href={project.githubUrl}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                      >
                        <Github size={16} />
                      </motion.a>
                    </motion.div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
