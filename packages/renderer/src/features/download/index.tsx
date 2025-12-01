import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { loadStoredSettingId } from "@/lib/current-setting-id";
import { getSetting } from "@/lib/zendesk-settings";
import { getQuery } from "@/lib/zendesk-query";
import { handleZendeskSearchAll } from "@/lib/zendesk-search";
import { handleZendeskCommentAll, handleZendeskCsv } from "@/lib/zendesk-comment";
import { handleZendeskUser } from "@/lib/zendesk-user";




type ZendeskDownloadProps = {
  clickHandler: (component: "setting" | "search" | "download") => void;
};

export default function ZendeskDownload({ clickHandler }: ZendeskDownloadProps) {
  const currentId = loadStoredSettingId();
  const currentSetting = getSetting(currentId);
  const query = getQuery(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!currentSetting) {
        console.error('設定が見つかりませんでした');
        return;
      }

      // 検索結果を全て取得
      const searchResults = await handleZendeskSearchAll({ setting: currentSetting, query });
      if (!isMounted) return;
      console.log(searchResults);
      
      if (!searchResults || searchResults.length === 0) {
        console.error('検索結果がありませんでした');
        return;
      }

      // コメントを全て取得
      const commentResults = await handleZendeskCommentAll({setting: currentSetting, zendeskResults: searchResults});
      if (!isMounted) return;
      console.log(commentResults);

      // ユーザーを全て取得
      const userPromises = commentResults.map(async (result) => {
        const { requester_id } = result;
        const results = await handleZendeskUser(currentSetting, requester_id);
        const { data } = results;
        const { user } = data;
        return { ...result, user };
      });
      const userResults = await Promise.all(userPromises);
      console.log(userResults);

      // CSVの配列を作成
      const csvArray = handleZendeskCsv({setting: currentSetting, commentResults: userResults});
      console.log(csvArray);

      // CSVをダウンロード
      const csvZendeskKey = btoa("csvZendesk");
      const csvZendesk = (window as any)[csvZendeskKey];
      if (typeof csvZendesk !== "function") {
        toast.error("csvZendeskが見つかりませんでした");
        return;
      }
      const result = await csvZendesk(csvArray);
      if (result.success) {
        toast.success("CSVファイルを保存しました");
      } else {
        toast.error(result.error || "CSVファイルの保存に失敗しました");
      }

    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentSetting, query]);

  return (
    <section className="h-full flex flex-col gap-4">
      <Card className="min-h-0 flex-1">
        <CardHeader>
          <CardTitle>CSVダウンロード</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Download</div>
        </CardContent>
      </Card>
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={() => clickHandler("search")}>
          <ArrowLeft />
          戻る
        </Button>
      </div>
    </section>
  );
}