import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  loadStoredSettingId,
  saveStoredSettingId,
} from "@/lib/current-setting-id";
import { loadStoredQueryId } from "@/lib/current-query-id";

import {
  getSettings,
  setSetting,
  deleteSetting,
  type SettingType,
} from "@/lib/zendesk-settings";
import {
  getQueries,
  setQuery,
  deleteQuery,
  type QueryType,
} from "@/lib/zendesk-query";

import ZendeskSelect from "./components/select";
import TabQuery from "./components/tab-query";

type ZendeskSettingProps = {
  clickHandler: (component: "setting" | "search" | "download") => void;
};

export default function ZendeskSetting({ clickHandler }: ZendeskSettingProps) {
  // 設定リスト管理
  const [settings, setSettings] = useState<SettingType[]>(getSettings());
  // 選択中の設定ID管理
  const [currentSettingId, setCurrentSettingId] = useState(
    loadStoredSettingId()
  );
  // 選択中の設定をuseMemoで最適化
  const currentSetting = useMemo(
    () =>
      settings.find((setting) => setting.id === currentSettingId) ||
      settings[0],
    [settings, currentSettingId]
  );
  // 設定の追加・更新・削除
  const changeSetting = (
    setting: SettingType,
    action: "add" | "update" | "delete"
  ): void => {
    const { id } = setting;
    if (action === "add") {
      setSetting(id, setting);
      setSettings((prev) => [...prev, setting]);
    }
    if (action === "update") {
      setSetting(id, setting);
      setSettings((prev) => prev.map((s) => (s.id === id ? setting : s)));
    }
    if (action === "delete") {
      deleteSetting(id);
      setSettings((prev) => prev.filter((s) => s.id !== id));
    }
  };
  // 選択中IDの変更
  const changeSettingId = (number: number): void => {
    setCurrentSettingId(number);
    saveStoredSettingId(number);
  };

  // クエリリスト管理
  const [queries, setQueries] = useState<QueryType[]>(getQueries());
  // 選択中のクエリID管理
  const [currentQueryId] = useState(loadStoredQueryId());
  // 選択中のクエリをuseMemoで最適化
  const currentQuery = useMemo(
    () => queries.find((query) => query.id === currentQueryId) || queries[0],
    [queries, currentQueryId]
  );
  // クエリの追加・更新・削除
  const changeQuery = (
    query: QueryType,
    action: "add" | "update" | "delete"
  ): void => {
    const { id } = query;
    if (action === "add") {
      setQuery(id, query);
      setQueries((prev) => [...prev, query]);
    }
    if (action === "update") {
      setQuery(id, query);
      setQueries((prev) => prev.map((q) => (q.id === id ? query : q)));
    }
    if (action === "delete") {
      deleteQuery(id);
      setQueries((prev) => prev.filter((q) => q.id !== id));
    }
  };
  // 選択中のクエリIDの変更
  //const changeQueryId = (number: number): void => {
  //  setCurrentQueryId(number);
  //  saveStoredQueryId(number);
  //};

  return (
    <section className="h-full flex flex-col gap-4">
      <div className="min-h-0 flex-1 flex flex-col gap-4">
        <ZendeskSelect
          settings={settings}
          changeSetting={changeSetting}
          currentId={currentSettingId}
          changeSettingId={changeSettingId}
        />
        <TabQuery query={currentQuery} changeQuery={changeQuery} />
      </div>
      <div className="flex justify-end gap-4">
        <Button
          className="w-32"
          disabled={
            !currentSetting.sub_domain ||
            !currentSetting.email ||
            !currentSetting.api_token
          }
          onClick={() => clickHandler("search")}
        >
          <Search />
          検索実行
        </Button>
      </div>
    </section>
  );
}
