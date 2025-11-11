// src/lib/public-api/api-types.ts

export type TeamRef = {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string | null;
};

export type Team = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  city?: string | null;
  homeVenue?: string | null;
  homeCity?: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Priority = "gold" | "success" | "error";

export type Announcement = {
  id: string;
  title: string;
  body?: string;
  createdAt?: string;
  priority?: Priority;
};

export type BackendFixtureStatus =
  | "SCHEDULED"
  | "PLAYED"
  | "CANCELLED"
  | "POSTPONED";

export type UiFixtureStatus = "upcoming" | "completed";

/** Result reference embedded in fixture payloads */
export type ResultRef = {
  id: string;
  fixtureId: string;
  homeScore: number;
  awayScore: number;
  notes: string | null;
  createdAt: string;
};

export type Fixture = {
  id: string;
  season: string;
  week: number;
  title: string;
  date: string;
  endDate: string | null;
  kickoff?: string;
  type: string;
  venue: string | null;
  city: string | null;
  description: string | null;
  venueTBA: boolean;
  kickoffTBA: boolean;
  status: BackendFixtureStatus;
  isBye: boolean;
  homeTeamId: string;
  awayTeamId: string | null;
  homeTeam: TeamRef | null;
  awayTeam: TeamRef | null;
  result: ResultRef | null;
  createdAt: string;
  updatedAt: string;
  homeScore?: number | null;
  awayScore?: number | null;
};

export function toUiFixtureStatus(f: Fixture): UiFixtureStatus {
  if (f.status === "PLAYED") return "completed";
  if (f.status === "SCHEDULED") return "upcoming";
  if (f.status === "CANCELLED" || f.status === "POSTPONED") return "upcoming";

  const t = Date.parse(f.kickoff ?? f.date);
  const hasScores =
    !!f.result ||
    typeof f.homeScore === "number" ||
    typeof f.awayScore === "number";
  if (!Number.isNaN(t) && t < Date.now() && hasScores) return "completed";
  return "upcoming";
}

export type Leader = {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo?: string | null;
  tagline?: string | null;
  profile?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  responsibilities?: string[];
  achievements?: string[];
  education?: string[];
  leadershipSkills?: string[];
  professionalBackground?: string | null;
  sportingJourney?: string | null;
  term?: string | null;
  socials?: unknown;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type StandingRow = {
  rank: number;
  teamId: string;
  teamName: string;
  teamSlug: string;
  teamLogoUrl: string | null;
  season: string;

  played: number;
  won: number;
  drawn: number;
  lost: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  group: string | null;
  last5: string | null;
  last5Array: string[];
};

export type Health = { status: "ok" };

export type Result = {
  id: string;
  fixtureId: string;
  homeScore: number;
  awayScore: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  fixture: {
    id: string;
    season: string;
    date: string;
    week: number;
    title: string;
    homeTeam: TeamRef | null;
    awayTeam: TeamRef | null;
  };
};

export type ResultWithFixture = Result;

export type ProgrammeItem = {
  id: string;
  title: string;
  description: string;
  cta: string;
  bgImage: string;
};

export type HomeContent = {
  heroBg: string;
  ctaBg: string;
  programmes: ProgrammeItem[];
};

export type AboutContent = {
  heroBg: string;
  missionVision: {
    sectionBg: string;
    missionBg: string;
    visionBg: string;
    motto: string;
    mission: string;
    vision: string;
  };
  coreValues: {
    sectionBg: string;
    items: Array<{
      title: string;
      desc: string;
      bgImage: string;
    }>;
  };
};