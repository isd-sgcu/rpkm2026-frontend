import { useCallback, useEffect, useState } from "react";
import { appConfig } from "@lib/env";
import events from "@components/walkrally/events/events.json";

// Dev-only floating panel over the backend's /v1/dev endpoints (see backend
// docs/dev-endpoints.md): probe dev mode, create test personas, impersonate
// them without Google SSO, and seed baseline fixtures. Renders nothing unless
// GET /v1/dev responds, so it's inert in production.

const DEV_KEY_STORAGE = "dev-api-key";

type DevUser = {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string | null;
  role: string;
  registrations: {
    project: string;
    staffRole: string | null;
    groupId: string | null;
  }[];
};

type Preset = {
  label: string;
  body: Record<string, unknown>;
};

const PRESETS: Preset[] = [
  {
    label: "+ Freshman",
    body: {
      studentId: "6900000001",
      firstName: "Somchai",
      lastName: "Freshman",
      registrations: [{ project: "rpkm" }],
    },
  },
  {
    label: "+ RPKM staff",
    body: { studentId: "6500000002", staffRoles: ["rpkm"] },
  },
  {
    label: "+ Walkrally staff",
    body: { studentId: "6500000003", staffRoles: ["walkrally"] },
  },
];

// Seed the walk-rally activities with the codes this frontend actually sends
// (events.json ids), so staff scans don't hit INVALID_ACTIVITY.
const SEED_ACTIVITIES = [
  ...events.workshop.map((e) => ({ code: e.id, kind: "workshop" })),
  ...events.walkingTour.map((e) => ({ code: e.id, kind: "museum" })),
  ...events.minigame.map((e) => ({ code: e.id, kind: "minigame" })),
];

async function devFetch<T>(
  path: string,
  key: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const res = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: init?.method ?? "GET",
    credentials: "include",
    headers: {
      "x-dev-key": key,
      ...(init?.body !== undefined
        ? { "content-type": "application/json" }
        : {}),
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

// Compile-time gate: in production builds this renders nothing and the
// runtime probe below never fires.
export function DevBanner() {
  if (!import.meta.env.DEV) return null;
  return <DevBannerInner />;
}

function DevBannerInner() {
  const [devMode, setDevMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [devKey, setDevKey] = useState("");
  const [users, setUsers] = useState<DevUser[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [manualId, setManualId] = useState("");

  // Probe dev mode once; anything but a 200 means "render nothing".
  useEffect(() => {
    let cancelled = false;
    fetch(`${appConfig.apiBaseUrl}/v1/dev`)
      .then((res) => {
        if (cancelled || !res.ok) return;
        setDevKey(localStorage.getItem(DEV_KEY_STORAGE) ?? "");
        setDevMode(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async (key: string) => {
    try {
      const res = await devFetch<{ data: { users: DevUser[] } }>(
        "/v1/dev/users",
        key,
      );
      setUsers(res.data.users);
      setMessage("");
    } catch (err) {
      setMessage(`load users failed: ${(err as Error).message}`);
    }
    try {
      const res = await fetch(`${appConfig.apiBaseUrl}/v1/auth/get-session`, {
        credentials: "include",
      });
      const session = res.ok ? await res.json() : null;
      setCurrentEmail(session?.user?.email ?? null);
    } catch {
      setCurrentEmail(null);
    }
  }, []);

  if (!devMode) return null;

  function openPanel() {
    setOpen(true);
    if (devKey) void refresh(devKey);
  }

  function saveKey(value: string) {
    setDevKey(value);
    localStorage.setItem(DEV_KEY_STORAGE, value);
  }

  async function impersonate(studentId: string) {
    try {
      await devFetch("/v1/dev/impersonate", devKey, {
        method: "POST",
        body: { studentId },
      });
      location.reload();
    } catch (err) {
      setMessage(`impersonate failed: ${(err as Error).message}`);
    }
  }

  async function createPersona(preset: Preset) {
    try {
      await devFetch("/v1/dev/admin/users", devKey, {
        method: "POST",
        body: preset.body,
      });
      setMessage(`created ${preset.body.studentId as string}`);
      await refresh(devKey);
    } catch (err) {
      setMessage(`create failed: ${(err as Error).message}`);
    }
  }

  async function deletePersona(studentId: string) {
    try {
      await devFetch(`/v1/dev/admin/users/${studentId}`, devKey, {
        method: "DELETE",
      });
      setMessage(`deleted ${studentId}`);
      await refresh(devKey);
    } catch (err) {
      setMessage(`delete failed: ${(err as Error).message}`);
    }
  }

  async function seed() {
    try {
      await devFetch("/v1/dev/seed", devKey, {
        method: "POST",
        body: { activities: SEED_ACTIVITIES },
      });
      setMessage("seeded (houses + walk-rally activities + checkpoints)");
    } catch (err) {
      setMessage(`seed failed: ${(err as Error).message}`);
    }
  }

  const roleBadge = (user: DevUser) => {
    const staffRoles = user.registrations
      .map((reg) => reg.staffRole)
      .filter(Boolean);
    if (staffRoles.length > 0) return `staff: ${staffRoles.join(", ")}`;
    const projects = user.registrations.map((reg) => reg.project);
    return projects.length > 0 ? projects.join(", ") : "no registration";
  };

  return (
    <div className="fixed bottom-2 right-2 z-9999 font-mono text-xs">
      {!open ? (
        <button
          type="button"
          onClick={openPanel}
          className="rounded bg-amber-400 px-2 py-1 font-bold text-black shadow"
        >
          DEV
        </button>
      ) : (
        <div className="flex w-80 max-w-[90vw] flex-col gap-2 rounded border border-amber-500 bg-black/90 p-3 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400">DEV MODE</span>
            <button type="button" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <label className="flex flex-col gap-1">
            <span>x-dev-key</span>
            <input
              type="text"
              value={devKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder="DEV_API_KEY from backend .env"
              className="rounded border border-white/30 bg-transparent px-1 py-0.5"
            />
          </label>

          <div>
            current:{" "}
            <span className="text-amber-300">{currentEmail ?? "-"}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {/* Each preset is one fixed persona (fixed studentId) — creating it
                again just updates the same user, so it flips to ✓ once it
                exists in the list below. */}
            {PRESETS.map((preset) => {
              const presetId = preset.body.studentId as string;
              const exists = users.some((user) => user.studentId === presetId);
              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={exists}
                  title={presetId}
                  onClick={() => createPersona(preset)}
                  className={
                    exists
                      ? "rounded bg-white/5 px-1.5 py-0.5 text-white/50"
                      : "rounded bg-white/15 px-1.5 py-0.5 hover:bg-white/30"
                  }
                >
                  {exists
                    ? `✓ ${preset.label.replace(/^\+ /, "")}`
                    : preset.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={seed}
              className="rounded bg-white/15 px-1.5 py-0.5 hover:bg-white/30"
            >
              Seed DB
            </button>
            <button
              type="button"
              onClick={() => refresh(devKey)}
              className="rounded bg-white/15 px-1.5 py-0.5 hover:bg-white/30"
            >
              Refresh
            </button>
          </div>

          <div className="flex gap-1">
            <input
              value={manualId}
              onChange={(e) => setManualId(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              placeholder="impersonate any 10-digit id"
              className="flex-1 rounded border border-white/30 bg-transparent px-1 py-0.5"
            />
            <button
              type="button"
              onClick={() => manualId.length === 10 && impersonate(manualId)}
              className="rounded bg-amber-400 px-1.5 py-0.5 font-bold text-black"
            >
              Go
            </button>
          </div>

          <div className="flex max-h-52 flex-col gap-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.studentId}
                className="flex items-center gap-1 rounded bg-white/10 px-1.5 py-1"
              >
                <button
                  type="button"
                  onClick={() => impersonate(user.studentId)}
                  className="flex flex-1 flex-col items-start text-left hover:text-amber-300"
                  title="Impersonate"
                >
                  <span>
                    {user.studentId} — {user.firstName} {user.lastName}
                  </span>
                  <span className="text-white/60">{roleBadge(user)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => deletePersona(user.studentId)}
                  className="px-1 text-white/50 hover:text-red-400"
                  title="Delete persona"
                >
                  🗑
                </button>
              </div>
            ))}
            {users.length === 0 && (
              <span className="text-white/50">
                no personas — set the key and hit Refresh
              </span>
            )}
          </div>

          {message && <div className="text-amber-300">{message}</div>}
        </div>
      )}
    </div>
  );
}
