import {sha256sum} from './nodeCrypto.js';
import {versions} from './versions.js';
import {ipcRenderer} from 'electron';

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message);
}

// Zendesk API用の関数を追加
function fetchZendesk(query: any, header: any) {
  return ipcRenderer.invoke('zendesk:fetch', query, header);
}

// Zendesk CSV用の関数を追加
function csvZendesk(csvArray: string[][]) {
  return ipcRenderer.invoke('zendesk:csv', csvArray);
}

export {sha256sum, versions, send, fetchZendesk, csvZendesk};
