export type HomeFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
  buttonText?: string;
  buttonLink?: string;
};

export type HomeConfidenceMetric = { label: string; value: string };

export type HomeCategoryItem = {
  title: string;
  description: string;
  ctaText?: string;
  href?: string;
  icon?: string;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  heroShowcase?: {
    badge: string;
    title: string;
    description: string;
    metrics: HomeConfidenceMetric[];
    ctaText: string;
  };
  categoriesSection?: {
    eyebrow: string;
    title: string;
    description: string;
    items?: HomeCategoryItem[];
  };
  whyChooseUsSection?: {
    eyebrow: string;
    title: string;
    description: string;
  };
  features: HomeFeature[];
  featuredProsSection?: {
    eyebrow: string;
    title: string;
    ctaText: string;
  };
  ctaDualBanner?: {
    client: {
      badge: string;
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
    pro: {
      badge: string;
      title: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
};

export const defaultHomeContent: HomeContent = {
  hero: {
    eyebrow: "VERIFIED MARKETPLACE PROFESSIONALS",
    title: "Find trusted professionals for work that matters.",
    description: "Post work, compare qualified professionals, and manage every project in one place.",
    primaryCta: "Browse professionals",
    secondaryCta: "Post a job",
  },
  heroShowcase: {
    badge: "Verified Service Marketplace",
    title: "Klick-Pro",
    description: "Find trusted professionals for work that matters. Post requirements, compare quotes, and hire with milestone escrow safety.",
    metrics: [
      { label: "Security", value: "100% Escrow" },
      { label: "Posting", value: "₹0 To Post" },
      { label: "Identity", value: "Vetted KYC" },
    ],
    ctaText: "Explore All Service Sectors",
  },
  categoriesSection: {
    eyebrow: "SERVICES FOR EVERYONE",
    title: "Residential, Commercial, Industrial & more",
    description: "From a leaking tap to a factory upgrade to a health check or a private tutor, find the right expert for any job.",
    items: [
      {
        title: "Residential",
        description: "Electricians, plumbers, cleaners, painters, carpenters, tutors and home care.",
        ctaText: "Explore Residential",
        href: "/services?sector=residential",
      },
      {
        title: "Commercial",
        description: "Office fit-outs, facility upkeep, photography, marketing, accounting and legal help.",
        ctaText: "Explore Commercial",
        href: "/services?sector=commercial",
      },
      {
        title: "Industrial",
        description: "Machinery maintenance, industrial wiring, welding, safety audits and logistics.",
        ctaText: "Explore Industrial",
        href: "/services?sector=industrial",
      },
      {
        title: "Health Care",
        description: "Nurses, caregivers, physiotherapists, therapists, medical technicians and wellness support.",
        ctaText: "Explore Health Care",
        href: "/services?sector=healthcare",
      },
      {
        title: "Personal Care & Home Services",
        description: "Salon and grooming, spa and massage, beauty, fitness trainers, laundry and home help.",
        ctaText: "Explore Personal Care",
        href: "/services?sector=personal",
      },
      {
        title: "Education",
        description: "Tutors, coaches, language teachers, test prep, skill training and online courses.",
        ctaText: "Explore Education",
        href: "/services?sector=education",
      },
    ],
  },
  whyChooseUsSection: {
    eyebrow: "WHY CHOOSE US",
    title: "Everything you need to succeed",
    description: "A complete platform built for seamless collaboration between professionals and clients",
  },
  features: [
    {
      id: "projects",
      title: "Project Management",
      description: "Track progress, communicate in real-time, and manage all projects in one centralized dashboard.",
      icon: "briefcase",
    },
    {
      id: "verified",
      title: "Verified Professionals",
      description: "All professionals are verified and vetted to ensure quality work and your peace of mind.",
      icon: "shield",
    },
    {
      id: "matching",
      title: "Expert Matching",
      description: "Get matched with professionals that best fit your project needs and budget requirements.",
      icon: "users",
    },
    {
      id: "local",
      title: "Local & Remote",
      description: "Work with professionals near you or globally - choose what works best for your project.",
      icon: "map",
    },
    {
      id: "discovery",
      title: "Easy Discovery",
      description: "Browse portfolios, reviews, and rates to find the right fit. Make data-driven decisions.",
      icon: "search",
    },
    {
      id: "growth",
      title: "Seamless Growth",
      description: "Build long-term relationships with reliable partners and scale your business together.",
      icon: "arrow",
    },
  ],
  featuredProsSection: {
    eyebrow: "Featured",
    title: "Professionals ready to help",
    ctaText: "Browse all verified professionals",
  },
  ctaDualBanner: {
    client: {
      badge: "For Clients",
      title: "Ready to start your next project?",
      description: "Post your job in minutes, compare verified professional bids, and keep 100% control through escrow protection.",
      primaryCta: "Post a Job Free",
      secondaryCta: "How it works for clients",
    },
    pro: {
      badge: "For Professionals",
      title: "Are you a qualified service specialist?",
      description: "Join Klick-Pro to connect directly with serious residential and commercial clients with zero platform commissions.",
      primaryCta: "Join as a Professional",
      secondaryCta: "Explore pro benefits",
    },
  },
};

export const defaultProfessionalHomeContent: HomeContent = {
  hero: {
    eyebrow: "Grow your professional business",
    title: "Find projects that match your skills",
    description:
      "Browse available projects, bid on work, and build your reputation with satisfied clients worldwide.",
    primaryCta: "Find Projects",
    secondaryCta: "Professional Dashboard",
  },
  heroShowcase: {
    badge: "Verified Professional Workspace",
    title: "Klick-Pro",
    description:
      "Browse verified client requirements, send transparent quotes, and receive 100% milestone escrow payouts directly.",
    metrics: [
      { label: "Escrow", value: "100% Protected" },
      { label: "Platform Cut", value: "Zero Fees" },
      { label: "Clients", value: "Verified KYC" },
    ],
    ctaText: "Find Projects",
  },
  categoriesSection: {
    eyebrow: "OPEN WORK ACROSS EVERY SECTOR",
    title: "Residential, Commercial, Industrial & more",
    description:
      "Discover active client requirements matching your trade, city, and hourly or fixed project rates.",
    items: [
      {
        title: "Residential",
        description: "Electricians, plumbers, cleaners, painters, carpenters, tutors and home care.",
        ctaText: "Find Residential Jobs",
        href: "/professional/my-jobs?tab=find",
      },
      {
        title: "Commercial",
        description: "Office fit-outs, facility upkeep, photography, marketing, accounting and legal help.",
        ctaText: "Find Commercial Jobs",
        href: "/professional/my-jobs?tab=find",
      },
      {
        title: "Industrial",
        description: "Machinery maintenance, industrial wiring, welding, safety audits and logistics.",
        ctaText: "Find Industrial Jobs",
        href: "/professional/my-jobs?tab=find",
      },
      {
        title: "Health Care",
        description: "Nurses, caregivers, physiotherapists, therapists, medical technicians and wellness support.",
        ctaText: "Find Health Care Jobs",
        href: "/professional/my-jobs?tab=find",
      },
      {
        title: "Personal Care & Home Services",
        description: "Salon and grooming, spa and massage, beauty, fitness trainers, laundry and home help.",
        ctaText: "Find Personal Care Jobs",
        href: "/professional/my-jobs?tab=find",
      },
      {
        title: "Education",
        description: "Tutors, coaches, language teachers, test prep, skill training and online courses.",
        ctaText: "Find Education Jobs",
        href: "/professional/my-jobs?tab=find",
      },
    ],
  },
  whyChooseUsSection: {
    eyebrow: "WHY PROFESSIONALS CHOOSE US",
    title: "Everything you need to grow",
    description: "Find quality projects, get paid safely, and build a reputation clients trust.",
  },
  features: [
    {
      id: "grow",
      title: "Grow",
      description: "Find quality projects near you or remotely and grow your independent business.",
      icon: "trend",
    },
    {
      id: "safe",
      title: "Get paid safely",
      description: "Work with funded milestone escrow and receive full net disbursements directly.",
      icon: "shield",
    },
    {
      id: "reputation",
      title: "Build your reputation",
      description: "Deliver great work on clear milestones and earn verified reviews clients trust.",
      icon: "star",
    },
    {
      id: "matching",
      title: "Smart Job Matching",
      description: "See open client requirements tailored to your category, service radius, and availability.",
      icon: "users",
    },
    {
      id: "messages",
      title: "Direct Client Chat",
      description: "Clarify scope, share site photos, and confirm milestones cleanly in one workspace.",
      icon: "message",
    },
    {
      id: "zero-fees",
      title: "Zero Commission Default",
      description: "Keep what you quote with transparent milestone schedules and automated receipts.",
      icon: "wallet",
    },
  ],
  featuredProsSection: {
    eyebrow: "Featured",
    title: "Jobs ready for you",
    ctaText: "Browse all",
  },
  ctaDualBanner: {
    client: {
      badge: "Open Requirements",
      title: "Looking for your next client project?",
      description:
        "Filter live local and remote jobs by budget, skill category, and location, then send a tailored quote in seconds.",
      primaryCta: "Find Projects",
      secondaryCta: "Explore how it works",
    },
    pro: {
      badge: "Professional Workspace",
      title: "Manage active jobs, milestones & earnings",
      description:
        "Track running contracts, request milestone releases, chat with clients, and keep your profile verified.",
      primaryCta: "Professional Dashboard",
      secondaryCta: "Update profile & skills",
    },
  },
};
