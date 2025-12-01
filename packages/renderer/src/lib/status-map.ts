export type TicketStatus = "new" | "open" | "pending" | "hold" | "solved" | "closed";

type StatusMap = {
  label: string;
  color: {
    bg: string;
    text: string;
    border: string;
  };
};

const statusMap: Record<TicketStatus, StatusMap> = {
  new: {
    label: "新規",
    color: {
      bg: "bg-orange-400",
      text: "text-orange-950",
      border: "border-orange-950",
    },
  },
  open: {
    label: "オープン",
    color: {
      bg: "bg-red-800",
      text: "text-red-100",
      border: "border-red-100",
    },
  },
  pending: {
    label: "保留中",
    color: {
      bg: "bg-blue-900",
      text: "text-blue-100",
      border: "border-blue-100",
    },
  },
  hold: {
    label: "待機中",
    color: {
      bg: "bg-neutral-900",
      text: "text-slate-100",
      border: "border-slate-100",
    },
  },
  solved: {
    label: "解決済み",
    color: {
      bg: "bg-neutral-500",
      text: "text-stone-100",
      border: "border-stone-100",
    },
  },
  closed: {
    label: "終了済み",
    color: {
      bg: "bg-neutral-500",
      text: "text-stone-100",
      border: "border-stone-100",
    },
  },
};

export function getStatusList() {
  const list = Object.entries(statusMap).map(([key, value]) => ({
    key,
    label: value.label,
    color: value.color,
  }));
  return list;
}

export function getStatusMap(status: TicketStatus): StatusMap {
  return statusMap[status];
}