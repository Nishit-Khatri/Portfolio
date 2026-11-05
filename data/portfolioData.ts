
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyUrl: string;
  isDemo?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  github: string;
  demo: string;
  image: string;
}

export interface SkillCategory {
  label: string;
  note?: string;
  items: string[];
}

export interface Internship {
  title: string;
  company: string;
  period: string;
  focus: string;
}

export const portfolioData = {
  profile: {
    name: "Nishit Khatri",
    title: "Full Stack Web Developer",
    location: process.env.NEXT_PUBLIC_LOCATION || "India",
    tagline: "building modern web applications.",
    intro: "B.Tech graduate in Electronics and Computer Science, based in India.",
    photo: "/media/images/profile.jpeg",
    photoAlt: "Portrait of Nishit Khatri",
    resumeLink: process.env.NEXT_PUBLIC_RESUME_LINK
  },

  about: {
    text: "I'm Nishit Khatri, a Full Stack Web Developer and B.Tech graduate in Electronics and Computer Science from Shah & Anchor Kutchhi Engineering College. I enjoy building modern, responsive web applications that combine intuitive user interfaces with reliable backend functionality. My experience includes developing React and Next.js applications, building backend services with Node.js and Express, working with MongoDB, integrating APIs, and deploying applications. I've worked on projects involving real-time communication, password management, AI-powered recipe generation, and weather forecasting. I'm also familiar with development workflows and DevOps tools such as Docker. I'm passionate about learning modern technologies, writing clean and maintainable code, solving practical problems, and creating useful digital experiences.",
    funFact: "I'm passionate about exploring emerging technologies, experimenting with AI, and building innovative projects that turn creative ideas into practical solutions.",
  },

  stats: [
    { label: "Projects built", value: "4" },
    { label: "Virtual internships", value: "2" },
    { label: "B.Tech graduate", value: "2026" },
  ],

  education: {
    degree: "B.Tech in Electronics and Computer Science",
    institution: "Shah & Anchor Kutchhi Engineering College",
    status: "Completed",
    year: "2026",
  },

  internships: [
    {
      title: "Web Full Stack Developer Virtual Internship",
      company: "EduSkills",
      period: "Apr 2025 – Jun 2025",
      focus: "Full Stack Web Development",
    },
    {
      title: "DevOps & Cloud Automation Virtual Internship",
      company: "AICTE–EduSkills",
      period: "Jan 2026 – Mar 2026",
      focus: "DevOps and Cloud Automation",
    },
  ] as Internship[],

  projects: [
    {
      id: "01",
      title: "SecureVault",
      description:
        "A password manager application designed to organize credentials through a clean and user-friendly interface.",
      stack: ["Next.js", "TailwindCSS", "MongoDB", "Mongoose"],
      github: process.env.NEXT_PUBLIC_SECUREVAULT_GITHUB_LINK,
      demo: process.env.NEXT_PUBLIC_SECUREVAULT_DEMO_LINK,
      image: "/media/images/SecureVault.png",
    },
    {
      id: "02",
      title: "Live Chat App",
      description:
        "A real-time messaging application focused on interactive conversations and seamless communication.",
      stack: ["React", "Node.js", "Express.js", "Socket.io", "MongoDB", "Mongoose"],
      github: process.env.NEXT_PUBLIC_LIVE_CHAT_APP_GITHUB_LINK,
      demo: process.env.NEXT_PUBLIC_LIVE_CHAT_APP_DEMO_LINK,
      image: "/media/images/Real Time Chat App.png",
    },
    {
      id: "03",
      title: "AI Recipe Generator",
      description:
        "An AI-powered application that generates recipe suggestions based on available ingredients and user preferences.",
      stack: ["React", "Gemini API / AI integration"],
      github: process.env.NEXT_PUBLIC_AI_RECIPE_GENERATOR_GITHUB_LINK,
      demo: process.env.NEXT_PUBLIC_AI_RECIPE_GENERATOR_DEMO_LINK,
      image: "/media/images/Recipe Creator App.png",
    },
    {
      id: "04",
      title: "Weather Forecast Website",
      description:
        "A responsive weather application that lets users search locations, view current weather conditions.",
      stack: ["Next.js", "TailwindCSS", "Weather API integration"],
      github: process.env.NEXT_PUBLIC_WEATHER_FORECAST_WEBSITE_GITHUB_LINK,
      demo: process.env.NEXT_PUBLIC_WEATHER_FORECAST_WEBSITE_DEMO_LINK,
      image: "/media/images/Weather Forecast App.png",
    },
  ] as Project[],

  hideEmptyProjectLinks: true,

  skills: {
    frontend: {
      label: "Frontend",
      note: "Primary",
      items: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "React", "Next.js"],
    },
    backend: {
      label: "Backend",
      note: "Primary",
      items: ["Node.js", "Express.js", "MongoDB", "Mongoose", "Socket.io"],
    },
    devops: {
      label: "DevOps",
      note: "Additional Exposure",
      items: ["Docker", "Docker Compose", "GitHub Actions", "CI/CD"],
    },
    cloud: {
      label: "Cloud",
      note: "Additional Exposure",
      items: ["AWS", "GCP"]
    },
    tools: {
      label: "Developer Tools",
      items: ["Git", "GitHub", "VS Code", "Postman", "npm"],
    }
  } as Record<string, SkillCategory>,


  showDemoCertificates: false,
  certifications: [

    {
      id: "01",
      title: "DevOps & Cloud Automation Virtual Internship",
      issuer: "EduSkills Academy",
      date: "January - March 2026",
      credentialId: "4461b844448b89ea4928",
      verifyUrl: process.env.NEXT_PUBLIC_DEVOPS_CERTIFICATE_LINK,
      isDemo: false,
    },
    {
      id: "02",
      title: "Bootstrap Training",
      issuer: "Spoken Tutorial, EduPyramids, SINE, IIT Bombay",
      date: "20 / September / 2025",
      credentialId: "3318728SIE",
      verifyUrl: process.env.NEXT_PUBLIC_BOOTSTRAP_CERTIFICATE_LINK,
      isDemo: false,
    },
    {
      id: "03",
      title: "Web Full Stack Developer Virtual Internship",
      issuer: "EduSkills Academy",
      date: "April - June 2025",
      credentialId: "b70b60d69d9af4c082f19d211237c56a",
      verifyUrl: process.env.NEXT_PUBLIC_FULL_STACK_CERTIFICATE_LINK,
      isDemo: false,
    },
    {
      id: "04",
      title: "JavaScript Training",
      issuer: "Spoken Tutorial, EduPyramids, SINE, IIT Bombay",
      date: "05 / October / 2024",
      credentialId: "3318728KCY",
      verifyUrl: process.env.NEXT_PUBLIC_JAVASCRIPT_CERTIFICATE_LINK,
      isDemo: false,
    },
    {
      id: "05",
      title: "Web Fundamentals: Web Development with HTML",
      issuer: "Infosys Springboard",
      date: "03 / August / 2024",
      verifyUrl: process.env.NEXT_PUBLIC_WEB_CERTIFICATE_LINK,
      isDemo: false,
    },
  ] as Certificate[],

  contact: {
    email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim(),
    github: (process.env.NEXT_PUBLIC_GITHUB_URL ?? "").trim(),
    linkedin: (process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "").trim(),
    phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  },
};

export const profile = portfolioData.profile;

