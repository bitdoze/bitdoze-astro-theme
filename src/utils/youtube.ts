// Canonical parser for YouTube video references used by YouTubeEmbed.astro and
// MDX authors. Accepts every common share form plus bare 11-character video
// IDs:
//   - https://www.youtube.com/watch?v=<id>[&t=...|&start=...]
//   - https://youtu.be/<id>[?t=...|?start=...]
//   - https://www.youtube.com/embed/<id>[?start=...]
//   - https://www.youtube.com/shorts/<id> and /live/<id>
//   - https://www.youtube-nocookie.com/embed/<id>
//   - m.youtube.com hosts, and the /share?v= query form
// It returns the video id together with an optional integer start offset in
// seconds (parsed from `start` or `t`; when both appear `start` wins, so the
// output always carries exactly one canonical start). Returns null for
// anything that is not a YouTube video reference, including a present but
// unparseable start/t offset.

export type ParsedYouTubeVideo = {
  id: string;
  start?: number;
};

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const PATH_ID_FORMS: Record<string, true> = { embed: true, shorts: true, live: true };
const YT_HOSTS: Record<string, true> = {
  "youtube.com": true,
  "youtu.be": true,
  "youtube-nocookie.com": true,
};

// Accepts plain seconds ("90", "90s") and YouTube's compact duration form
// ("1m30s", "2h5m"). A parsed 0 carries no information, so it is dropped and
// reported as undefined.
function parseStartSeconds(raw: string): number | undefined {
  const match = /^(?:(\d+)h)?(?:(\d+)m)?(\d+)?s?$/.exec(raw);
  if (!match || match[0] === "") return undefined;
  const total = Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
  return total > 0 ? total : undefined;
}

export function parseYouTubeId(input: string): ParsedYouTubeVideo | null {
  const trimmed = input.trim();

  // Bare video id, without any URL wrapper.
  if (VIDEO_ID_PATTERN.test(trimmed)) {
    return { id: trimmed };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase().replace(/^(www|m)\./, "");
  if (!YT_HOSTS[host]) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;
  if (host === "youtu.be") {
    id = segments[0];
  } else if (segments.length > 0 && PATH_ID_FORMS[segments[0]]) {
    id = segments[1];
  } else {
    id = url.searchParams.get("v") ?? undefined;
  }
  if (!id || !VIDEO_ID_PATTERN.test(id)) return null;

  // `start` is the embed form, `t` the watch form; when both appear the
  // explicit `start` wins, so the output always carries one canonical start.
  const startRaw = url.searchParams.get("start") ?? url.searchParams.get("t");
  if (startRaw !== null) {
    const start = parseStartSeconds(startRaw);
    if (start === undefined) return null;
    return { id, start };
  }
  return { id };
}
