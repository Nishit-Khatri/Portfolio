"use client"

import type React from "react"

import { motion, AnimatePresence, type Variants } from "framer-motion"
import { useState } from "react"
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight, AlertCircle, Loader2 } from "lucide-react"

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // Honeypot field (hidden from legitimate human visitors)
  })

  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  // Validate fields on client side
  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.name.trim()) {
      errors.name = "Full Name is required."
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "Email address is required."
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address."
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required."
    } else if (formData.subject.trim().length < 2) {
      errors.subject = "Subject must be at least 2 characters long."
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required."
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      let data: any = null
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json()
        } catch (jsonErr) {
          console.error("Failed to parse JSON response:", jsonErr)
        }
      }

      // Safely handle non-JSON or HTML responses (e.g. 404 HTML pages from static hosts)
      if (!data) {
        const textResponseBody = await response.text().catch(() => "")
        console.error("Non-JSON response received from server:", response.status, textResponseBody)

        if (response.status === 404) {
          setServerError(
            "Contact API route was not found (404). Please ensure the backend is deployed with Node.js / Vercel serverless support."
          )
        } else {
          setServerError(
            `Server returned an invalid response (${response.status}). Please try again later or email directly.`
          )
        }
        setIsSubmitting(false)
        return
      }

      if (!response.ok || !data.success) {
        if (data.validationErrors) {
          setFieldErrors(data.validationErrors)
        }
        setServerError(
          data.error || "Failed to send message. Please try again later or email directly."
        )
        setIsSubmitting(false)
        return
      }

      // Success
      setIsSubmitting(false)
      setIsSubmitted(true)
      setShowSuccessAnimation(true)
      setFieldErrors({})
      setFormData({ name: "", email: "", subject: "", message: "", website: "" })

      // Auto-hide submitted status after animation finishes
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (err: any) {
      console.error("Error submitting contact form:", err)
      const errorMessage =
        err?.message && !err.message.includes("Unexpected token")
          ? err.message
          : "Unable to connect to the server. Please check your network or try again later."
      setServerError(errorMessage)
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear field-specific error as user types
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }

    // Clear general server error
    if (serverError) {
      setServerError(null)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "nishitkhatri.dev@gmail.com",
      href: "mailto:nishitkhatri.dev@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 9768821161",
      href: "tel:+91 9768821161",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Mumbai, Maharashtra",
    },
  ]

  // Framer Motion Animation Variants with explicit TypeScript types
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const formVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const successContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  }

  const successItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  const checkmarkPathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  }

  const messagePathVariants: Variants = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: -60,
      opacity: [0, 1, 0],
      transition: { duration: 1.5, ease: "easeOut", times: [0, 0.3, 1] },
    },
  }

  const particleVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: Math.cos((i * Math.PI * 2) / 12) * 50,
      y: Math.sin((i * Math.PI * 2) / 12) * 50,
      transition: { duration: 1.5, ease: "easeOut" },
    }),
  }

  return (
    <section id="contact" className="py-20 relative">
      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={successContainerVariants}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
              variants={successItemVariants}
            >
              {/* Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={particleVariants}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-blue-500"
                />
              ))}

              {/* Success Circle */}
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  style={{ border: "2px solid #10B981" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  style={{ border: "2px solid #10B981" }}
                />

                {/* Checkmark */}
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <motion.path variants={checkmarkPathVariants} d="M5 13l4 4L19 7" />
                </motion.svg>

                {/* Flying Message Icon */}
                <motion.div
                  variants={messagePathVariants}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-500"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </motion.div>
              </motion.div>

              <motion.h3
                variants={successItemVariants}
                className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2"
              >
                Message Sent!
              </motion.h3>

              <motion.p variants={successItemVariants} className="text-center text-gray-600 dark:text-gray-300 mb-6">
                Thank you for reaching out! A confirmation email has been sent to your inbox, and I'll get back to you as soon as possible.
              </motion.p>

              <motion.button
                variants={successItemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessAnimation(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Get In <span className="text-blue-600 dark:text-blue-400">Touch</span>
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"
          />
          <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I'm always open to discussing new opportunities, collaborations, or answering any questions. Send me a message and I'll respond as soon as possible!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Whether you have a project in mind, want to collaborate, or just want to say hello, I'd love to hear
                from you. Feel free to reach out through any of the channels below.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-6">
              {contactInfo.map((info) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
                  >
                    <info.icon className="text-white" size={24} />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {info.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={formVariants}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
          >
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3 text-red-700 dark:text-red-300 text-sm"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Unable to Send Message</div>
                  <p>{serverError}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Anti-spam Honeypot Field (hidden from real users) */}
              <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                      fieldErrors.name
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Your Full Name"
                  />
                  {fieldErrors.name && (
                    <p id="name-error" className="text-xs text-red-500 dark:text-red-400 mt-1">
                      {fieldErrors.name}
                    </p>
                  )}
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                      fieldErrors.email
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="text-xs text-red-500 dark:text-red-400 mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </motion.div>
              </div>

              <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  aria-invalid={!!fieldErrors.subject}
                  aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    fieldErrors.subject
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="What's this about?"
                />
                {fieldErrors.subject && (
                  <p id="subject-error" className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {fieldErrors.subject}
                  </p>
                )}
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? "message-error" : undefined}
                  disabled={isSubmitting}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none ${
                    fieldErrors.message
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Tell me about your project or just say hello!"
                />
                {fieldErrors.message && (
                  <p id="message-error" className="text-xs text-red-500 dark:text-red-400 mt-1">
                    {fieldErrors.message}
                  </p>
                )}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isSubmitted
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""} shadow-lg hover:shadow-xl`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitted ? (
                    <>
                      <CheckCircle size={20} />
                      Message Sent!
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </div>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
