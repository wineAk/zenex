const itemName = "zendesk-current-setting-id";

export function loadStoredSettingId(): number {
  const localSettingId = localStorage.getItem(itemName);
  if (localSettingId) return parseInt(localSettingId);
  return 0;
}

export function saveStoredSettingId(id: number): boolean {
  localStorage.setItem(itemName, id.toString());
  return true;
}