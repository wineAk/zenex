// 今日の日付を YYYY/MM/DD で返す
export function getTodayYMD(): string {
  return formatDateToYMD(new Date());
}

// ｎ月前の1日を YYYY/MM/DD で返す
export function getFirstDayOfMonthYMD(n = 0): string {
  const now = new Date();
  // ｎ月前にする
  now.setMonth(now.getMonth() - n);
  // 1日にするとn月1日になる
  now.setDate(1);
  return formatDateToYMD(new Date(now));
}

// ｎ月前の最終日を YYYY/MM/DD で返す
export function getLastDayOfMonthYMD(n = 0): string {
  const now = new Date();
  // ｎ月前の翌月にする
  now.setMonth(now.getMonth() - n + 1);
  // 0日にするとn月末日になる
  now.setDate(0);
  return formatDateToYMD(new Date(now));
}

// 日付を YYYY/MM/DD に整形
export function formatDateToYMD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

// JST形式の "YYYY/MM/DD" に "00:00:00 or 23:59:59" をつけて UTC形式に変換
export function formatJstToUtc(ymd: string, time: "start" | "end"): string {
  // JST: 2025/06/10 00:00:00 or 2025/06/10 23:59:59
  const dateStr = ymd + (time === "start" ? " 00:00:00" : " 23:59:59");
  const dateUTC = new Date(dateStr);
  // UTC: 2025-06-10T15:00:00.000Z or 2025-06-10T14:59:59.000Z
  return dateUTC.toISOString();
}

// UTC形式のISO文字列を JST形式の "YYYY/MM/DD HH:MM" に変換
export function formatUtcToJst(utcStr: string): string {
  const date = new Date(utcStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}
