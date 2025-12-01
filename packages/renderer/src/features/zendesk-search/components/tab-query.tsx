import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import DateMenu from "@/features/setting/components/date-menu";
import DatePicker from "@/features/setting/components/date-picker";
import MultiSelect from "@/features/setting/components/status-select";
import type { SettingsType } from "../lib/settings";

import { getFirstDayOfMonthYMD, getTodayYMD } from "@/lib/date-format";
import { getStatusList } from "@/lib/status-map";

type TabQueryProps = {
  settings: SettingsType;
  setSettings: (settings: SettingsType) => void;
};

export default function TabQuery({ settings, setSettings }: TabQueryProps) {
  const statusList = getStatusList();
  const selectList = statusList.map((status) => ({
    label: status.label,
    value: status.key,
    color: status.color,
  }));

  return (
    <Card>
      <ScrollArea className="h-96">
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="status">ステータス</Label>
            <MultiSelect
              options={selectList}
              onValueChange={(value) => {
                setSettings({
                  ...settings,
                  query: {
                    ...settings.query,
                    status: value,
                  },
                });
              }}
              defaultValue={settings.query.status}
              placeholder="ステータスを選んでください"
              variant="inverted"
              animation={2}
              maxCount={30}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">件名</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="例: インポート方法"
              defaultValue={settings.query.subject}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  query: {
                    ...settings.query,
                    subject: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">本文</Label>
            <Input
              id="description"
              name="description"
              placeholder="例: CSV 一括登録 方法"
              defaultValue={settings.query.description}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  query: {
                    ...settings.query,
                    description: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>作成日</Label>
              <DateMenu
                onClick={(start, end) => {
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      created: { start, end },
                    },
                  });
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                id="created-start"
                value={settings.query.created.start}
                placeholder={getFirstDayOfMonthYMD()}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      created: {
                        start: value,
                        end: settings.query.created.end,
                      },
                    },
                  })
                }
              />
              <span>～</span>
              <DatePicker
                id="created-end"
                value={settings.query.created.end}
                placeholder={getTodayYMD()}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      created: {
                        start: settings.query.created.start,
                        end: value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>更新日</Label>
              <DateMenu
                onClick={(start, end) => {
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      updated: { start, end },
                    },
                  });
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                id="updated-start"
                value={settings.query.updated.start}
                placeholder={getFirstDayOfMonthYMD()}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      updated: {
                        start: value,
                        end: settings.query.updated.end,
                      },
                    },
                  })
                }
              />
              <span>～</span>
              <DatePicker
                id="updated-end"
                value={settings.query.updated.end}
                placeholder={getTodayYMD()}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      updated: {
                        start: settings.query.updated.start,
                        end: value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>解決日</Label>
              <DateMenu
                onClick={(start, end) => {
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      solved: { start, end },
                    },
                  });
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                id="solved-start"
                value={settings.query.solved.start}
                placeholder={getFirstDayOfMonthYMD()}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      solved: {
                        start: value,
                        end: settings.query.solved.end,
                      },
                    },
                  })
                }
              />
              <span>～</span>
              <DatePicker
                id="solved-end"
                value={settings.query.solved.end}
                placeholder={getTodayYMD()}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    query: {
                      ...settings.query,
                      solved: {
                        start: settings.query.solved.start,
                        end: value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
