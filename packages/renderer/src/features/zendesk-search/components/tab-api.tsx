import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { SettingsType } from "../lib/settings";

type TabApiProps = {
  settings: SettingsType;
  setSettings: (settings: SettingsType) => void;
};

export default function TabApi({ settings, setSettings }: TabApiProps) {
  const { sub_domain, email, api_token } = settings.api;
  return (
    <Card>
      <ScrollArea className="h-96">
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="sub_domain">サブドメイン</Label>
            <div className="flex items-center gap-2">
            <Input
              id="sub_domain"
              name="sub_domain"
              placeholder="subdomain"
              defaultValue={sub_domain}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  api: { ...settings.api, sub_domain: e.target.value },
                })
              }
            />
            <span>.zendesk.com</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              placeholder="user@example.com"
              defaultValue={email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  api: { ...settings.api, email: e.target.value },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="api_token">APIトークン</Label>
            <Input
              id="api_token"
              name="api_token"
              placeholder="AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
              defaultValue={api_token}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  api: { ...settings.api, api_token: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
