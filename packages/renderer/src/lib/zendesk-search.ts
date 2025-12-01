import { toast } from "sonner";

import type { SettingType } from "@/lib/zendesk-settings";
import type {
  ZendeskResult,
  ZendeskSearchType,
} from "@/types/zendesk/search";
import type { QueryType } from "@/lib/zendesk-query";
import { formatJstToUtc } from "@/lib/date-format";

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

type ZendeskSearchParams = {
  setting: SettingType;
  page: number;
  query: QueryType;
};

export async function handleZendeskSearch({
  setting,
  page,
  query,
}: ZendeskSearchParams): Promise<ZendeskSearchType> {
  const fetchZendeskKey = btoa("fetchZendesk");
  const fetchZendesk = (window as any)[fetchZendeskKey];
  if (typeof fetchZendesk !== "function") {
    toast.error("fetchZendeskが見つかりませんでした");
    return { error: "fetchZendeskが見つかりませんでした" };
  }
  const { sub_domain, email, api_token } = setting;
  const auth = btoa(`${email}/token:${api_token}`);
  const header = { Authorization: `Basic ${auth}` };
  const queryString = () => {
    const {
      created,
      updated,
      solved,
      subject,
      description,
      status,
      requester,
    } = query;
    const statusStr = status.map((status) => `status:${status}`).join(" ");
    const requesterStr = requester.length > 0 ? `requester:${requester}` : "";
    const subjectStr = subject
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0) // 空文字を除外
      .map((term) => {
        if (term.startsWith("-")) {
          const word = term.slice(1); // `-` を除去
          return `-subject:"${word}"`; // 除外検索
        } else {
          return `subject:"${term}"`; // 通常のAND検索
        }
      })
      .join(" ");
    const descriptionStr = description
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0) // 空文字を除外
      .map((term) => {
        if (term.startsWith("-")) {
          const word = term.slice(1); // `-` を除去
          return `-description:"${word}"`; // 除外検索
        } else {
          return `description:"${term}"`; // 通常のAND検索
        }
      })
      .join(" ");
    const createdStr = buildDateRangeQuery("created", created);
    const updatedStr = buildDateRangeQuery("updated", updated);
    const solvedStr = buildDateRangeQuery("solved", solved);
    const queryStr = [
      "type:ticket",
      statusStr,
      requesterStr,
      subjectStr,
      descriptionStr,
      createdStr,
      updatedStr,
      solvedStr,
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    return queryStr;
  };
  const url = `https://${sub_domain}.zendesk.com/api/v2/search.json?page=${page}&query=${queryString()}`;
  console.log("👘 - zendesk-search.ts - handleZendeskSearch - url:", url);
  const result = await fetchZendesk(url, header);
  return result;
}

type ZendeskSearchAllParams = {
  setting: SettingType;
  query: QueryType;
};

// 検索結果を全て取得
export async function handleZendeskSearchAll({
  setting,
  query,
}: ZendeskSearchAllParams): Promise<ZendeskResult[]> {
  let allResults: ZendeskResult[] = [];
  let page = 1;

  while (true) {
    toast.info(`${page}ページ目を取得中...`, {
      id: "page_list_progress",
    });

    // APIの残数チェック
    const checkApiLimit = async (api: any) => {
      if (api?.remaining && Number(api.remaining) <= 10) {
        toast.warning(
          `APIの残数が少ないため、1分間待機します... (残り: ${api.remaining})`
        );
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
    };

    // ページ取得（エラー時は1分待機して再試行）
    const fetchPage = async () => {
      const { data, error, api } = await handleZendeskSearch({
        setting,
        page,
        query,
      });
      if (error || data == null) {
        toast.warning(
          `${page}ページ目の取得に失敗しました。1分後に再試行します...`
        );
        await new Promise((resolve) => setTimeout(resolve, 60000));
        return fetchPage();
      }
      await checkApiLimit(api);
      return { data, api };
    };

    const { data } = await fetchPage();
    allResults = allResults.concat(data?.results || []);
    // 次のページがない場合は終了
    if (!data?.next_page) break;
    page++;
  }

  return allResults;
}
