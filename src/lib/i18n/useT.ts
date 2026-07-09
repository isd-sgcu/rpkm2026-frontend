import { useStore } from "@nanostores/react";

import { $locale } from "./locale";
import en from "./dict/en.json";
import th from "./dict/th.json";

const dict = { th, en };

type Dict = typeof en;
type Join<K extends string, Rest extends string> = Rest extends ""
  ? K
  : `${K}.${Rest}`;
type DictKey<T> = {
  [K in keyof T & string]: T[K] extends string ? K : Join<K, DictKey<T[K]>>;
}[keyof T & string];

function resolve(node: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object" ? (acc as never)[part] : undefined,
      node,
    );
  return typeof value === "string" ? value : path;
}

export function useT() {
  const locale = useStore($locale);

  return function t(key: DictKey<Dict>, vars?: Record<string, string>) {
    const template = resolve(dict[locale], key);
    if (!vars) return template;
    return Object.entries(vars).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, value),
      template,
    );
  };
}
