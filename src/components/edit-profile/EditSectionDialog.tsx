import { useMemo, useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@components/ui/button";
import { makeRegisterSchema } from "@components/register/schema";
import type { RegisterFormValues } from "@components/register/types";
import { APIError } from "@lib/client";
import { updateProfile, type ProfileResult } from "@lib/api/rpkm";
import { useT } from "@lib/i18n/useT";

import { EditPencil } from "./EditPencil";
import { profileToFormValues } from "./fromProfile";
import { toSectionPatch } from "./toPatch";
import { SECTION_FIELDS, type EditSection } from "./sections";

export function EditSectionDialog({
  section,
  title,
  profile,
  body,
}: {
  section: EditSection;
  title: string;
  profile: ProfileResult;
  body: React.ReactNode;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        render={
          <button
            type="button"
            aria-label={`${t("editProfile.edit")} ${title}`}
            className="shrink-0"
          />
        }
      >
        <EditPencil />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        {/* Full-screen flex-centered so sizing is robust; clicking the padding
            area (target === the popup itself) dismisses. Escape closes too. */}
        <DialogPrimitive.Popup
          className="fixed inset-0 z-50 outline-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          {/* Mounted only while open, so each open reseeds from the latest
              profile and cancelled edits are simply discarded. */}
          <SectionForm
            section={section}
            title={title}
            profile={profile}
            body={body}
            onDone={() => setOpen(false)}
          />
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function SectionForm({
  section,
  title,
  profile,
  body,
  onDone,
}: {
  section: EditSection;
  title: string;
  profile: ProfileResult;
  body: React.ReactNode;
  onDone: () => void;
}) {
  const t = useT();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(() => makeRegisterSchema(t), [t]);
  const methods = useForm<RegisterFormValues>({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: profileToFormValues(profile),
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterFormValues) =>
      updateProfile(toSectionPatch(section, values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rpkm-profile"] });
      onDone();
    },
    onError: (err) => {
      const key =
        err instanceof APIError && err.status === 400
          ? "register.error.badRequest"
          : "register.error.generic";
      setSubmitError(t(key));
    },
  });

  const onConfirm = async () => {
    const valid = await methods.trigger(SECTION_FIELDS[section]);
    if (!valid) return;
    setSubmitError(null);
    mutation.mutate(methods.getValues());
  };

  return (
    <div className="@container mx-auto my-4 flex h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-md flex-col rounded-3xl bg-background">
      <FormProvider {...methods}>
        <div className="flex min-h-0 flex-1 flex-col pt-6">
          <h1 className="shrink-0 px-6 text-center text-2xl font-bold text-secondary">
            {title}
          </h1>

          <form
            onSubmit={(event) => event.preventDefault()}
            noValidate
            className="no-scrollbar mt-4 min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-6"
          >
            {body}
          </form>

          <div className="shrink-0 px-6 pt-4 pb-6">
            {submitError && (
              <p className="mb-2 text-center text-sm text-destructive">
                {submitError}
              </p>
            )}
            <Button
              type="button"
              size="lg"
              className="h-14 w-full rounded-full text-lg"
              onClick={onConfirm}
              disabled={mutation.isPending}
            >
              {t("editProfile.confirm")}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
