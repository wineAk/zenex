import type {AppInitConfig} from './AppInitConfig.js';
import {createModuleRunner} from './ModuleRunner.js';
import {disallowMultipleAppInstance} from './modules/SingleInstanceApp.js';
import {createWindowManagerModule} from './modules/WindowManager.js';
import {terminateAppOnLastWindowClose} from './modules/ApplicationTerminatorOnLastWindowClose.js';
import {hardwareAccelerationMode} from './modules/HardwareAccelerationModule.js';
import {autoUpdater} from './modules/AutoUpdater.js';
import {allowInternalOrigins} from './modules/BlockNotAllowdOrigins.js';
import {allowExternalUrls} from './modules/ExternalUrls.js';
import { ipcMain, dialog } from 'electron';
import pkg from 'papaparse';
const { unparse } = pkg;
import { writeFile } from 'fs/promises';


export async function initApp(initConfig: AppInitConfig) {
  const moduleRunner = createModuleRunner()
    .init(createWindowManagerModule({initConfig, openDevTools: import.meta.env.DEV}))
    .init(disallowMultipleAppInstance())
    .init(terminateAppOnLastWindowClose())
    .init(hardwareAccelerationMode({enable: false}))
    .init(autoUpdater())

    // Install DevTools extension if needed
    // .init(chromeDevToolsExtension({extension: 'VUEJS3_DEVTOOLS'}))

    // Security
    .init(allowInternalOrigins(
      new Set(initConfig.renderer instanceof URL ? [initConfig.renderer.origin] : []),
    ))
    .init(allowExternalUrls(
      new Set(
        initConfig.renderer instanceof URL
          ? [
            'https://vite.dev',
            'https://developer.mozilla.org',
            'https://solidjs.com',
            'https://qwik.dev',
            'https://lit.dev',
            'https://react.dev',
            'https://preactjs.com',
            'https://www.typescriptlang.org',
            'https://vuejs.org',
            /^https?:\/\/.+\.zendesk\.com$/,
          ]
          : [],
      )),
    );

  await moduleRunner;

  // Zendesk APIリクエスト用IPCハンドラ
  ipcMain.handle('zendesk:fetch', async (event, url, header) => {
    try {
      const response = await fetch(url, {headers: header});
      const rateLimit = response.headers.get("X-Rate-Limit");
      const remaining = response.headers.get("X-Rate-Limit-Remaining");
      const retryAfter = response.headers.get("Retry-After");

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        const text = await response.text();
        console.error("Error Response:", text);
        return { 
          error: `API Error: ${response.status} ${response.statusText}`,
          api: { rateLimit, remaining, retryAfter }
        };
      }

      // レスポンスのContent-Typeをチェック
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Invalid Content-Type:", contentType);
        console.error("Response Text:", text);
        return { 
          error: "Invalid response format: Expected JSON",
          api: { rateLimit, remaining, retryAfter }
        };
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("JSON Parse Error:", jsonErr);
        return { 
          error: `JSON parse error: ${(jsonErr as Error).message}`,
          api: { rateLimit, remaining, retryAfter }
        };
      }

      return {
        data,
        api: { rateLimit, remaining, retryAfter },
      };
    } catch (err) {
      console.error("Network Error:", err);
      return { 
        error: (err as Error).message || 'Network error',
        api: null
      };
    }
  });

  // CSVダウンロード
  ipcMain.handle('zendesk:csv', async (event, csvArray: string[][]) => {
    try {
      const csv = '\uFEFF' + unparse(csvArray); // BOM付き
      const { filePath } = await dialog.showSaveDialog({
        title: 'CSVファイルの保存',
        defaultPath: 'zendesk_tickets.csv',
        filters: [{ name: 'CSV', extensions: ['csv'] }]
      });

      if (filePath) {
        await writeFile(filePath, csv, 'utf-8');
        return { success: true };
      }
      return { success: false, error: '保存がキャンセルされました' };
    } catch (error) {
      console.error('CSV保存エラー:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}
