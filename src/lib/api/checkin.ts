import { API, APIError } from "@lib/client";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type CheckinEntry = {
  id: string;
  project: string;
  studentId: string;
  scannedBy: string;
  scannedAt: string;
  createdAt: string;
  updatedAt: string;
};

/** Staff-only: check a freshman in to RPKM by their CUNET student id. */
export async function checkinRegistration(studentId: string) {
  const res = await API.post<SuccessResponse<CheckinEntry>>(
    "/v1/rpkm/checkin/registration",
    { student_id: studentId },
  );
  return res.data;
}

export type CheckinStatus = {
  scannedAt: string;
  scannedBy: string;
};

/**
 * Self-serve: has the authenticated freshman been checked in to RPKM yet?
 * The backend 404s (NOT_FOUND) when there's no scan on record — that's a
 * normal "not checked in" state here, not an error.
 */
export async function getRegistrationCheckinStatus() {
  try {
    const res = await API.get<SuccessResponse<CheckinStatus>>(
      "/v1/rpkm/checkin/registration/status",
    );
    return res.data;
  } catch (err) {
    if (err instanceof APIError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

/** Staff-only: check a freshman in to Freshmen Night by their CUNET student id. */
export async function checkinFreshmenNight(studentId: string) {
  const res = await API.post<SuccessResponse<CheckinEntry>>(
    "/v1/rpkm/checkin/freshmennight",
    { student_id: studentId },
  );
  return res.data;
}

export type WalkRallyAttendance = {
  studentId: string;
  activityId: string;
  scannedAt: string;
  scannedBy: string;
};

/**
 * Staff-only: record a walk-rally attendance scan (awards points).
 * `code` is the activity code, e.g. "lookchoop".
 */
export async function recordWalkRallyAttendance(body: {
  studentId: string;
  code: string;
}) {
  const res = await API.post<SuccessResponse<WalkRallyAttendance>>(
    "/v1/rpkm/walkrally/attendances",
    body,
  );
  return res.data;
}
