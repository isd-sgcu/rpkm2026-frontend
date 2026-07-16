import type { UpdateProfileBody } from "@lib/api/rpkm";
import { toRegistrationBody } from "@components/register/toRegistrationBody";
import type { RegisterFormValues } from "@components/register/types";

import { SECTION_PATCH_KEYS, type EditSection } from "./sections";

/** Build the partial PATCH body for one section by running the full
 *  form-to-body mapping and keeping only that section's keys. The form is
 *  always seeded with the complete profile, so every field the mapper reads
 *  is present. */
export function toSectionPatch(
  section: EditSection,
  data: RegisterFormValues,
): UpdateProfileBody {
  const full = toRegistrationBody(data);
  const patch: UpdateProfileBody = {};
  for (const key of SECTION_PATCH_KEYS[section]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (patch as any)[key] = (full as any)[key];
  }
  return patch;
}
