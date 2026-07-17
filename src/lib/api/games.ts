import { API } from "@lib/client";

type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type GameType = "jigsaw" | "csr";

export type CollectedCheckpoint = {
  checkpointId: string;
  code: string;
  game: GameType;
  scannedAt: string;
};

export type GameProgressResult = {
  collected: CollectedCheckpoint[];
};

/** Checkpoints the authenticated freshman has already collected for the given game. */
export async function getGameProgress(gameType: GameType) {
  const res = await API.get<SuccessResponse<GameProgressResult>>(
    `/v1/rpkm/game/${gameType}/progress`,
  );
  return res.data;
}

export type CollectCheckpointResult = {
  checkpointId: string;
  code: string;
  scannedAt: string;
};

/** Records a checkpoint scan. `lat`/`lng` are the device's current position, checked against the checkpoint's geofence. */
export async function collectCheckpoint(
  gameType: GameType,
  body: { code: string; lat: number; lng: number },
) {
  const res = await API.post<SuccessResponse<CollectCheckpointResult>>(
    `/v1/rpkm/game/${gameType}/collect`,
    body,
  );
  return res.data;
}
