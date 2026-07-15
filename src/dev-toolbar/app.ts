import { defineToolbarApp } from "astro/toolbar";
import events from "../components/walkrally/events/events.json";

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL || "http://localhost:3000";

// Seed the walk-rally activities with the codes this frontend actually sends
// (events.json ids) instead of the backend's placeholder defaults, so staff
// attendance scans don't hit INVALID_ACTIVITY.
const SEED_ACTIVITIES = [
  ...events.workshop.map((entry) => ({ code: entry.id, kind: "workshop" })),
  ...events.walkingTour.map((entry) => ({ code: entry.id, kind: "museum" })),
  ...events.minigame.map((entry) => ({ code: entry.id, kind: "minigame" })),
];

type DevRegistration = {
  project: string;
  staffRole: string | null;
  groupId: string | null;
};

type DevUser = {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string | null;
  role: string;
  registrations: DevRegistration[];
};

type StaffRole = "firstdate" | "rpkm" | "walkrally" | "freshmennight";

type CreateUserBody = {
  studentId: string;
  firstName?: string;
  lastName?: string;
  role?: "student" | "staff";
  staffRoles?: StaffRole[];
  registrations?: { project: "firstdate" | "rpkm"; withGroup?: boolean }[];
};

class DevApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "DevApiError";
  }
}

async function devFetch<T>(
  path: string,
  {
    method = "GET",
    key,
    body,
  }: { method?: string; key?: string; body?: unknown } = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}/v1/dev${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(key ? { "x-dev-key": key } : {}),
      ...(body !== undefined ? { "content-type": "application/json" } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload?.message) message = payload.message;
    } catch {
      // non-JSON error body; keep default message
    }
    throw new DevApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

const PRESETS: { label: string; body: Omit<CreateUserBody, "studentId"> }[] = [
  {
    label: "Fresh student",
    body: {
      role: "student",
      registrations: [{ project: "rpkm" }, { project: "firstdate" }],
    },
  },
  { label: "RPKM staff", body: { staffRoles: ["rpkm"] } },
  { label: "Walkrally staff", body: { staffRoles: ["walkrally"] } },
  { label: "Firstdate staff", body: { staffRoles: ["firstdate"] } },
];

const STAFF_ROLES: StaffRole[] = [
  "firstdate",
  "rpkm",
  "walkrally",
  "freshmennight",
];

const PROJECTS = ["rpkm", "firstdate"] as const;

function randomStudentId(prefix: string) {
  const digits = Math.floor(Math.random() * 1e8)
    .toString()
    .padStart(8, "0");
  return `${prefix}${digits}`;
}

function registrationLabel(registration: DevRegistration) {
  return registration.staffRole
    ? `${registration.project}:${registration.staffRole}`
    : registration.project;
}

const STYLES = `
  :host {
    font-size: 13px;
  }
  .dev-root {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 50vh;
    overflow-y: auto;
    padding-right: 2px;
  }
  h1 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }
  .muted {
    color: rgba(191, 193, 201, 0.8);
    font-size: 12px;
    margin: 0;
  }
  .hint {
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 12px;
    color: rgba(191, 193, 201, 0.9);
    margin: 0;
  }
  .status {
    border: 1px solid #b58c26;
    background: rgba(181, 140, 38, 0.15);
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 12px;
    margin: 0;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
  .row.between {
    justify-content: space-between;
  }
  input {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: inherit;
    font: inherit;
    font-size: 12px;
    padding: 5px 8px;
    flex: 1;
    min-width: 0;
  }
  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0;
    width: 100%;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  li {
    display: flex;
    align-items: stretch;
    gap: 6px;
  }
  .persona {
    flex: 1;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    text-align: left;
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: inherit;
    font: inherit;
    font-size: 12px;
    padding: 5px 8px;
    cursor: pointer;
  }
  .persona:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
  }
  .persona.current {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.12);
  }
  .persona:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .chip {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    color: inherit;
    font: inherit;
    font-size: 11px;
    padding: 3px 9px;
    cursor: pointer;
  }
  .chip.active {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.2);
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    padding: 10px;
  }
  label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(191, 193, 201, 0.9);
    display: block;
    margin-bottom: 3px;
  }
  code {
    font-family: monospace;
    font-weight: 600;
  }
`;

export default defineToolbarApp({
  init(canvas, app, server) {
    let devKey = "";
    let users: DevUser[] = [];
    let currentStudentId: string | null = null;
    let busy = false;
    let status: string | null = null;
    let showCreate = false;
    let loadedOnce = false;

    let newStaffRoles: StaffRole[] = [];
    let newProjects: (typeof PROJECTS)[number][] = ["rpkm", "firstdate"];

    const win = document.createElement("astro-dev-toolbar-window");
    const style = document.createElement("style");
    style.textContent = STYLES;
    win.appendChild(style);

    const root = document.createElement("div");
    root.className = "dev-root";
    win.appendChild(root);
    canvas.appendChild(win);

    // --- stable elements (recreated content lives in render()) ---

    const title = document.createElement("h1");
    title.textContent = "RPKM dev tools";

    const sessionLine = document.createElement("p");
    sessionLine.className = "muted";

    const keyHint = document.createElement("p");
    keyHint.className = "hint";
    keyHint.innerHTML =
      "No dev key. Set <code>DEV_API_KEY</code> in the frontend " +
      "<code>.env</code> (same value as the backend), restart " +
      "<code>astro dev</code> — or paste it below for this page load only.";

    const keyInput = document.createElement("input");
    keyInput.type = "password";
    keyInput.placeholder = "DEV_API_KEY";
    keyInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") applyManualKey();
    });

    const keySaveButton = makeButton("Use key", "outline", () =>
      applyManualKey(),
    );

    const keyRow = document.createElement("div");
    keyRow.className = "row";
    keyRow.append(keyInput, keySaveButton);

    const statusLine = document.createElement("p");
    statusLine.className = "status";

    const actionsRow = document.createElement("div");
    actionsRow.className = "row";

    const personasHeader = document.createElement("div");
    personasHeader.className = "row between";

    const personasList = document.createElement("ul");

    const createToggleButton = makeButton(
      "New custom persona",
      "outline",
      () => {
        showCreate = !showCreate;
        render();
      },
    );

    const studentIdInput = makeTextInput("6912345678");
    studentIdInput.maxLength = 10;
    const firstNameInput = makeTextInput("First name");
    const lastNameInput = makeTextInput("Last name");

    const createForm = document.createElement("div");
    createForm.className = "form";

    // --- actions ---

    function applyManualKey() {
      const trimmed = keyInput.value.trim();
      if (!trimmed) return;
      devKey = trimmed;
      void loadUsers();
    }

    async function loadUsers() {
      if (!devKey) return;
      try {
        const result = await devFetch<{ data: { users: DevUser[] } }>(
          "/users",
          { key: devKey },
        );
        users = result.data.users;
        status = null;
        loadedOnce = true;
      } catch (cause) {
        if (cause instanceof DevApiError && cause.status === 401) {
          status = "Dev key rejected. Check DEV_API_KEY on the backend.";
        } else {
          status = cause instanceof Error ? cause.message : String(cause);
        }
      }
      render();
    }

    async function run(action: () => Promise<void>) {
      busy = true;
      status = null;
      render();
      try {
        await action();
      } catch (cause) {
        status = cause instanceof Error ? cause.message : String(cause);
      } finally {
        busy = false;
        render();
      }
    }

    const impersonate = (studentId: string) =>
      run(async () => {
        await devFetch("/impersonate", {
          method: "POST",
          key: devKey,
          body: { studentId },
        });
        window.location.reload();
      });

    const createUser = (body: CreateUserBody, thenImpersonate: boolean) =>
      run(async () => {
        await devFetch("/admin/users", {
          method: "POST",
          key: devKey,
          body,
        });
        if (thenImpersonate) {
          await devFetch("/impersonate", {
            method: "POST",
            key: devKey,
            body: { studentId: body.studentId },
          });
          window.location.reload();
          return;
        }
        await loadUsers();
      });

    const deleteUser = (studentId: string) =>
      run(async () => {
        await devFetch(`/admin/users/${studentId}`, {
          method: "DELETE",
          key: devKey,
        });
        await loadUsers();
      });

    const seed = () =>
      run(async () => {
        const result = await devFetch<{
          data: { houses: number; activities: number; checkpoints: number };
        }>("/seed", {
          method: "POST",
          key: devKey,
          body: { activities: SEED_ACTIVITIES },
        });
        const { houses, activities, checkpoints } = result.data;
        status = `Seeded: ${houses} houses, ${activities} activities, ${checkpoints} checkpoints.`;
      });

    const submitCreateForm = () => {
      const studentId = studentIdInput.value.trim();
      if (studentId.length !== 10) {
        status = "Student ID must be 10 characters.";
        render();
        return;
      }
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      void createUser(
        {
          studentId,
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(newStaffRoles.length > 0
            ? { staffRoles: newStaffRoles }
            : {
                registrations: newProjects.map((project) => ({ project })),
              }),
        },
        true,
      );
    };

    const toggle = <T>(list: T[], value: T) =>
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

    // --- element factories ---

    function makeButton(
      label: string,
      buttonStyle: string,
      onClick: () => void,
    ) {
      const button = document.createElement("astro-dev-toolbar-button");
      button.setAttribute("button-style", buttonStyle);
      button.setAttribute("size", "small");
      button.textContent = label;
      button.addEventListener("click", onClick);
      return button;
    }

    function makeTextInput(placeholder: string) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = placeholder;
      return input;
    }

    function makeChip(label: string, active: boolean, onClick: () => void) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = active ? "chip active" : "chip";
      chip.textContent = label;
      chip.addEventListener("click", onClick);
      return chip;
    }

    // --- render ---

    function render() {
      sessionLine.textContent = `Impersonate test personas without Google SSO. ${
        currentStudentId
          ? `Signed in as ${currentStudentId}.`
          : "Not signed in."
      }`;

      statusLine.textContent = status ?? "";

      actionsRow.replaceChildren(
        ...PRESETS.map((preset) => {
          const button = makeButton(preset.label, "gray", () => {
            if (busy) return;
            const isStaff = preset.body.staffRoles !== undefined;
            void createUser(
              {
                studentId: randomStudentId(isStaff ? "65" : "69"),
                ...preset.body,
              },
              true,
            );
          });
          return button;
        }),
        makeButton("Seed fixtures", "outline", () => {
          if (!busy) void seed();
        }),
      );

      const personasLabel = document.createElement("span");
      personasLabel.className = "muted";
      personasLabel.textContent = `Personas (${users.length})`;
      personasHeader.replaceChildren(
        personasLabel,
        makeButton("Reload", "outline", () => {
          if (!busy) void loadUsers();
        }),
      );

      personasList.replaceChildren(
        ...users.map((user) => {
          const item = document.createElement("li");

          const personaButton = document.createElement("button");
          personaButton.type = "button";
          personaButton.className =
            user.studentId === currentStudentId ? "persona current" : "persona";
          personaButton.disabled = busy;
          personaButton.addEventListener(
            "click",
            () => void impersonate(user.studentId),
          );

          const identity = document.createElement("span");
          identity.innerHTML = `<strong>${user.studentId}</strong> ${user.firstName} ${user.lastName}`;
          const meta = document.createElement("span");
          meta.className = "muted";
          meta.textContent =
            user.role +
            (user.registrations.length > 0
              ? ` · ${user.registrations.map(registrationLabel).join(", ")}`
              : "");
          personaButton.append(identity, meta);

          item.append(
            personaButton,
            makeButton("✕", "red", () => {
              if (!busy) void deleteUser(user.studentId);
            }),
          );
          return item;
        }),
      );
      if (users.length === 0 && loadedOnce) {
        const empty = document.createElement("li");
        empty.className = "muted";
        empty.textContent = "No personas yet — use a preset or the form below.";
        personasList.appendChild(empty);
      }

      createToggleButton.textContent = showCreate
        ? "Hide custom persona form"
        : "New custom persona";

      if (showCreate) {
        const studentIdField = document.createElement("div");
        const studentIdLabel = document.createElement("label");
        studentIdLabel.textContent = "Student ID";
        studentIdField.append(studentIdLabel, studentIdInput);

        const nameRow = document.createElement("div");
        nameRow.className = "row";
        nameRow.append(firstNameInput, lastNameInput);

        const staffField = document.createElement("div");
        const staffLabel = document.createElement("label");
        staffLabel.textContent = "Staff roles (empty = student)";
        const staffChips = document.createElement("div");
        staffChips.className = "row";
        staffChips.append(
          ...STAFF_ROLES.map((role) =>
            makeChip(role, newStaffRoles.includes(role), () => {
              newStaffRoles = toggle(newStaffRoles, role);
              render();
            }),
          ),
        );
        staffField.append(staffLabel, staffChips);

        createForm.replaceChildren(studentIdField, nameRow, staffField);

        if (newStaffRoles.length === 0) {
          const projectsField = document.createElement("div");
          const projectsLabel = document.createElement("label");
          projectsLabel.textContent = "Registrations";
          const projectChips = document.createElement("div");
          projectChips.className = "row";
          projectChips.append(
            ...PROJECTS.map((project) =>
              makeChip(project, newProjects.includes(project), () => {
                newProjects = toggle(newProjects, project);
                render();
              }),
            ),
          );
          projectsField.append(projectsLabel, projectChips);
          createForm.appendChild(projectsField);
        }

        createForm.appendChild(
          makeButton("Create & impersonate", "purple", () => {
            if (!busy) submitCreateForm();
          }),
        );
      }

      const separator = document.createElement("hr");
      root.replaceChildren(
        title,
        sessionLine,
        ...(devKey ? [] : [keyHint, keyRow]),
        ...(status ? [statusLine] : []),
        ...(devKey
          ? [
              actionsRow,
              separator,
              personasHeader,
              personasList,
              createToggleButton,
              ...(showCreate ? [createForm] : []),
            ]
          : []),
      );
    }

    // --- wiring ---

    server.on<{ key: string }>("rpkm-dev:key", ({ key }) => {
      if (key && !devKey) {
        devKey = key;
        void loadUsers();
      }
      render();
    });
    server.send("rpkm-dev:get-key", {});

    fetch(`${API_BASE}/v1/auth/get-session`, { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: { email?: string } } | null) => {
        const email = data?.user?.email;
        if (email) {
          currentStudentId = email.split("@")[0] ?? null;
          render();
        }
      })
      .catch(() => {
        // no session; window shows "not signed in"
      });

    app.onToggled(({ state }) => {
      if (state && devKey && !loadedOnce) void loadUsers();
    });

    render();
  },
});
