import { checkinFreshmenNight } from "@lib/api/checkin";
import { CheckinScanPanel } from "@components/staff/CheckinScanPanel";

export function FreshmenNightPanel() {
  return (
    <CheckinScanPanel
      namespace="staff.freshmenNight"
      checkin={checkinFreshmenNight}
    />
  );
}
