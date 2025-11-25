"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter as useNextIntlRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { startTransition } from "react";

const languages = [
  { code: "zh", name: "中文" },
  { code: "en", name: "English" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useNextIntlRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params` are used
        { pathname, params },
        { locale: newLocale },
      );
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
