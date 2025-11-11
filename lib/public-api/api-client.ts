// src/lib/public-api/api-client.ts
import { http, HttpError } from "./http";
import type {
  Announcement,
  Fixture,
  Leader,
  StandingRow,
  Health,
  Result,
  HomeContent,
  AboutContent
} from "./api-types";

/** Shared paging contracts */
export type PageParams = { page?: number; pageSize?: number };
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
};

export type LeagueCode = "SRDL" | "CRDL";
export type LeagueFilter = "ALL" | LeagueCode;

/** Helpers */
function asArray<T>(input: unknown): T[] {
  if (Array.isArray(input)) return input as T[];
  const any = input as any;
  if (Array.isArray(any?.items)) return any.items as T[];
  if (Array.isArray(any?.data)) return any.data as T[];
  return [];
}

function qsFrom(obj: Record<string, string | number | boolean | undefined | null>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

/** Default season for the public site */
export const SEASON = process.env.NEXT_PUBLIC_SEASON ?? "2025";

/** Health */
export async function getHealth(): Promise<Health> {
  return http.get("/healthz");
}

/** Announcements */
export async function listAnnouncementsPage(
  params: PageParams = {}
): Promise<Paginated<Announcement>> {
  const qs = qsFrom({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  });
  const res = await http.get(`/announcements${qs}`);
  const any = res as any;
  const items = asArray<Announcement>(res);
  const page = Number(any?.page ?? 1);
  const pageSize = Number((any?.pageSize ?? items.length) || 20);
  const total = Number(any?.total ?? items.length);
  const pages = Number(any?.pages ?? Math.max(1, Math.ceil(total / pageSize)));
  return { items, page, pageSize, total, pages };
}

export async function listAnnouncements(): Promise<Announcement[]> {
  const page1 = await listAnnouncementsPage({ page: 1, pageSize: 20 });
  return page1.items;
}

export async function getAnnouncement(id: string): Promise<Announcement> {
  return http.get(`/announcements/${encodeURIComponent(id)}`);
}

/** Fixtures - website compatible */
export async function listFixturesPageCompat(params: {
  seasonYear?: number;
  league?: LeagueFilter; // accept ALL
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  type?: "SRDL_LEAGUE" | "SMK_TRADING_CRDL";
  includeResults?: boolean;
}): Promise<Paginated<Fixture>> {
  const isAll = params.league === "ALL";

  
  const q1 = qsFrom({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
    seasonYear: params.seasonYear,
    league: isAll ? undefined : params.league,
    from: params.from,
    to: params.to,
    type: params.type,
    includeResults: params.includeResults ? "true" : undefined,
  });

  try {
    const res = await http.get(`/fixtures${q1}`);
    const any = res as any;
    const items: Fixture[] = Array.isArray(res)
      ? (res as Fixture[])
      : Array.isArray(any?.items)
      ? (any.items as Fixture[])
      : [];
    const page = Number(any?.page ?? 1);
    const pageSize = Number((any?.pageSize ?? any?.limit ?? items.length) || 20);
    const total = Number(any?.total ?? items.length);
    const pages = Number(any?.pages ?? Math.max(1, Math.ceil(total / pageSize)));
    return { items, page, pageSize, total, pages };
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 0;
    // If the server is older, fall back
    if (status !== 400 && status !== 404 && status !== 422) throw err;
  }

  // 2) Legacy fallback
  // When ALL: send only the year
  // When single league: send a legacy "season" label like "2025 SRDL"
  const seasonLabel =
    params.seasonYear && !isAll && params.league
      ? `${params.seasonYear} ${params.league}`
      : params.seasonYear
      ? String(params.seasonYear)
      : "";

  const q2 = qsFrom({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
    season: seasonLabel || undefined,
    from: params.from,
    to: params.to,
    // do not send includeResults here since the older server may not understand it
  });

  const res2 = await http.get(`/fixtures${q2}`);
  const any2 = res2 as any;
  const items2: Fixture[] = Array.isArray(res2)
    ? (res2 as Fixture[])
    : Array.isArray(any2?.items)
    ? (any2.items as Fixture[])
    : [];
  const page2 = Number(any2?.page ?? 1);
  const pageSize2 = Number((any2?.pageSize ?? any2?.limit ?? items2.length) || 20);
  const total2 = Number(any2?.total ?? items2.length);
  const pages2 = Number(any2?.pages ?? Math.max(1, Math.ceil(total2 / pageSize2)));
  return { items: items2, page: page2, pageSize: pageSize2, total: total2, pages: pages2 };
}



export type ResultSort = "date_asc" | "date_desc" | "created_asc" | "created_desc";
export type ListResultsParams = PageParams & {
  fixtureId?: string;
  season?: string;
  teamId?: string;
  from?: string | Date;
  to?: string | Date;
  sort?: ResultSort;
};

export async function listResultsPage(
  params: ListResultsParams = {}
): Promise<Paginated<Result>> {
  const qs = qsFrom({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
    fixtureId: params.fixtureId,
    season: params.season,
    teamId: params.teamId,
    from: params.from instanceof Date ? params.from.toISOString() : params.from,
    to: params.to instanceof Date ? params.to.toISOString() : params.to,
    sort: params.sort ?? "date_desc",
  });
  const res = await http.get(`/results${qs}`);
  const any = res as any;
  const items = asArray<Result>(res);
  const page = Number(any?.page ?? 1);
  const pageSize = Number((any?.pageSize ?? items.length) || 20);
  const total = Number(any?.total ?? items.length);
  const pages = Number(any?.pages ?? Math.max(1, Math.ceil(total / pageSize)));
  return { items, page, pageSize, total, pages };
}

export async function listResults(
  params?: Omit<ListResultsParams, "page" | "pageSize">
): Promise<Result[]> {
  const page1 = await listResultsPage({ ...(params ?? {}), page: 1, pageSize: 20 });
  return page1.items;
}

export async function getResult(id: string): Promise<Result> {
  return http.get(`/results/${encodeURIComponent(id)}`);
}

export async function getStandings(params: {
  seasonYear: number | string;
  league: LeagueCode;
}): Promise<StandingRow[]> {
  const qs = `?seasonYear=${encodeURIComponent(String(params.seasonYear))}&league=${encodeURIComponent(params.league)}`;
  return http.get(`/standings${qs}`);
}

export async function getStandingsCompat(params: {
  seasonYear: number | string;
  league: LeagueCode;
}): Promise<StandingRow[]> {
  const tryOnce = async (qs: string) => {
    const res = await http.get(`/standings?${qs}`);
    return asArray<StandingRow>(res);
  };

  const q1 = new URLSearchParams({
    seasonYear: String(params.seasonYear),
    league: params.league,
  });

  try {
    return await tryOnce(q1.toString());
  } catch (err) {
    const httpStatus = err instanceof HttpError ? err.status : 0;
    if (httpStatus && httpStatus !== 400 && httpStatus !== 404 && httpStatus !== 422) throw err;
  }

  const seasonLabel = `${params.seasonYear} ${params.league}`;
  const q2 = new URLSearchParams({ season: seasonLabel });
  try {
    return await tryOnce(q2.toString());
  } catch (err) {
    const httpStatus = err instanceof HttpError ? err.status : 0;
    if (httpStatus && httpStatus !== 400 && httpStatus !== 404 && httpStatus !== 422) throw err;
  }

  const q3 = new URLSearchParams({ season: String(params.seasonYear) });
  return tryOnce(q3.toString());
}

export type ListLeadersParams = {
  q?: string;
  activeOnly?: boolean;
  limit?: number;
  offset?: number;
  sort?:
    | "name_asc"
    | "name_desc"
    | "title_asc"
    | "title_desc"
    | "newest"
    | "oldest";
};

function toQS(params?: Record<string, string | number | boolean | undefined>) {
  const q = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) q.set(k, String(v));
    }
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function listLeadersPage(
  params: ListLeadersParams = {}
): Promise<{
  items: Leader[];
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}> {
  const qs = toQS({
    q: params.q,
    activeOnly: params.activeOnly,
    limit: params.limit ?? 20,
    offset: params.offset ?? 0,
    sort: params.sort ?? "name_asc",
  });
  const res = await http.get(`/leaders${qs}`);
  const any = res as any;
  const items = asArray<Leader>(res);
  const limit = Number(any?.limit ?? items.length ?? 20);
  const offset = Number(any?.offset ?? 0);
  const total = Number(any?.total ?? items.length ?? 0);
  const hasMore = Boolean(any?.hasMore ?? offset + items.length < total);
  return { items, limit, offset, total, hasMore };
}

export async function listLeaders(
  params: Omit<ListLeadersParams, "limit" | "offset"> = {}
): Promise<Leader[]> {
  const page1 = await listLeadersPage({ ...params, limit: 20, offset: 0 });
  return page1.items;
}

export async function getLeaderBySlug(slug: string): Promise<Leader> {
  return http.get(`/leaders/${encodeURIComponent(slug)}`);
}


// tiny helper so both functions stay identical in behavior
function invalidResponse(resource: string): never {
  throw new HttpError({ status: 502, message: `Invalid server response for ${resource}` });
}

/** Runtime guards */
function isHomeContent(x: any): x is HomeContent {
  return !!x && typeof x === "object"
    && x.hero && typeof x.hero === "object"
    && typeof x.hero.title === "string";
}

function isAboutContent(x: any): x is AboutContent {
  return !!x && typeof x === "object"
    && typeof x.title === "string";
}

export async function getHomeContent(): Promise<HomeContent> {
  return http.get("/content/home");
}
export async function getAboutContent(): Promise<AboutContent> {
  return http.get("/content/about");
}