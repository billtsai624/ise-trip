# 大阪 → 伊勢 自駕 2026

8 人六天五夜行程網頁，可安裝到 iPhone / Android 主畫面，附共用記帳與分帳結算。
朋友不需要任何帳號，打開網址就能看、能記帳。

## 檔案
- `index.html` 主頁面（行程、車程、預訂、記帳、結算）
- `config.js` 共用帳本網址設定
- `manifest.webmanifest`、`sw.js`、圖示 讓手機可安裝、離線也能看行程
- `Code.gs` 共用帳本後端（Google 試算表）

## 一、建立共用帳本（約 5 分鐘）
1. 用個人 Gmail 開一份新的 Google 試算表（公司帳號可能不允許「所有人」存取）。
2. 選單「擴充功能 → Apps Script」，刪掉預設內容，貼上 `Code.gs` 全部內容，存檔。
3. 右上「部署 → 新增部署作業」→ 齒輪選「網頁應用程式」
   - 執行身分：**我**
   - 誰可以存取：**所有人**
4. 按「部署」，第一次會要求授權，照步驟允許（出現「Google 尚未驗證」時按「進階 → 前往」）。
5. 複製「網頁應用程式網址」（結尾是 `/exec`），貼到 `config.js` 的 `API_URL`。

之後每筆帳都會出現在試算表的 `expenses` 分頁，也可以直接在試算表裡修改。

## 二、放到 GitHub Pages
1. GitHub 建一個新的 repo（例如 `ise-trip`，設為 Public）。
2. 把這個資料夾裡所有檔案上傳到 repo 根目錄（網頁上「Add file → Upload files」即可）。
3. repo 的 Settings → Pages → Source 選 `Deploy from a branch`，Branch 選 `main` / `(root)`，儲存。
4. 1–2 分鐘後網址會是 `https://<你的帳號>.github.io/ise-trip/`，把它丟到群組。

## 三、安裝到手機
- iPhone：用 Safari 打開 → 分享 → 加入主畫面
- Android：用 Chrome 打開 → 右上「⋮」→ 加到主畫面／安裝應用程式

## 注意
- 知道 Apps Script 網址的人都能寫入帳本，請只在旅伴群組分享。
- 之後改了 `index.html`，手機重開 App 一兩次就會更新。
