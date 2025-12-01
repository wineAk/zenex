import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { SettingType } from "@/lib/zendesk-settings";

type TabApiProps = {
  setting: SettingType;
  changeSetting: (
    setting: SettingType,
    action: "add" | "update" | "delete"
  ) => void;
};

export default function TabApi({ setting, changeSetting }: TabApiProps) {
  const { sub_domain, email, api_token } = setting;

  const [subDomainError, setSubDomainError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [apiTokenError, setApiTokenError] = useState<string | null>(null);

  return (
    <Card>
      <ScrollArea className="h-[calc(100vh-var(--spacing)*56)]">
        <CardContent className="pb-2 grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="sub_domain">サブドメイン</Label>
            <div className="flex items-center gap-2">
              <Input
                id="sub_domain"
                name="sub_domain"
                placeholder="subdomain"
                defaultValue={sub_domain}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length < 1) {
                    setSubDomainError("サブドメインを入力してください");
                  } else if (!/^[a-z0-9]+$/.test(value)) {
                    setSubDomainError("小文字の英数字のみで入力してください");
                  } else {
                    setSubDomainError(null);
                    const newSetting = {
                      ...setting,
                      sub_domain: value,
                    };
                    changeSetting(newSetting, "update");
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
              defaultValue={email}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length < 1) {
                  setEmailError("メールアドレスを入力してください");
                } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                  setEmailError("有効なメールアドレスを入力してください");
                } else {
                  setEmailError(null);
                  const newSetting = {
                    ...setting,
                    email: value,
                  };
                  changeSetting(newSetting, "update");
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
              defaultValue={api_token}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length < 1) {
                  setApiTokenError("APIトークンを入力してください");
                } else {
                  setApiTokenError(null);
                  const newSetting = {
                    ...setting,
                    api_token: value,
                  };
                  changeSetting(newSetting, "update");
                }
              }}
            />
            {apiTokenError && <p className="text-red-500">{apiTokenError}</p>}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
