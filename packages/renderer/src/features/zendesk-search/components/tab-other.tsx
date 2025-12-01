import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { SettingsType, SettingsTypes } from "../lib/settings";

type TabOtherProps = {
  settings: SettingsType;
  setSettings: (settings: SettingsType) => void;
  allSettings: SettingsTypes;
  currentIndex: number;
};

export default function TabOther({
  settings,
  setSettings,
  allSettings,
  currentIndex,
}: TabOtherProps) {
  // 設定名が重複しているか
  const [isNameDuplicated, setIsNameDuplicated] = useState(false);
  // 設定名が0文字以下か
  const [isNameEmpty, setIsNameEmpty] = useState(false);

  return (
    <Card>
      <ScrollArea className="h-96">
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">設定名</Label>
            <Input
              id="name"
              name="name"
              placeholder="サポート用"
              defaultValue={settings.name}
              onChange={(e) => {
                const newName = e.target.value;
                // 0文字以下にはできない
                if (newName.length === 0) {
                  setIsNameEmpty(true);
                  return;
                }
                // 自分以外の設定と名前が被ってたら注意文を表示
                const isDup = allSettings.some((setting, idx) => {
                  // 自分の設定は除外
                  if (idx === currentIndex) return false;
                  return setting.name === newName;
                });
                setIsNameDuplicated(isDup);
                if (isDup) return;
                setSettings({
                  ...settings,
                  name: newName,
                });
              }}
            />
            {isNameEmpty && (
              <p className="text-sm text-red-500">設定名を入力してください</p>
            )}
            {isNameDuplicated && (
              <p className="text-sm text-red-500">設定名が被っています</p>
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
