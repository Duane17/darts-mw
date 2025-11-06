// DAM About Page Data
// Stock photo suggestions in comments for each section

export const aboutHero = {
  overline: "About DAM",
  title: "Darts Association of Malawi",
  sub: "Uniting the nation through precision, passion, and excellence in darts. Building champions, fostering community, and promoting the sport across all regions of Malawi.",
  bgImage: "/images/about/ABOUT_hero.jpg",
  ctas: [
    { text: "Our Mission", href: "#mission", variant: "primary" as const },
    { text: "Leadership Team", href: "#leadership", variant: "secondary" as const },
  ],
  chips: ["Est. 2010", "28 Districts", "500+ Members", "National Champions"],
}

export const missionVision = {
  vision:
    "To make Malawi a leading force in international darts by driving nationwide growth, participation and excellence in the sport.",
  mission:
    "To develop, promote and regulate the sport of darts across Malawi by nurturing talent, increasing accessibility, fostering competitive excellence, and building a strong foundation that elevates the nation on the global darts platform.",
  motto: "One Board, One People!",
  images: {
    vision: "/images/about/ABOUT_9.jpg", 
    mission: "/images/about/ABOUT_1.jpg",
  },
}

export const values = [
  {
    title: "Integrity",
    desc: "Upholding honesty, fairness, and ethical conduct in all our activities and competitions.",
    bgImage: "/images/about/ABOUT_10.jpg",
  },
  {
    title: "Dignity",
    desc: "Treating all participants with respect, regardless of skill level, background, or experience.",
    bgImage: "/images/about/ABOUT_3.jpg", 
  },
  {
    title: "Teamwork",
    desc: "Fostering collaboration and unity among players, officials, and stakeholders.",
    bgImage: "/images/about/ABOUT_4.jpg",
  },
  {
    title: "Excellence",
    desc: "Striving for the highest standards in performance, organization, and development.",
    bgImage: "/images/about/ABOUT_excellence.jpg", 
  },
  {
    title: "Sportsmanship",
    desc: "Promoting fair play, respect for opponents, and gracious conduct in victory and defeat.",
    bgImage: "/images/about/ABOUT_11.jpg", 
  },
  {
    title: "Innovation",
    desc: "Embracing new ideas, technologies, and methods to advance the sport and engage youth.",
    bgImage: "/images/about/ABOUT_6.jpg", 
  },
]


export const strategicGoals = [
  {
    title: "Promotion and Awareness",
    desc: "Increase national awareness and appreciation of darts as a professional and recreational sport.",
    iconKey: "megaphone" as const,
  },
  {
    title: "Inclusive Participation",
    desc: "Expand participation across all regions, targeting schools, youth clubs, and community centres, regardless of race, religion, gender, or economic status.",
    iconKey: "users" as const,
  },
  {
    title: "Talent Development and Capacity Building",
    desc: "Identify and nurture young talent through academies, coaching clinics, and structured mentorship.",
    iconKey: "sparkles" as const,
  },
  {
    title: "Competitions and Events",
    desc: "Organize regular local leagues, national tournaments, and regional championships to foster competitive excellence.",
    iconKey: "trophy" as const,
  },
  {
    title: "International Representation",
    desc: "Prepare and field strong national teams for international events, ensuring Malawi is represented with pride and skill.",
    iconKey: "globe" as const,
  },
  {
    title: "Training and Education",
    desc: "Provide courses, seminars, and certification programs for players, coaches, and officials to improve standards and professionalism.",
    iconKey: "cap" as const,
  },
  {
    title: "Good Governance and Compliance",
    desc: "Ensure transparency, accountability, and alignment with national and international sporting regulations.",
    iconKey: "shield" as const,
  },
  {
    title: "Partnerships and Resource Mobilization",
    desc: "Build partnerships with local and international stakeholders to mobilize resources and grow the sport sustainably.",
    iconKey: "handshake" as const,
  },
] as const
