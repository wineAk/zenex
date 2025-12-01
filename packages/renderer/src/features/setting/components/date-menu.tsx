import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getFirstDayOfMonthYMD, getLastDayOfMonthYMD } from "@/lib/date-format";

const lists = [
  {
    label: "未選択",
    start: "",
    end: "",
  },
  {
    label: "separator",
    start: "",
    end: "",
  },
  {
    label: "今月",
    start: getFirstDayOfMonthYMD(),
    end: getLastDayOfMonthYMD(),
  },
  {
    label: "先月",
    start: getFirstDayOfMonthYMD(1),
    end: getLastDayOfMonthYMD(1),
  },
  {
    label: "先々月",
    start: getFirstDayOfMonthYMD(2),
    end: getLastDayOfMonthYMD(2),
  },
];

type DateMenuProps = {
  onClick: (start: string, end: string) => void;
};

export default function DateMenu({ onClick }: DateMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="p-0 h-3.5 w-7 rounded-xl cursor-pointer"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {lists.map((list, index) =>
          list.label === "separator" ? (
            <DropdownMenuSeparator key={index} />
          ) : (
            <DropdownMenuItem
              key={index}
              className="cursor-pointer"
              onSelect={(_) => {
                onClick(list.start, list.end);
              }}
            >
              {list.label}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
