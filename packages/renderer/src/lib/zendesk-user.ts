import type { SettingType } from "@/lib/zendesk-settings";

export async function handleZendeskUser(setting: SettingType, id: number) {
  const { sub_domain, email, api_token } = setting;
  const auth = btoa(`${email}/token:${api_token}`);
  const header = { Authorization: `Basic ${auth}` };
  const fetchZendeskKey = btoa("fetchZendesk");
  const fetchZendesk = (window as any)[fetchZendeskKey];
  const url = `https://${sub_domain}.zendesk.com/api/v2/users/${id}.json`;
  const result = await fetchZendesk(url, header);
  return result;
}
