const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/*",
  { eager: true },
);

export const getImageUrl = (filename: string) => {
  const entry = Object.entries(images).find(([path]) =>
    path.endsWith(`/${filename}`),
  );
  return entry?.[1].default.src;
};
