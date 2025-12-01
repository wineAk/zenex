import "./App.css";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

import ZendeskSetting from "@/features/setting";
import ZendeskView from "@/features/view";
import ZendeskDownload from "@/features/download";

type OpenComponentType = "setting" | "search" | "download";

function App() {
  const [openComponent, setOpenComponent] = useState<OpenComponentType>("setting");
  return (
    <>
      <main className="h-dvh p-4">
        {openComponent === "setting" && <ZendeskSetting clickHandler={setOpenComponent} />}
        {openComponent === "search" && <ZendeskView clickHandler={setOpenComponent} />}
        {openComponent === "download" && <ZendeskDownload clickHandler={setOpenComponent} />}
      </main>
      <Toaster expand={true} theme="light" richColors />
    </>
  );
}
/*
import { useState } from "react";
import { Search, Download } from "lucide-react";
import "./App.css";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import ZendeskSearch from "@/features/zendesk-search/index";
import {
  getSettings,
  type SettingsType,
  type SettingsTypes,
} from "@/features/zendesk-search/lib/settings";
import { formatJstToUtc } from "@/lib/date-format";
import type { ZendeskSearchResults, ZendeskSearchType, ZendeskResult } from "@/types/zendesk/search";
import type { ZendeskCommentResults, ZendeskCommentType, ZendeskComment } from "@/types/zendesk/comments";
import ZendeskView from "@/features/zendesk-view";
import ZendeskSelect from "@/features/zendesk-select";

function buildDateRangeQuery(
  field: string,
  range?: { start: string; end: string }
): string {
  if (!range) return "";
  const { start, end } = range;

  if (start.length > 0 && end.length > 0) {
    return `${field}>${formatJstToUtc(
      start,
      "start"
    )} ${field}<${formatJstToUtc(end, "end")}`;
  } else if (start.length > 0) {
    return `${field}>${formatJstToUtc(start, "start")}`;
  } else if (end.length > 0) {
    return `${field}<${formatJstToUtc(end, "end")}`;
  }
  return "";
}

async function handleZendeskSearch(settings: SettingsType, page: number = 1): Promise<ZendeskSearchType> {
  const fetchZendeskKey = btoa("fetchZendesk");
  const fetchZendesk = (window as any)[fetchZendeskKey];
  if (typeof fetchZendesk !== "function") {
    toast.error("fetchZendeskが見つかりませんでした");
    return { error: "fetchZendeskが見つかりませんでした" };
  }
  const { api, query } = settings;
  const { sub_domain, email, api_token } = api;
  const auth = btoa(`${email}/token:${api_token}`);
  const header = { Authorization: `Basic ${auth}` };
  const queryString = () => {
    const { created, updated, solved, subject, description, status } = query;
    const createdStr = buildDateRangeQuery("created", created);
    const updatedStr = buildDateRangeQuery("updated", updated);
    const solvedStr = buildDateRangeQuery("solved", solved);
    const subjectStr = subject.length > 0 ? `subject:"${subject}"` : "";
    const descriptionStr =
      description.length > 0 ? `description:"${description}"` : "";
    const statusStr = status.map((status) => `status:${status}`).join(" ");
    const queryStr = [
      "type:ticket",
      createdStr,
      updatedStr,
      solvedStr,
      statusStr,
      subjectStr,
      descriptionStr,
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    return queryStr;
  };
  const url = `https://${sub_domain}.zendesk.com/api/v2/search.json?page=${page}&query=${queryString()}`;
  const result = await fetchZendesk(url, header);
  return result;
}

// 検索結果を全て取得
async function handleZendeskSearchAll(settings: SettingsType): Promise<ZendeskResult[]> {
  let allResults: ZendeskResult[] = [];
  let page = 1;
  let firstPageData: ZendeskSearchResults | null = null;

  while (true) {
    toast.info(`${page}ページ目を取得中...`, {
      id: "page_list_progress",
    });

    // APIの残数チェック
    const checkApiLimit = async (api: any) => {
      if (api?.remaining && Number(api.remaining) <= 10) {
        toast.warning(`APIの残数が少ないため、1分間待機します... (残り: ${api.remaining})`);
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    };
    
    // ページ取得（エラー時は1分待機して再試行）
    const fetchPage = async () => {
      const { data, error, api } = await handleZendeskSearch(settings, page);
      if (error || data == null) {
        toast.warning(`${page}ページ目の取得に失敗しました。1分後に再試行します...`);
        await new Promise(resolve => setTimeout(resolve, 60000));
        return fetchPage();
      }
      await checkApiLimit(api);
      return { data, api };
    };

    const { data } = await fetchPage();
    if (page === 1) firstPageData = data;
    allResults = allResults.concat(data?.results || []);
    // 次のページがない場合は終了
    if (!data?.next_page) break;
    page++;
  }

  return allResults;
}

async function handleZendeskComment(settings: SettingsType, id: number): Promise<ZendeskCommentType> {
  const { api } = settings;
  const { sub_domain, email, api_token } = api;
  const auth = btoa(`${email}/token:${api_token}`);
  const header = { Authorization: `Basic ${auth}` };
  const fetchZendeskKey = btoa("fetchZendesk");
  const fetchZendesk = (window as any)[fetchZendeskKey];
  if (typeof fetchZendesk !== "function") {
    toast.error("fetchZendeskが見つかりませんでした");
    return { error: "fetchZendeskが見つかりませんでした" };
  }
  const url = `https://${sub_domain}.zendesk.com/api/v2/tickets/${id}/comments.json`;
  const result = await fetchZendesk(url, header);
  return result;
}

type ZendeskCommentAllResult = (ZendeskResult & {
  comments: ZendeskComment[] | [];
});

async function handleZendeskCommentAll(settings: SettingsType, zendeskResults: ZendeskResult[]): Promise<ZendeskCommentAllResult[]> {
  const allCount = zendeskResults.length;
  let allResults: ZendeskCommentAllResult[] = [];
  let currentIndex = 0;

  while (currentIndex < allCount) {
    toast.info(`${currentIndex + 1}/${allCount}件目のコメントを取得中...`, {
      id: "comment_progress",
    });

    // APIの残数チェック
    const checkApiLimit = async (api: any) => {
      if (api?.remaining && Number(api.remaining) <= 10) {
        toast.warning(`APIの残数が少ないため、1分間待機します... (残り: ${api.remaining})`);
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    };

    // コメント取得（エラー時は1分待機して再試行）
    const fetchComment = async () => {
      const { data, error, api } = await handleZendeskComment(settings, zendeskResults[currentIndex].id);
      
      if (error || data == null) {
        toast.warning(`${currentIndex + 1}件目のコメント取得に失敗しました。1分後に再試行します...`);
        await new Promise(resolve => setTimeout(resolve, 60000));
        return fetchComment();
      }

      await checkApiLimit(api);
      return { data, api };
    };

    const { data } = await fetchComment();
    allResults.push({
      ...zendeskResults[currentIndex],
      comments: data?.comments || []
    });

    currentIndex++;
  }

  return allResults;
}

function App() {
  const [settings, setSettings] = useState<SettingsTypes>(getSettings());
  const [currentSettingNumber, setCurrentSettingNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zendeskSearchResults, setZendeskSearchResults] =
    useState<ZendeskSearchResults | null>(null);

  // 設定の更新と保存（重複名チェック付き）
  const updateSettings = (newSettings: SettingsTypes) => {
    setSettings(newSettings);
    localStorage.setItem("zendesk-settings", JSON.stringify(newSettings));
  };

  return (
    <main className="p-4 space-y-4">
      <Toaster expand={true} theme="light" richColors />
      <ZendeskSelect
        settings={settings}
        setSettings={updateSettings}
        currentSettingNumber={currentSettingNumber}
        setCurrentSettingNumber={setCurrentSettingNumber}
      />
      <div className="flex gap-4">
        <ZendeskSearch
          settings={settings}
          setSettings={updateSettings}
          currentSettingNumber={currentSettingNumber}
          setCurrentSettingNumber={setCurrentSettingNumber}
        />
        <Button
          onClick={async () => {
            toast.info("検索中...");
            const { data, error } = await handleZendeskSearch(
              settings[currentSettingNumber]
            );
            if (error || data == null) {
              toast.error(`エラー: ${error}`);
              setZendeskSearchResults(null);
            } else {
              toast.success("検索完了");
              setZendeskSearchResults(data);
            }
          }}
        >
          <Search />
          検索実行
        </Button>
        <Button
          className="ml-auto"
          disabled={zendeskSearchResults == null}
          onClick={async () => {
            // 検索結果を全て取得
            const searchResults = await handleZendeskSearchAll(settings[currentSettingNumber]);
            console.log(searchResults);
            
            // コメントを全て取得
            const commentResults = await handleZendeskCommentAll(settings[currentSettingNumber], searchResults);
            console.log(commentResults);
        }}
        >
          <Download />
          CSVダウンロード
        </Button>
      </div>
      {zendeskSearchResults == null ? (
        <div>
          <p>検索結果がありません</p>
        </div>
      ) : "error" in zendeskSearchResults ? (
        <div>
          <p>エラーが発生しました</p>
        </div>
      ) : (
        <ZendeskView
          tickets={zendeskSearchResults}
          currentPage={currentPage}
          onPageChange={async (page) => {
            setCurrentPage(page);
            toast.info(`${page}ページ目を読み込み中...`);
            const { data, error } = await handleZendeskSearch(
              settings[currentSettingNumber],
              page
            );
            if (error || data == null) {
              toast.error(`エラー: ${error}`);
              setZendeskSearchResults(null);
            } else {
              toast.success(`${page}ページ目を取得完了`);
              setZendeskSearchResults(data);
            }
          }}
        />
      )}
    </main>
  );
}
*/

export default App;
