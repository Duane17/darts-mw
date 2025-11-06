// lib/leadership.ts
import { leadershipData } from "@/data/leadership"

export type LeaderRecord = (typeof leadershipData.people)[number]

export function allLeaders(): LeaderRecord[] {
  return leadershipData.people
}

export function getLeaderByIdOrSlug(param: string): LeaderRecord | undefined {
  return leadershipData.people.find(p => p.id === param || p.slug === param)
}

export function leaderMetaFrom(leader: LeaderRecord) {
  const title = `${leader.name} | ${leader.title} | Darts Association of Malawi`
  const description =
    leader.profile ||
    leader.bio ||
    `Profile of ${leader.name}, ${leader.title} at the Darts Association of Malawi.`
  const images = leader.photo ? [leader.photo] : []

  return { title, description, images }
}
