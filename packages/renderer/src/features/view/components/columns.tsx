import type { ColumnDef } from "@tanstack/react-table";
import type { ZendeskResult } from "@/types/zendesk/search";
import { formatUtcToJst } from "@/lib/date-format";
import StatusBadge from "./status-badge";

export const columns: ColumnDef<ZendeskResult>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id; 
      const url = `https://helpworks.zendesk.com/agent/tickets/${id}`;
      return <a
       href={url} 
       target="_blank"
       className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      >{id}</a>;
    },
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: "created_at",
    header: "作成日時",
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div>{formatUtcToJst(createdAt)}</div>;
    },
  },
  {
    accessorKey: "subject",
    header: "件名",
  },
  {
    accessorKey: "requester_company",
    header: "会社名",
    cell: ({ row }) => {
      const fields = row.original.fields;
      const requesterCompany = fields.find((field) => field.id === 1500000377421)?.value;
      return <div>{requesterCompany}</div>;
    },
  },
  {
    accessorKey: "requester_name",
    header: "名前",
    cell: ({ row }) => {
      const fields = row.original.fields;
      const requesterName = fields.find((field) => field.id === 1500000377401)?.value;
      return <div>{requesterName}</div>;
    },
  },
];
