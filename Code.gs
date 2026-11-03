/**
 * 伊勢自駕共用帳本 — Google Apps Script 後端
 * 1. 新建一份 Google 試算表 → 擴充功能 → Apps Script，把這整份貼上
 * 2. 部署 → 新增部署作業 → 類型「網頁應用程式」
 *    執行身分：我；誰可以存取：「所有人」
 * 3. 複製網址（結尾 /exec）貼到 config.js 的 API_URL
 */
const SHEET = 'expenses';
const MEMBERS = ['Bill','Evelyn','Lucy','Rachel','Steven','Zoey','Clear','Hank'];
const HEAD = ['id','title','amount','payer','split','day','cat','createdAt'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.insertSheet(SHEET);
    s.getRange('A:H').setNumberFormat('@'); // keep dates like 2026-11-27 as text
    s.appendRow(HEAD);
    s.setFrozenRows(1);
  }
  return s;
}

function list_() {
  const v = sheet_().getDataRange().getValues();
  v.shift();
  return v.filter(r => r[0]).map(r => ({
    id: String(r[0]), title: String(r[1]), amount: Number(r[2]) || 0, payer: String(r[3]),
    split: String(r[4]).split(',').filter(Boolean), day: String(r[5]), cat: String(r[6]),
    createdAt: Number(r[7]) || 0
  }));
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return out_({ ok: true, items: list_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const s = sheet_();
    if (body.action === 'add') {
      const x = body.item || {};
      const amount = Math.round(Number(x.amount));
      const split = (x.split || []).filter(n => MEMBERS.indexOf(n) >= 0);
      if (!(amount > 0) || MEMBERS.indexOf(x.payer) < 0 || !split.length) return out_({ ok: false, error: 'invalid' });
      s.appendRow([
        Utilities.getUuid().slice(0, 8), String(x.title || '').slice(0, 60), String(amount), x.payer,
        split.join(','), String(x.day || '').slice(0, 12), String(x.cat || '').slice(0, 8), String(Date.now())
      ]);
    } else if (body.action === 'delete') {
      const ids = s.getRange(1, 1, s.getLastRow(), 1).getValues();
      for (let i = ids.length - 1; i >= 1; i--) {
        if (String(ids[i][0]) === String(body.id)) { s.deleteRow(i + 1); break; }
      }
    } else {
      return out_({ ok: false, error: 'unknown action' });
    }
    return out_({ ok: true, items: list_() });
  } finally {
    lock.releaseLock();
  }
}
