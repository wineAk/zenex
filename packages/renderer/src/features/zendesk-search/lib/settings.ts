import { getFirstDayOfMonthYMD, getTodayYMD } from "@/lib/date-format";

// https://support.zendesk.com/hc/en-us/articles/4408886879258
// https://support.zendesk.com/hc/ja/articles/4408882086298
const defaultSettingsObject = {
  name: "設定 1",
  api: {
    sub_domain: "",
    email: "",
    api_token: "",
  },
  query: {
    // チケットが作成された日付または日時
    // created:2011-05-01
    // created>2014-08-01T10:30:00Z created<2014-08-01T12:00:00Z
    created: {
      start: getFirstDayOfMonthYMD(),
      end: getTodayYMD(),
    },
    // チケットが最後に更新された日付
    // updated>2011-05-15
    updated: {
      start: "",
      end: "",
    },
    // チケットが「解決済み」に設定された日付
    // solved<2011-06-01
    solved: {
      start: "",
      end: "",
    },
    // チケットの件名のテキスト
    // subject:"upgrade account"
    subject: "",
    // チケットの説明およびコメント内のテキスト
    // description:defective
    description: "",
    // 指定できる値：new、open、pending、hold、solved、closed
    // status:open
    // status<closed
    status: ["new", "open"],
  },
};
const defaultSettingsArray = [defaultSettingsObject];

export function getSettings() {
  const savedSettings = localStorage.getItem("zendesk-settings");
  if (savedSettings) return JSON.parse(savedSettings);
  return JSON.parse(JSON.stringify(defaultSettingsArray));
}

export function getDefaultSettings() {
  return JSON.parse(JSON.stringify(defaultSettingsObject));
}

export type SettingsType = typeof defaultSettingsObject;
export type SettingsTypes = SettingsType[];
