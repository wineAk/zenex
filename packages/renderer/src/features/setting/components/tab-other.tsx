import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { SettingType } from "@/lib/zendesk-settings";

type TabOtherProps = {
  setting: SettingType;
  changeSetting: (
    setting: SettingType,
    action: "add" | "update" | "delete"
  ) => void;
};

export default function TabOther({ setting, changeSetting }: TabOtherProps) {
  const { name } = setting;

  const [nameError, setNameError] = useState<string | null>(null);

  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-var(--spacing)*56)]">
        <CardContent className="pb-2 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">設定名</Label>
            <Input
              id="name"
              name="name"
              placeholder="サポート用"
              defaultValue={name}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length < 1) {
                  setNameError("設定名を入力してください");
                  return;
                } else {
                  setNameError(null);
                  const newSetting = {
                    ...setting,
                    name: value,
                  };
                  changeSetting(newSetting, "update");
                }
              }}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
