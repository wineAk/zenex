const itemName = "zendesk-current-query-id";

export function loadStoredQueryId(): number {
  const localSettingId = localStorage.getItem(itemName);
  if (localSettingId) return parseInt(localSettingId);
  return 0;
}

export function saveStoredQueryId(id: number): boolean {
  localStorage.setItem(itemName, id.toString());
  return true;
}