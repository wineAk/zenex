import { Badge } from "@/components/ui/badge";

type TicketStatus = "new" | "open" | "pending" | "hold" | "solved" | "closed";

type StatusInfo = {
  label: string;
  color: string;
};

const statusMap: Record<TicketStatus, StatusInfo> = {
  new: {
    label: "新規",
    color: "bg-orange-400 text-orange-950",
  },
  open: {
    label: "オープン",
    color: "bg-red-800 text-red-100",
  },
  pending: {
    label: "保留中",
    color: "bg-blue-900 text-blue-100",
  },
  hold: {
    label: "待機中",
    color: "bg-neutral-900 text-slate-100",
  },
  solved: {
    label: "解決済み",
    color: "bg-neutral-500 text-stone-100",
  },
  closed: {
    label: "解決済み",
    color: "bg-neutral-500 text-stone-100",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const statusInfo = statusMap[status as TicketStatus];
  return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
}
