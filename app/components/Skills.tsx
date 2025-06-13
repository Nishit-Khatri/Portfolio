"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 90, color: "from-blue-500 to-cyan-500" },
        { name: "Next.js", level: 85, color: "from-gray-700 to-gray-900" },
        { name: "Tailwind CSS", level: 85, color: "from-teal-400 to-blue-500" },
        { name: "JavaScript", level: 80, color: "from-blue-600 to-blue-800" },
        { name: "Framer Motion", level: 75, color: "from-pink-500 to-rose-500" },
      ],
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", level: 80, color: "from-green-500 to-green-700" },
        { name: "MongoDB", level: 75, color: "from-green-600 to-green-800" },
        { name: "Mongoose ORM", level: 75, color: "from-yellow-400 to-blue-500" },
        { name: "Express.js", level: 70, color: "from-gray-600 to-gray-800" },
        { name: "Socket.io", level: 70, color: "from-blue-700 to-indigo-700" },
      ],
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git", level: 90, color: "from-orange-500 to-red-500" },
        { name: "Postman", level: 85, color: "from-blue-500 to-blue-700" },
        { name: "npm", level: 85, color: "from-purple-500 to-pink-500" },
        { name: "Vercel", level: 80, color: "from-yellow-400 to-orange-500" },
        { name: "Visual Studio Code", level: 80, color: "from-red-500 to-pink-500" },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
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
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            My <span className="text-blue-600 dark:text-blue-400">Skills</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"
          />
          <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">{category.title}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="relative"
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredSkill === skill.name ? 1 : 0,
                        }}
                        className="text-sm font-bold text-blue-600 dark:text-blue-400"
                      >
                        {skill.level}%
                      </motion.span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.2 + skillIndex * 0.1,
                          ease: "easeOut",
                        }}
                        className={`h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
