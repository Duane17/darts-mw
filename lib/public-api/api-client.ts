// src/lib/public-api/api-client.ts
import { http } from "./http";
import type {
  Announcement,
  Fixture,
  Leader,
  StandingRow,
  Health,
  Result,
  Team,
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

/** Helpers */
function asArray<T>(input: unknown): T[] {
  if (Array.isArray(input)) return input as T[];
  const any = input as any;
  if (Array.isArray(any?.items)) return any.items as T[];
  if (Array.isArray(any?.data)) return any.data as T[];
  return [];
}

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
  const qs = toQS({
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

/** Fixtures */
export type ListFixturesParams = PageParams & {
  season?: string;
  teamId?: string;
  from?: string | Date;
  to?: string | Date;
  status?: "SCHEDULED" | "PLAYED" | "CANCELLED" | "POSTPONED";
};

export async function listFixturesPage(
  params: ListFixturesParams = {}
): Promise<Paginated<Fixture>> {
  const qs = toQS({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
    season: params.season,
    teamId: params.teamId,
    from:
      params.from instanceof Date ? params.from.toISOString() : params.from,
    to: params.to instanceof Date ? params.to.toISOString() : params.to,
    status: params.status,
  });
  const res = await http.get(`/fixtures${qs}`);
  const any = res as any;
  const items = asArray<Fixture>(res);
  const page = Number(any?.page ?? 1);
  const pageSize = Number((any?.pageSize ?? items.length) || 20);
  const total = Number(any?.total ?? items.length);
  const pages = Number(any?.pages ?? Math.max(1, Math.ceil(total / pageSize)));
  return { items, page, pageSize, total, pages };
}

export async function listFixtures(
  params?: Omit<ListFixturesParams, "page" | "pageSize">
): Promise<Fixture[]> {
  const page1 = await listFixturesPage({ ...(params ?? {}), page: 1, pageSize: 20 });
  return page1.items;
}

/** Results */
export type ResultSort =
  | "date_asc"
  | "date_desc"
  | "created_asc"
  | "created_desc";

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
  const qs = toQS({
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
    fixtureId: params.fixtureId,
    season: params.season,
    teamId: params.teamId,
    from:
      params.from instanceof Date ? params.from.toISOString() : params.from,
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

/** Leaders */
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

/** Standings */
export async function getStandings(
  season: string = SEASON
): Promise<StandingRow[]> {
  const qs = `?season=${encodeURIComponent(season)}`;
  return http.get(`/standings${qs}`);
}
