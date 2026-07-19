import { checkinRegistration } from "@lib/api/checkin";
import { CheckinScanPanel } from "@components/staff/CheckinScanPanel";

export function CheckInPanel() {
  return (
    <CheckinScanPanel namespace="staff.checkin" checkin={checkinRegistration} />
  );
}
