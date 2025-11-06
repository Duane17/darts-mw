// data/leadership.ts
import type { Leader } from "@/components/sections/leadership/LeadershipGrid"

export type SocialLink = {
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "website"
  url: string
}

export type LeaderExtended = Leader & {
  slug: string
  tagline?: string
  email?: string
  phone?: string
  location?: string
  socials?: SocialLink[]
  bio?: string
  responsibilities?: string[]
  achievements?: string[]
  term?: string

  // New structured fields
  education?: string[]
  professionalBackground?: string
  sportingJourney?: string
  leadershipSkills?: string[]
}

export const leadershipData: {
  heading: { overline: string; title: string; subtitle: string }
  people: LeaderExtended[]
} = {
  heading: {
    overline: "LEADERSHIP",
    title: "Our Leadership Team",
    subtitle:
      "Guiding the vision and growth of darts across Malawi through service, integrity, and excellence.",
  },
  people: [
    {
      id: "1",
      slug: "peterkins-rodney-kondwani-kayira",
      name: "Peterkins Rodney Kondwani Kayira",
      title: "President",
      profile:
        "Seasoned sports leader, lifelong ambassador for Malawian darts. Former national team player with a long career in football.",
      tagline: "A seasoned sports leader and lifelong ambassador for Malawian darts.",
      photo: "/images/leadership/peterkins.jpg",
      bio:
        "Peterkins Kayira has been an active darts player since 1985 and has served two terms as General Secretary of the Darts Association of Malawi. He has represented Malawi on the national darts team and also enjoyed an extensive football career spanning more than two decades across Africa.",
      responsibilities: [
        "Strategic leadership and governance",
        "National representation and partnerships",
        "Oversight of committees",
      ],
      achievements: [
        "Multiple years as national team player",
        "Two terms as DAM General Secretary",
      ],
      term: "2025 to 2027",
      education: [
        "Bachelor of Business Administration (Marketing)",
      ],
      professionalBackground:
        "Respected sportsman and administrator with years of service in darts leadership and football coaching.",
      sportingJourney:
        "Active darts player since 1985 and former national team footballer with international appearances across Africa.",
      leadershipSkills: [
        "Negotiation",
        "Sales and sponsorship",
        "Mentorship and coaching",
      ],
    },
    {
      id: "2",
      slug: "memory-manjawira",
      name: "Memory Manjawira",
      title: "Vice President",
      profile:
        "Nursing Officer and advocate for women in sport. Drives inclusion, focus, and discipline across programs.",
      tagline: "Championing focus, discipline, and inclusion in darts.",
      photo: "/images/leadership/memory.jpg",
      bio:
        "Memory Manjawira is a Nursing Officer with the Ministry of Health and an inspiring advocate for women in sport. Drawn to darts for its precision and community spirit, she promotes focus and discipline while empowering others, especially women, to aim high and stay the course.",
      responsibilities: [
        "Competition calendar and programs",
        "Coach and referee development",
        "Regional inclusion and participation",
      ],
      achievements: [
        "Expanded opportunities for women in darts",
        "Program initiatives focused on discipline and access",
      ],
      term: "2025 to 2027",
      education: [
        "Bachelor of Science in Nursing and Midwifery",
        "Master of Science in Management Studies (Health Systems Management)",
      ],
      professionalBackground:
        "Nursing Officer with the Ministry of Health and advocate for women in sport.",
      sportingJourney:
        "Promotes the sport’s values of focus and discipline, empowering women to participate and excel.",
    },
    {
      id: "3",
      slug: "charles-mughogho",
      name: "Charles Mughogho",
      title: "Treasurer General",
      profile:
        "District Project Accountant for a World Bank funded project. Precision on the dartboard and in finance.",
      tagline: "Balancing precision on the dartboard and in finance.",
      photo: "/images/leadership/charles-m.jpg",
      bio:
        "Charles Mughogho is a District Project Accountant for a World Bank funded government project and previously served in the Ministry of Local Government as Acting Director of Finance. He began darts in 2005, has represented Malawi in Zone 6 tournaments, and earned bronze and silver medals.",
      achievements: [
        "Zone 6 medals in international play",
        "Key roles in public finance leadership",
      ],
      responsibilities: [
        "Financial stewardship and reporting",
        "Budgeting for events and programs",
        "Transparency and controls",
      ],
      term: "2025 to 2027",
      education: [
        "Bachelor’s Degree in Accounting",
        "Master of Business Administration (Finance)",
      ],
      professionalBackground:
        "District Project Accountant for a World Bank funded government project and former Acting Director of Finance at the Ministry of Local Government.",
      sportingJourney:
        "Started with Mzimba Darts Team in 2005, represented Malawi in multiple Zone 6 tournaments, and played for Blantyre Sports Club, Moth Club, Engineers Battalion, and KB Snipers.",
    },
    {
      id: "4",
      slug: "otiyela-mtema",
      name: "Otiyela Mtema",
      title: "Technical & Communications Director",
      profile:
        "Creative strategist and project manager. Drives visibility, standards, and digital engagement.",
      tagline: "Driving darts visibility through strategy and creativity.",
      photo: "/images/leadership/otiyela.jpg",
      bio:
        "Otiyela Mtema is a creative strategist and project management expert in communications and creative methodologies. A player for C2K Crocs, he represented Malawi at U18 in 2016 and was a reserve for the Men’s National Team in 2024. He leads digital presence, community engagement, and strategic partnerships.",
      responsibilities: [
        "Technical standards and officiating support",
        "Digital strategy and communications",
        "Community engagement and partnerships",
      ],
      achievements: [
        "U18 national representation in 2016",
        "National team reserve in 2024",
      ],
      term: "2025 to 2027",
      education: [
        "Bachelor’s Degree in Social Science",
      ],
      professionalBackground:
        "Creative strategist and project manager skilled in communications and creative methodologies.",
      sportingJourney:
        "C2K Crocs player in CRDL, represented Malawi at Under-18 in 2016, and selected as reserve for the Men’s National Team in 2024.",
    },
    {
      id: "5",
      slug: "amon-chinyophiro",
      name: "Amon Chinyophiro",
      title: "Regional Chairperson, Central Region Darts League",
      profile:
        "Consultant with agriculture and economics background. Rising darts leader with strong competitive record.",
      tagline: "A rising darts leader driven by precision and passion for sport.",
      photo: "/images/leadership/amon.jpg",
      bio:
        "Amon Chinyophiro is a freelance consultant with a background in agriculture and economics. A former national volleyball player, he started darts in 2022 with Hazards, finished 4th of 207 CRDL players in his second season, qualified for national trials, and was then elected CRDL Chairperson.",
      responsibilities: [
        "Regional competitions and logistics",
        "Development of district programs",
        "Stakeholder coordination in CRDL",
      ],
      achievements: [
        "Top 4 of 207 CRDL players in season two",
        "Elected CRDL Chairperson in season three",
      ],
      term: "2025 to 2027",
      education: [
        "Bachelor of Science in Agricultural Extension",
        "Master of Science in Agricultural and Applied Economics (Makerere University)",
      ],
      professionalBackground:
        "Freelance consultant with a strong background in agriculture and economics; previously Sports Director at Bunda College.",
      sportingJourney:
        "Began darts in 2022 with Hazards Darts Team. Rapid progress led to national team trials and later election as CRDL Chairperson.",
    },
    {
      id: "6",
      slug: "charles-katola",
      name: "Charles Katola",
      title: "Tournament Director",
      profile:
        "Veteran darts professional and respected sports administrator with decades of impact.",
      tagline:
        "A veteran darts professional and respected sports administrator with decades of experience.",
      photo: "/images/leadership/charles-k.jpg",
      bio:
        "Charles Katola has served as Secretary General and Tournament Director of DAM, chaired the Blantyre Urban District Sports Committee, and served as Vice President of Zone 6 Darts. A former national team player, he set records such as 25 no.180s in a season and came close to a 501 world record.",
      responsibilities: [
        "Tournament design and execution",
        "Standards, scheduling, and officiating",
        "Records, rankings, and fairness",
      ],
      achievements: [
        "Malawi Broadcasting Corporation Player of the Year",
        "25 no.180s in a single season",
      ],
      term: "2025 to 2027",
      professionalBackground:
        "Held multiple leadership positions in darts and sports administration including DAM Secretary General, DAM Tournament Director, Chair of Blantyre Urban District Sports Committee, and Vice President of Zone 6 Darts.",
      sportingJourney:
        "Former National Team darts player with notable records including 25 no.180s in a season and near 501 world record performance.",
    },
  ],
}
