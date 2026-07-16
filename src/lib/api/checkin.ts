import { API } from "@lib/client";

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
