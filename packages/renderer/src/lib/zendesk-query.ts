import { getFirstDayOfMonthYMD, getTodayYMD } from "@/lib/date-format";

export type QueryType = typeof defaultQueryObject;
export type QueryTypes = QueryType[];

const itemName = "zendesk-query";
// https://support.zendesk.com/hc/ja/articles/4408882086298
const defaultQueryObject = {
  id: 0,
  name: "検索設定",
  // 指定できる値：new、open、pending、hold、solved、closed
  // status:open
  // status<closed
  status: ["new", "open"],
  // チケットのリクエスタ
  // 「none」、「me」、ユーザー名（フルネームまたは一部）、メールアドレス、ユーザーID、または電話番号を指定できます
  requester: "",
  // チケットの件名のテキスト
  // subject:"upgrade account"
  subject: "",
  // チケットの説明およびコメント内のテキスト
  // description:defective
  description: "",
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
  // チケットのタグ
  tags: [""],
  // チケットのカスタムフィールド
  customFields: [""], // カスタムフィールドはまだ未実装
}

export function getDefaultQuery(): QueryType {
  return JSON.parse(JSON.stringify(defaultQueryObject));
}

export function getQuery(id: number): QueryType {
  const localQueries = localStorage.getItem(itemName);
  if (localQueries) {
    const queries = JSON.parse(localQueries);
    const query = queries.find((query: QueryType) => query.id === id);
    if (query) return query;
  }
  const defaultQuery = getDefaultQuery();
  setQuery(defaultQuery.id, defaultQuery);
  return defaultQuery;
}

export function getQueries(): QueryTypes {
  const localQueries = localStorage.getItem(itemName);
  if (localQueries) {
    return JSON.parse(localQueries);
  } else {
    const defaultQuery = getDefaultQuery();
    setQuery(defaultQuery.id, defaultQuery);
    return [defaultQuery];
  }
}

export function setQuery(id: number, query: QueryType): boolean {
  const localQueries = localStorage.getItem(itemName);
  if (localQueries) {
    const queries = JSON.parse(localQueries);
    const index = queries.findIndex((query: QueryType) => query.id === id);
    if (index !== -1) {
      queries[index] = query;
    } else {
      queries.push(query);
    }
    localStorage.setItem(itemName, JSON.stringify(queries));
    return true;
  } else {
    localStorage.setItem(itemName, JSON.stringify([query]));
    return true;
  }
}

export function deleteQuery(id: number): boolean {
  const localQueries = localStorage.getItem(itemName);
  if (localQueries) {
    const queries = JSON.parse(localQueries);
    const index = queries.findIndex((query: QueryType) => query.id === id);
    if (index !== -1) {
      queries.splice(index, 1);
    }
    localStorage.setItem(itemName, JSON.stringify(queries));
    return true;
  }
  return false;
}