import { collectCheckpoint } from "@lib/api/games";
import { APIError } from "@lib/client";
import type { Translator } from "@lib/i18n/useT";
import { markPieceFound, pieceIdFromCheckpointId } from "./jigsawState";

const QR_URL_PATTERN =
  /^(?:https:\/\/rpkm2026\.com|http:\/\/localhost:4321)\/jigsaw\/jigsaw\d+(?:\?|$)/;

/** Extracts the `code` query param from a scanned jigsaw QR URL; null if the URL doesn't match the expected shape. */
export function extractJigsawCode(raw: string): string | null {
  if (!QR_URL_PATTERN.test(raw)) return null;
  try {
    return new URL(raw).searchParams.get("code");
  } catch {
    return null;
  }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

export type JigsawCollectError =
  | "location-unsupported"
  | "location-denied"
  | "already-collected"
  | "game-closed"
  | "out-of-geofence"
  | "invalid-checkpoint"
  | "not-freshman"
  | "unknown";

export type JigsawCollectOutcome =
  | { status: "success"; pieceId: number; receivedAt: string }
  | { status: "fail"; error: JigsawCollectError };

function toCollectError(err: unknown): JigsawCollectError {
  if (err instanceof Error && err.message === "unsupported") {
    return "location-unsupported";
  }
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "number"
  ) {
    // GeolocationPositionError
    return "location-denied";
  }
  if (err instanceof APIError) {
    switch (err.code) {
      case "ALREADY_COLLECTED":
        return "already-collected";
      case "GAME_CLOSED":
        return "game-closed";
      case "OUT_OF_GEOFENCE":
        return "out-of-geofence";
      case "INVALID_CHECKPOINT":
        return "invalid-checkpoint";
      case "NOT_FRESHMEN":
        return "not-freshman";
      default:
        return "unknown";
    }
  }
  return "unknown";
}

/**
 * Runs the real collect flow for a jigsaw QR `code`: gets the device position,
 * sends it to the backend for geofence + validity checks, and awards the piece
 * locally on success. Shared by the in-app camera/upload scanner and the
 * `/jigsaw/<pointId>?code=<code>` deep link (the URL an external scanner opens).
 */
export async function collectJigsawCode(
  code: string,
): Promise<JigsawCollectOutcome> {
  try {
    const devicePosition = await getCurrentPosition();
    const collected = await collectCheckpoint("jigsaw", {
      code,
      lat: devicePosition.coords.latitude,
      lng: devicePosition.coords.longitude,
    });
    const pieceId = pieceIdFromCheckpointId(collected.checkpointId);
    if (pieceId === null) {
      // Collected server-side, but this checkpoint id isn't in the frontend's
      // board-slot map — a seeding mismatch, not a user-facing scan failure.
      return { status: "fail", error: "unknown" };
    }
    markPieceFound(pieceId, collected.scannedAt);
    return { status: "success", pieceId, receivedAt: collected.scannedAt };
  } catch (err) {
    return { status: "fail", error: toCollectError(err) };
  }
}

/** Human-readable title/message for a collect error; both undefined falls back to the generic failed-scan copy. */
export function describeJigsawCollectError(
  error: JigsawCollectError,
  t: Translator,
): { title?: string; message?: string } {
  switch (error) {
    case "location-unsupported":
    case "location-denied":
      return { message: t("jigsaw.scan.locationRequired") };
    case "already-collected":
      return {
        title: t("jigsaw.scan.alreadyCollectedTitle"),
        message: t("jigsaw.scan.alreadyCollectedMessage"),
      };
    case "game-closed":
      return { message: t("jigsaw.scan.errorGameClosed") };
    case "out-of-geofence":
      return { message: t("jigsaw.scan.errorOutOfGeofence") };
    case "invalid-checkpoint":
      return { message: t("jigsaw.scan.errorInvalidCheckpoint") };
    case "not-freshman":
      return { message: t("jigsaw.scan.errorNotFreshmen") };
    default:
      return {};
  }
}
