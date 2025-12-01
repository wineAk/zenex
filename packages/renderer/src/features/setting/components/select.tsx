import { useState, useMemo } from "react";
import { OctagonAlert, Plus, Trash, Pencil } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getDefaultSetting, type SettingType } from "@/lib/zendesk-settings";

type ZendeskSelectProps = {
  settings: SettingType[];
  changeSetting: (
    setting: SettingType,
    action: "add" | "update" | "delete"
  ) => void;
  currentId: number;
  changeSettingId: (number: number) => void;
};

export default function ZendeskSelect({
  settings,
  changeSetting,
  currentId,
  changeSettingId,
}: ZendeskSelectProps) {
  // バリデーションエラー管理
  const [nameError, setNameError] = useState<string | null>(null);
  const [subDomainError, setSubDomainError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [apiTokenError, setApiTokenError] = useState<string | null>(null);

  // 選択中の設定をpropsから取得
  const currentSetting = useMemo(
    () => settings.find((setting) => setting.id === currentId) || settings[0],
    [settings, currentId]
  );

  // 最後のIDを取得
  const lastId = useMemo(() => Math.max(...settings.map((setting) => setting.id)), [settings]);

  // 設定追加ハンドラ
  const handleAdd = () => {
    const newId = lastId + 1;
    const newSetting = { ...getDefaultSetting(), name: `設定 ${newId}`, id: newId };
    changeSetting(newSetting, "add");
    changeSettingId(newId);
  };

  // 設定編集ハンドラ
  const handleEdit = (field: keyof SettingType, value: string) => {
    const newSetting = { ...currentSetting, [field]: value };
    changeSetting(newSetting, "update");
  };

  // 設定削除ハンドラ
  const handleDelete = () => {
    changeSetting(currentSetting, "delete");
    changeSettingId(0);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentSetting.id.toString()}
        onValueChange={(value) => {
          const id = parseInt(value);
          changeSettingId(id);
        }}
      >
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder="設定を選択" />
        </SelectTrigger>
        <SelectContent>
          {settings.map((setting) => (
            <SelectItem
              key={setting.id}
              value={setting.id.toString()}
              className="cursor-pointer"
            >
              {setting.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button className="cursor-pointer" variant="outline" onClick={handleAdd} disabled={true}>
        <Plus />
        追加
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" variant="outline">
            <Pencil />
            編集
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>設定を編集</DialogTitle>
            <DialogDescription>設定を編集してください。</DialogDescription>
          </DialogHeader>
          <ScrollArea className="min-h-0 flex-1 flex flex-col gap-4">
            <div className="p-2 pr-6 pb-6 grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">設定名</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="サポート用"
                  defaultValue={currentSetting.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length < 1) {
                      setNameError("設定名を入力してください");
                      return;
                    } else {
                      setNameError(null);
                      handleEdit("name", value);
                    }
                  }}
                />
                {nameError && <p className="text-sm text-red-500">{nameError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sub_domain">サブドメイン</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="sub_domain"
                    name="sub_domain"
                    placeholder="subdomain"
                    defaultValue={currentSetting.sub_domain}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length < 1) {
                        setSubDomainError("サブドメインを入力してください");
                      } else if (!/^[a-z0-9]+$/.test(value)) {
                        setSubDomainError("小文字の英数字のみで入力してください");
                      } else {
                        setSubDomainError(null);
                        handleEdit("sub_domain", value);
                      }
                    }}
                  />
                  <span>.zendesk.com</span>
                </div>
                {subDomainError && <p className="text-red-500">{subDomainError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="user@example.com"
                  defaultValue={currentSetting.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length < 1) {
                      setEmailError("メールアドレスを入力してください");
                    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                      setEmailError("有効なメールアドレスを入力してください");
                    } else {
                      setEmailError(null);
                      handleEdit("email", value);
                    }
                  }}
                />
                {emailError && <p className="text-red-500">{emailError}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api_token">APIトークン</Label>
                <Input
                  id="api_token"
                  name="api_token"
                  placeholder="AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
                  defaultValue={currentSetting.api_token}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length < 1) {
                      setApiTokenError("APIトークンを入力してください");
                    } else {
                      setApiTokenError(null);
                      handleEdit("api_token", value);
                    }
                  }}
                />
                {apiTokenError && <p className="text-red-500">{apiTokenError}</p>}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="cursor-pointer"
            variant="destructive"
            disabled={settings.length === 1}
          >
            <Trash />
            削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center">
            <AlertDialogTitle>
              <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <OctagonAlert className="h-7 w-7 text-destructive" />
              </div>
              設定を削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-center">
              この設定を削除すると、この設定に関連するすべてのデータが削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
