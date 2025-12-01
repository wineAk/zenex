export type SettingType = typeof defaultSettingObject;
export type SettingTypes = SettingType[];

const itemName = "zendesk-settings";
const defaultSettingObject = {
  id: 0,
  name: "API設定",
  sub_domain: "",
  email: "",
  api_token: "",
}

export function getDefaultSetting(): SettingType {
  return JSON.parse(JSON.stringify(defaultSettingObject));
}

export function getSetting(id: number): SettingType {
  const localSettings = localStorage.getItem(itemName);
  if (localSettings) {
    const settings = JSON.parse(localSettings);
    const setting = settings.find((setting: SettingType) => setting.id === id);
    if (setting) return setting;
  }
  const defaultSetting = getDefaultSetting();
  setSetting(defaultSetting.id, defaultSetting);
  return defaultSetting;
}

export function getSettings(): SettingTypes {
  const localSettings = localStorage.getItem(itemName);
  if (localSettings) {
    return JSON.parse(localSettings);
  } else {
    const defaultSetting = getDefaultSetting();
    setSetting(defaultSetting.id, defaultSetting);
    return [defaultSetting];
  }
}

export function setSetting(id: number, setting: SettingType): boolean {
  const localSettings = localStorage.getItem(itemName);
  if (localSettings) {
    const settings = JSON.parse(localSettings);
    const index = settings.findIndex((setting: SettingType) => setting.id === id);
    if (index !== -1) {
      settings[index] = setting;
    } else {
      settings.push(setting);
    }
    localStorage.setItem(itemName, JSON.stringify(settings));
    return true;
  } else {
    localStorage.setItem(itemName, JSON.stringify([setting]));
    return true;
  }
}

export function deleteSetting(id: number): boolean {
  const localSettings = localStorage.getItem(itemName);
  if (localSettings) {
    const settings = JSON.parse(localSettings);
    const index = settings.findIndex((setting: SettingType) => setting.id === id);
    if (index !== -1) {
      settings.splice(index, 1);
    }
    localStorage.setItem(itemName, JSON.stringify(settings));
    return true;
  }
  return false;
}