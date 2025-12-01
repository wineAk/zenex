import { useState } from "react";

import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import DateMenu from "./date-menu";
import DatePicker from "./date-picker";
import MultiSelect from "./status-select";
import SelectQueryTags from "./select-query-tags";

import { getFirstDayOfMonthYMD, getTodayYMD } from "@/lib/date-format";
import { getStatusList } from "@/lib/status-map";
import type { QueryType } from "@/lib/zendesk-query";
import { loadStoredSettingId } from "@/lib/current-setting-id";
import { getSetting } from "@/lib/zendesk-settings";

async function handleZendeskTags() {
  const fetchZendeskKey = btoa("fetchZendesk");
  const fetchZendesk = (window as any)[fetchZendeskKey];
  if (typeof fetchZendesk !== "function") {
    toast.error("fetchZendeskが見つかりませんでした");
    return { error: "fetchZendeskが見つかりませんでした" };
  }
  const currentId = loadStoredSettingId();
  const currentSetting = getSetting(currentId);
  const { sub_domain, email, api_token } = currentSetting;
  const auth = btoa(`${email}/token:${api_token}`);
  const header = { Authorization: `Basic ${auth}` };
  const response = await fetchZendesk(
    `https://${sub_domain}.zendesk.com/api/v2/tags.json`,
    header
  );
  const tags = response.data.tags;
  return tags.map((tag: any) => tag.name);
}

async function handleZendeskCustomFields() {
  const fetchZendeskKey = btoa("fetchZendesk");
  const fetchZendesk = (window as any)[fetchZendeskKey];
  if (typeof fetchZendesk !== "function") {
    toast.error("fetchZendeskが見つかりませんでした");
    return { error: "fetchZendeskが見つかりませんでした" };
  }
  const currentId = loadStoredSettingId();
  const currentSetting = getSetting(currentId);
  const { sub_domain, email, api_token } = currentSetting;
  const auth = btoa(`${email}/token:${api_token}`);
  const header = { Authorization: `Basic ${auth}` };
  const response = await fetchZendesk(
    `https://${sub_domain}.zendesk.com/api/v2/ticket_fields.json`,
    header
  );
  const customFields = response.data.ticket_fields;
  return customFields;
}

type TabQueryProps = {
  query: QueryType;
  changeQuery: (query: QueryType, action: "add" | "update" | "delete") => void;
};

export default function TabQuery({ query, changeQuery }: TabQueryProps) {
  // タグを保持
  const [tags, setTags] = useState<string[]>([]);
  // カスタムフィールドを保持
  const [customFields, setCustomFields] = useState<any[]>([]);

  const statusList = getStatusList();
  const selectList = statusList.map((status) => ({
    label: status.label,
    value: status.key,
    color: status.color,
  }));

  return (
    <Card className="min-h-0 flex-1 flex flex-col gap-4">
      <ScrollArea className="h-full">
        <CardContent className="pb-2 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="status">ステータス</Label>
            <MultiSelect
              options={selectList}
              onValueChange={(value) => {
                changeQuery(
                  {
                    ...query,
                    status: value,
                  },
                  "update"
                );
              }}
              defaultValue={query.status}
              placeholder="ステータスを選んでください"
              variant="inverted"
              animation={2}
              maxCount={30}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="requester">メールアドレス</Label>
            <Input
              id="requester"
              name="requester"
              placeholder="例: user@example.com"
              defaultValue={query.requester}
              onChange={(e) =>
                changeQuery(
                  {
                    ...query,
                    requester: e.target.value,
                  },
                  "update"
                )
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">件名</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="例: インポート方法"
              defaultValue={query.subject}
              onChange={(e) =>
                changeQuery(
                  {
                    ...query,
                    subject: e.target.value,
                  },
                  "update"
                )
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">本文</Label>
            <Input
              id="description"
              name="description"
              placeholder="例: CSV 一括登録 方法"
              defaultValue={query.description}
              onChange={(e) =>
                changeQuery(
                  {
                    ...query,
                    description: e.target.value,
                  },
                  "update"
                )
              }
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>作成日</Label>
              <DateMenu
                onClick={(start, end) => {
                  changeQuery(
                    {
                      ...query,
                      created: { start, end },
                    },
                    "update"
                  );
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                id="created-start"
                value={query.created.start}
                placeholder={getFirstDayOfMonthYMD()}
                onChange={(value) =>
                  changeQuery(
                    {
                      ...query,
                      created: {
                        start: value,
                        end: query.created.end,
                      },
                    },
                    "update"
                  )
                }
              />
              <span>～</span>
              <DatePicker
                id="created-end"
                value={query.created.end}
                placeholder={getTodayYMD()}
                onChange={(value) =>
                  changeQuery(
                    {
                      ...query,
                      created: {
                        start: query.created.start,
                        end: value,
                      },
                    },
                    "update"
                  )
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>更新日</Label>
              <DateMenu
                onClick={(start, end) => {
                  changeQuery(
                    {
                      ...query,
                      updated: { start, end },
                    },
                    "update"
                  );
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                id="updated-start"
                value={query.updated.start}
                placeholder={getFirstDayOfMonthYMD()}
                onChange={(value) =>
                  changeQuery(
                    {
                      ...query,
                      updated: {
                        start: value,
                        end: query.updated.end,
                      },
                    },
                    "update"
                  )
                }
              />
              <span>～</span>
              <DatePicker
                id="updated-end"
                value={query.updated.end}
                placeholder={getTodayYMD()}
                onChange={(value) =>
                  changeQuery(
                    {
                      ...query,
                      updated: {
                        start: query.updated.start,
                        end: value,
                      },
                    },
                    "update"
                  )
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>解決日</Label>
              <DateMenu
                onClick={(start, end) => {
                  changeQuery(
                    {
                      ...query,
                      solved: { start, end },
                    },
                    "update"
                  );
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                id="solved-start"
                value={query.solved.start}
                placeholder={getFirstDayOfMonthYMD()}
                onChange={(value) =>
                  changeQuery(
                    {
                      ...query,
                      solved: {
                        start: value,
                        end: query.solved.end,
                      },
                    },
                    "update"
                  )
                }
              />
              <span>～</span>
              <DatePicker
                id="solved-end"
                value={query.solved.end}
                placeholder={getTodayYMD()}
                onChange={(value) =>
                  changeQuery(
                    {
                      ...query,
                      solved: {
                        start: query.solved.start,
                        end: value,
                      },
                    },
                    "update"
                  )
                }
              />
            </div>
          </div>
          <hr />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                // タグを取得
                // https://helpworks.zendesk.com/api/v2/tags.json
                const tagArray = await handleZendeskTags();
                setTags(tagArray);
                // タグ / カスタムフィールド を取得
                // https://helpworks.zendesk.com/api/v2/ticket_fields.json
                const customFieldArray = await handleZendeskCustomFields();
                console.log(
                  "👘 - tab-query.tsx - <Buttonvariant - customFieldArray:",
                  customFieldArray
                );
                setCustomFields(customFieldArray);
              }}
            >
              <RefreshCcw />
              タグ / カスタムフィールド を取得
            </Button>
          </div>
          <h2>タグ</h2>
          <div className="grid gap-2">
            <SelectQueryTags
              options={tags}
              onValueChange={(values) => {
                changeQuery(
                  {
                    ...query,
                    tags: values,
                  },
                  "update"
                );
              }}
            />
          </div>
          <h2>カスタムフィールド</h2>
          {customFields.map((customField) => {
            const { id, title, type } = customField;
            return (
              <div key={id} className="grid gap-2">
                <Label>{title}</Label>
                <Input id={id} name={id} placeholder={type} />
              </div>
            );
          })}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
