const DEFAULT_SETTINGS = {
  blockEnabled: true,
  whitelist: ["poe.com", "youtube.com"],
  remoteConfig: {
    enabled: false,
    url: "",
    apiKey: "",
    syncIntervalMinutes: 15
  },
  lastSync: {
    at: null,
    status: "Not synced yet"
  }
};

function normalizeDomain(value) {
  if (typeof value !== "string") {
    return "";
  }

  let domain = value.trim().toLowerCase();
  if (!domain) {
    return "";
  }

  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.split("/")[0];
  domain = domain.split(":")[0];
  domain = domain.replace(/^\*\./, "");

  return domain;
}

function parseWhitelist(text) {
  const items = text
    .split(/[\n,]/)
    .map((item) => normalizeDomain(item))
    .filter(Boolean);

  return Array.from(new Set(items));
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function setStatus(message, isError = false) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function render(settings) {
  const blockEnabledInput = document.getElementById("blockEnabled");
  const whitelistInput = document.getElementById("whitelist");
  const remoteEnabledInput = document.getElementById("remoteEnabled");
  const remoteUrlInput = document.getElementById("remoteUrl");
  const remoteApiKeyInput = document.getElementById("remoteApiKey");
  const syncIntervalInput = document.getElementById("syncIntervalMinutes");
  const lastSyncAt = document.getElementById("lastSyncAt");
  const lastSyncStatus = document.getElementById("lastSyncStatus");

  blockEnabledInput.checked = Boolean(settings.blockEnabled);
  whitelistInput.value = settings.whitelist.join("\n");
  remoteEnabledInput.checked = Boolean(settings.remoteConfig.enabled);
  remoteUrlInput.value = settings.remoteConfig.url || "";
  remoteApiKeyInput.value = settings.remoteConfig.apiKey || "";
  syncIntervalInput.value = String(settings.remoteConfig.syncIntervalMinutes || 15);

  lastSyncAt.textContent = `At: ${formatDateTime(settings.lastSync.at)}`;
  lastSyncStatus.textContent = `Status: ${settings.lastSync.status || "Not synced yet"}`;
}

async function getSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    remoteConfig: {
      ...DEFAULT_SETTINGS.remoteConfig,
      ...(settings.remoteConfig || {})
    },
    lastSync: {
      ...DEFAULT_SETTINGS.lastSync,
      ...(settings.lastSync || {})
    }
  };
}

function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false, message: chrome.runtime.lastError.message });
        return;
      }
      resolve(response || { ok: false, message: "No response" });
    });
  });
}

async function onSave(event) {
  event.preventDefault();

  const blockEnabledInput = document.getElementById("blockEnabled");
  const whitelistInput = document.getElementById("whitelist");
  const remoteEnabledInput = document.getElementById("remoteEnabled");
  const remoteUrlInput = document.getElementById("remoteUrl");
  const remoteApiKeyInput = document.getElementById("remoteApiKey");
  const syncIntervalInput = document.getElementById("syncIntervalMinutes");

  const whitelist = parseWhitelist(whitelistInput.value);
  if (whitelist.length === 0) {
    setStatus("Whitelist cannot be empty", true);
    return;
  }

  const syncInterval = Math.max(5, Number(syncIntervalInput.value) || 15);

  await chrome.storage.sync.set({
    blockEnabled: blockEnabledInput.checked,
    whitelist,
    remoteConfig: {
      enabled: remoteEnabledInput.checked,
      url: remoteUrlInput.value.trim(),
      apiKey: remoteApiKeyInput.value.trim(),
      syncIntervalMinutes: syncInterval
    }
  });

  const response = await sendMessage({ type: "apply-settings" });
  if (!response.ok) {
    setStatus(`Saved, but apply failed: ${response.message || "unknown"}`, true);
    return;
  }

  const fresh = await getSettings();
  render(fresh);
  setStatus(fresh.blockEnabled ? "Settings saved. Blocking is ON" : "Settings saved. Blocking is OFF");
}

async function onSyncNow() {
  setStatus("Sync in progress...");

  const response = await sendMessage({ type: "sync-now" });
  if (!response.ok) {
    setStatus(`Sync failed: ${response.message || "unknown"}`, true);
    const freshAfterError = await getSettings();
    render(freshAfterError);
    return;
  }

  const fresh = await getSettings();
  render(fresh);
  setStatus(response.message || "Sync completed");
}

async function init() {
  const saveBtn = document.getElementById("saveBtn");
  const syncBtn = document.getElementById("syncBtn");

  saveBtn.addEventListener("click", onSave);
  syncBtn.addEventListener("click", onSyncNow);

  const settings = await getSettings();
  render(settings);
}

init().catch((error) => {
  setStatus(error instanceof Error ? error.message : "Failed to initialize", true);
});
