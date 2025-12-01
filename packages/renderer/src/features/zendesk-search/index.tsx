import { useState } from "react";
import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { type SettingsTypes } from "./lib/settings";
import TabApi from "./components/tab-api";
import TabQuery from "./components/tab-query";
import TabOther from "./components/tab-other";

export type ZendeskSearchProps = {
  settings: SettingsTypes;
  setSettings: (settings: SettingsTypes) => void;
  currentSettingNumber: number;
  setCurrentSettingNumber: (currentSettingNumber: number) => void;
};

export default function ZendeskSearch({
  settings,
  setSettings,
  currentSettingNumber,
}: ZendeskSearchProps) {
  const [activeTab, setActiveTab] = useState("query");

  return (
    <div className="flex justify-between items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings />
            検索の設定
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>検索の設定</DialogTitle>
            <DialogDescription>
              検索条件を設定して、Zendeskのチケットを検索します。
            </DialogDescription>
          </DialogHeader>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            key={currentSettingNumber}
          >
            <TabsList>
              <TabsTrigger value="query">検索条件</TabsTrigger>
              <TabsTrigger value="api">API設定</TabsTrigger>
              <TabsTrigger value="other">その他</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <TabQuery
                settings={settings[currentSettingNumber]}
                setSettings={(newSetting) => {
                  const newArr = [...settings];
                  newArr[currentSettingNumber] = newSetting;
                  setSettings(newArr);
                }}
              />
            </TabsContent>
            <TabsContent value="api">
              <TabApi
                settings={settings[currentSettingNumber]}
                setSettings={(newSetting) => {
                  const newArr = [...settings];
                  newArr[currentSettingNumber] = newSetting;
                  setSettings(newArr);
                }}
              />
            </TabsContent>
            <TabsContent value="other">
              <TabOther
                settings={settings[currentSettingNumber]}
                setSettings={(newSetting) => {
                  const newArr = [...settings];
                  newArr[currentSettingNumber] = newSetting;
                  setSettings(newArr);
                }}
                allSettings={settings}
                currentIndex={currentSettingNumber}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
