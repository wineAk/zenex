import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Download, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import type { ZendeskSearchResults } from "@/types/zendesk/search";

import { loadStoredSettingId } from "@/lib/current-setting-id";
import { getSetting } from "@/lib/zendesk-settings";
import { getQuery } from "@/lib/zendesk-query";
import { handleZendeskSearch } from "@/lib/zendesk-search";

type ZendeskViewProps = {
  clickHandler: (component: "setting" | "search" | "download") => void;
};

export default function ZendeskView({ clickHandler }: ZendeskViewProps) {
  const currentId = loadStoredSettingId();
  const currentSetting = getSetting(currentId);
  const query = getQuery(0);

  const [tickets, setTickets] = useState<ZendeskSearchResults | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    handleZendeskSearch({
      setting: currentSetting,
      page: currentPage,
      query,
    }).then((result) => {
      if (result.data) {
        setTickets(result.data);
      }
    });
  }, []);

  return (
    <section className="h-full flex flex-col gap-4">
      <Card className="min-h-0 flex-1">
        {tickets ? (
          <>
            <CardHeader>
              <CardTitle>検索結果</CardTitle>
              <CardDescription>
                全<span className="font-bold mx-1">{tickets.count}</span>件中
                <span className="font-bold mx-1">{tickets.results.length}</span>
                件を表示
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-0">
              <ScrollArea className="h-full pr-2">
                <DataTable columns={columns} data={tickets.results} />
              </ScrollArea>
            </CardContent>
            <CardFooter className="mt-auto">
              <DataTablePagination
                count={tickets.count}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
              />
            </CardFooter>
          </>
        ) : (
          <Spinner />
        )}
      </Card>
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={() => clickHandler("setting")}>
          <ArrowLeft />
          戻る
        </Button>
        <Button
          className="w-32"
          disabled={!tickets || tickets.results.length === 0}
          onClick={() => clickHandler("download")}
        >
          <Download />
          ダウンロード
        </Button>
      </div>
    </section>
  );
}

function DataTablePagination({
  count,
  onPageChange,
  currentPage,
}: {
  count: number;
  onPageChange: (page: number) => void;
  currentPage: number;
}) {
  const totalPages = Math.ceil(count / 100);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            isActive={false}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            style={{
              pointerEvents: currentPage === 1 ? "none" : undefined,
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeftIcon />
            <span className="sr-only">前へ</span>
          </PaginationLink>
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => onPageChange(index + 1)}
              isActive={currentPage === index + 1}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            isActive={false}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            style={{
              pointerEvents: currentPage === totalPages ? "none" : undefined,
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRightIcon />
            <span className="sr-only">次へ</span>
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function Spinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-24 h-24 border-8 border-secondary border-t-primary rounded-full animate-spin mt-6" />
    </div>
  );
}
