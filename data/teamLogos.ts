// src/data/teamLogos.ts
// Maps canonical team names used in fixtures to their logo filenames in /public/teams

export const TEAM_LOGOS: Record<string, string> = {
  // Canonical name: filename in /public/teams
  "Airbourne": "/teams/airbourne.png",                    // file is spelled "airbourne.png"
  "Bunda Arrows": "/teams/bunda-arrows.png",
  "C2K Crocs": "/teams/c2k-crocks.png",                  // file is "c2k-crocks.png"
  "CIVO Darts": "/teams/civo-darts-club.png",
  "Engineers Battalion": "/teams/engineers-batallion.png", // file is "engineers-batallion.png"
  "Green Shelter": "/teams/green-shelter.png",
  "Hazards": "/teams/hazard.png",
  "KB Snippers": "/teams/kb.png",
  "Lilongwe Airbase": "/teams/lilongwe-airbase.png",
  "LUANAR Staff": "/teams/luanar-staff.png",
  "RBM": "/teams/reserve-bank-arrows.png",               // using Reserve Bank logo you provided
  "SMEDI": "/teams/smedi.png",
  "VOX Populi Lions": "/teams/vox-populi-lions.png",
}

// Optional safe getter that tolerates spacing/case differences
export function getTeamLogo(team: string | undefined): string | null {
  if (!team) return null
  const exact = TEAM_LOGOS[team]
  if (exact) return exact

  // Loose match fallback
  const key = team.trim().toLowerCase()
  const found = Object.entries(TEAM_LOGOS).find(
    ([name]) => name.toLowerCase() === key
  )
  return found ? found[1] : null
}
