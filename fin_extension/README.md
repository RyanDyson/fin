# Whitelist Web Guard (Chrome Extension)

This Chrome extension blocks navigation to every HTTP/HTTPS website except domains in a whitelist.

Default whitelist:
- poe.com
- youtube.com

Default block state:
- ON

## How It Works

- The extension uses Chrome Manifest V3 and `declarativeNetRequest` dynamic rules.
- A single block rule is applied to `main_frame` requests.
- Everything matching `^https?://` is blocked, except `excludedRequestDomains` from your whitelist.
- Whitelist settings are stored in `chrome.storage.sync` and can be edited in the extension Options page.

## Files

- `manifest.json`: Extension metadata and permissions.
- `service-worker.js`: Blocking logic, rules management, optional remote sync.
- `options.html` + `options.js`: Manage whitelist and remote sync settings.
- `popup.html` + `popup.js`: Quick view of whitelist and sync status.
- `styles.css`: Shared UI styles.

## Local Install (Load Unpacked)

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this folder:
   - `c:\Users\Intern\Documents\CS\fin_extension`
5. The extension icon will appear in Chrome.

## Usage

1. Click the extension icon to open the popup.
2. Click **Open Settings**.
3. Use the **Enable website blocking** switch to turn blocking ON/OFF.
4. Add domains to the whitelist (one per line or comma-separated).
5. Click **Save Settings**.
6. Browse the web. Any domain not on the whitelist will be blocked when blocking is ON.

## Programmatic Toggle (Ready For Future API Trigger)

The background worker now supports a message endpoint to toggle blocking:

```js
chrome.runtime.sendMessage({ type: "set-block-enabled", enabled: true });
```

This makes it straightforward to add backend-driven on/off behavior later.

Suggested future flow:
- Backend API returns a policy flag (for example: `blockEnabled: true/false`).
- Extension fetches policy on interval.
- Extension sends `set-block-enabled` internally with the backend value.

## Remote Whitelist Sync (Future Postgres Integration)

A Chrome extension should not connect directly to Postgres.
Use a secure backend API that reads from Postgres and returns domains.

The extension supports a remote endpoint now:
1. Open extension settings.
2. Enable **Remote sync**.
3. Set **Remote URL** (example: `https://api.example.com/whitelist`).
4. Optional: set API key (sent as `Authorization: Bearer <token>`).
5. Set sync interval and click **Sync Now**.

Accepted API response formats:

```json
["poe.com", "youtube.com"]
```

or

```json
{
  "whitelist": ["poe.com", "youtube.com"]
}
```

or

```json
{
  "domains": ["poe.com", "youtube.com"]
}
```

## Production Deployment

### Option A: Internal/company distribution
- Zip the extension files (contents of this folder).
- Distribute and install via enterprise policy or managed browser tooling.

### Option B: Chrome Web Store
1. Create a 128x128 PNG icon and add it to `manifest.json` under `icons`.
2. Create store listing assets/screenshots.
3. Zip this extension folder contents.
4. Upload in Chrome Web Store Developer Dashboard.
5. Complete privacy/disclosure fields and publish.

## Notes

- If whitelist is empty, all HTTP/HTTPS websites will be blocked.
- Browser internal pages like `chrome://` are not normal web URLs and are not controlled by this rule.
- Use explicit domains like `youtube.com`, `mail.google.com`, etc. for precise control.
