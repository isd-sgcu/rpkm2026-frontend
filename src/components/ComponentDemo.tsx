import { useStore } from "@nanostores/react";

import { Button } from "@components/ui/button";
import { $locale, setLocale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { Checkbox } from "./ui/checkbox";
import { Field } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function ComponentDemo() {
  const t = useT();
  const locale = useStore($locale);

  return (
    <section className="grid gap-4 p-6 w-full">
      <h1 className="text-xl font-bold font-mono"> Components </h1>

      <h2 className="text-lg font-bold font-mono"> i18n </h2>
      <div className="grid gap-2">
        <p className="text-sm text-muted-foreground font-mono">
          current locale: {locale}
        </p>
        <p>{t("welcome.title", { appName: "firstdate" })}</p>
        <p className="text-sm">{t("welcome.description")}</p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={locale === "th" ? "default" : "outline"}
            size="sm"
            onClick={() => setLocale("th")}
          >
            ไทย
          </Button>
          <Button
            type="button"
            variant={locale === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLocale("en")}
          >
            EN
          </Button>
        </div>
      </div>
      <hr />

      <h2 className="text-lg font-bold font-mono"> Typography </h2>
      <div className="grid gap-1">
        <p className="font-sans font-normal">Regular - สวัสดีครับ Hello</p>
        <p className="font-sans font-bold">Bold - สวัสดีครับ Hello</p>
        <p className="font-sans italic">Italic - สวัสดีครับ Hello</p>
        <p className="font-sans font-bold italic">
          Bold Italic - สวัสดีครับ Hello
        </p>
        <p className="font-heading text-2xl font-bold">
          Heading - สวัสดีครับ Hello
        </p>
      </div>
      <hr />

      <h2 className="text-lg font-bold font-mono"> Button </h2>
      <div className="flex gap-3 items-center flex-wrap">
        <Button type="button" size="lg">
          Default lg
        </Button>
        <Button type="button" variant="secondary" size="md">
          Secondary md
        </Button>
        <Button type="button" variant="primaryOutline" size="md">
          outline md
        </Button>
        <Button type="button" variant="red" size="md">
          red md
        </Button>

        <Button type="button" variant="ghost" size="sm">
          Ghost sm
        </Button>
      </div>
      <hr />

      <h2 className="text-lg font-bold font-mono"> Input </h2>
      <Field>
        <Label className="font-bold"> Default </Label>
        <Input placeholder="แคนาดา" />
      </Field>

      <hr />

      <Label>
        <div className="flex gap-2 items-center">
          <Checkbox />
          Checkbox
        </div>
      </Label>

      <Label>
        <div className="flex gap-2 items-center">
          <Switch />
          Switch
        </div>
      </Label>

      <Label>
        <RadioGroup defaultValue="default">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
        </RadioGroup>
      </Label>

      <hr />

      <h2 className="text-lg font-bold font-mono"> Select </h2>

      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <hr />

      <h2 className="text-lg font-bold font-mono"> Tabs </h2>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
      <hr />
    </section>
  );
}
