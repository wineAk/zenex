import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDefaultSettings,
  type SettingsTypes,
} from "../zendesk-search/lib/settings";

export type ZendeskSelectProps = {
  settings: SettingsTypes;
  setSettings: (settings: SettingsTypes) => void;
  currentSettingNumber: number;
  setCurrentSettingNumber: (currentSettingNumber: number) => void;
};

export default function ZendeskSelect({
  settings,
  setSettings,
  currentSettingNumber,
  setCurrentSettingNumber,
}: ZendeskSelectProps) {
  const handleSettingSelect = (value: string) => {
    const idx = settings.findIndex((setting) => setting.name === value);
    if (idx !== -1) setCurrentSettingNumber(idx);
  };

  const addNewSetting = () => {
    const newSettings = getDefaultSettings();
    newSettings.name = `設定 ${settings.length + 1}`;
    const newArr = [...settings, newSettings];
    setSettings(newArr);
    setCurrentSettingNumber(settings.length);
  };
  return (
    <div className="flex items-center space-x-4">
      <p className="text-muted-foreground text-sm">設定を選択</p>
      <Select
        value={settings[currentSettingNumber].name}
        onValueChange={(value) => handleSettingSelect(value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="設定を選択" />
        </SelectTrigger>
        <SelectContent>
          {settings.map((setting) => (
            <SelectItem key={setting.name} value={setting.name}>
              {setting.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={addNewSetting}>
        <Plus />
        新規設定
      </Button>
    </div>
  );
}
