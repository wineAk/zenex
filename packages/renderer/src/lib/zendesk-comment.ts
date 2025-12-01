import { toast } from "sonner";

import type { SettingType } from "@/lib/zendesk-settings";
import type { ZendeskCommentType, ZendeskComment } from "@/types/zendesk/comments";
import type { ZendeskResult } from "@/types/zendesk/search";

import { formatUtcToJst } from "@/lib/date-format";
import { getStatusMap, type TicketStatus } from "@/lib/status-map";

type ZendeskCommentParams = {
  setting: SettingType;
  id: number;
}

export async function handleZendeskComment({setting, id}: ZendeskCommentParams): Promise<ZendeskCommentType> {
  const { sub_domain, email, api_token } = setting;
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

type ZendeskCommentAllParams = {
  setting: SettingType;
  zendeskResults: ZendeskResult[];
}

export async function handleZendeskCommentAll({setting, zendeskResults}: ZendeskCommentAllParams): Promise<ZendeskCommentAllResult[]> {
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
      if (!setting) {
        toast.error('設定が見つかりませんでした');
        return { data: null, error: '設定が見つかりませんでした', api: null };
      }

      const { data, error, api } = await handleZendeskComment({setting, id: zendeskResults[currentIndex].id});
      
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

type ZendeskCsvParams = {
  setting: SettingType;
  commentResults: any[];
}

export function handleZendeskCsv({setting, commentResults}: ZendeskCsvParams): string[][] {
  toast.info(`CSVを作成中...`, {
    id: "csv_progress",
  });

  let csvArray: string[][] = [];
  let commentsMaxCount = 0;

  const { sub_domain } = setting;
  commentResults.forEach((result) => {
    const { id, comments, created_at, custom_fields, status, subject } = result;
    // コメントの数を更新
    if (comments.length > commentsMaxCount) commentsMaxCount = comments.length;
    // ROWの配列に必要なデータを取得
    const statusJa = getStatusMap(status as TicketStatus).label;
    const company = custom_fields.find((field: any) => field.id === 1500000377421)?.value;
    const name = custom_fields.find((field: any) => field.id === 1500000377401)?.value;
    const email = result.user.email;
    const createdAtJst = formatUtcToJst(created_at);
    const url = `https://${sub_domain}.zendesk.com/agent/tickets/${id}`;
    const commentsArray = comments.map((comment: any) => comment.body);
    // ROWの配列を作成
    const csvRow = [
      statusJa,
      String(company || ""),
      String(name || ""),
      email,
      subject,
      createdAtJst,
      url,
      ...commentsArray,
    ];
    csvArray.push(csvRow);
  });

  // ヘッダーを追加
  const commentArray = Array.from({ length: commentsMaxCount }, (_, index) => `コメント ${index + 1}`);
  const csvHeader = ["ステータス", "会社名", "名前", "メールアドレス", "件名", "作成日", "URL", ...commentArray];
  csvArray.unshift(csvHeader);

  // 各行の長さを統一
  const headerLength = csvHeader.length;
  csvArray = csvArray.map(row => {
    const paddedRow = Array.from({ length: headerLength }, (_, i) => row[i] || "");
    return paddedRow;
  });

  return csvArray;
}
