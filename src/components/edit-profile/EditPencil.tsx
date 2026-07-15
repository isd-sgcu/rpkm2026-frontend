import editIcon from "@assets/images/edit.svg";
import { cn } from "@lib/utils";

/** The edit pencil, reusing the same asset the nav drawer's "แก้ไขข้อมูล" entry
 *  already uses. */
export function EditPencil({ className }: { className?: string }) {
  return <img src={editIcon.src} alt="" className={cn("size-5", className)} />;
}
