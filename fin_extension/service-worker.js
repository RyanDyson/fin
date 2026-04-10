const BLOCK_RULE_ID = 1;
const SYNC_ALARM_NAME = "whitelist-sync";

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

function normalizeDomainList(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  const unique = new Set();
  for (const item of input) {
    const normalized = normalizeDomain(item);
    if (normalized) {
      unique.add(normalized);
    }
  }

  return Array.from(unique);
}

function sanitizeRemoteConfig(remoteConfig) {
  const merged = {
    ...DEFAULT_SETTINGS.remoteConfig,
    ...(remoteConfig || {})
  };

  const interval = Number(merged.syncIntervalMinutes);

  return {
    enabled: Boolean(merged.enabled),
    url: typeof merged.url === "string" ? merged.url.trim() : "",
    apiKey: typeof merged.apiKey === "string" ? merged.apiKey.trim() : "",
    syncIntervalMinutes: Number.isFinite(interval) && interval >= 5 ? Math.floor(interval) : 15
  };
}

function sanitizeSettings(raw) {
  const merged = {
    ...DEFAULT_SETTINGS,
    ...(raw || {})
  };

  return {
    blockEnabled: Boolean(merged.blockEnabled),
    whitelist: normalizeDomainList(merged.whitelist),
    remoteConfig: sanitizeRemoteConfig(merged.remoteConfig),
    lastSync: {
      at: merged.lastSync && typeof merged.lastSync.at === "string" ? merged.lastSync.at : null,
      status:
        merged.lastSync && typeof merged.lastSync.status === "string"
          ? merged.lastSync.status
          : DEFAULT_SETTINGS.lastSync.status
    }
  };
}

async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return sanitizeSettings(stored);
}

async function saveLastSync(status) {
  const lastSync = {
    at: new Date().toISOString(),
    status
  };

  await chrome.storage.sync.set({ lastSync });
}

async function clearBlockingRule() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [BLOCK_RULE_ID]
  });
}

async function applyBlockingState(whitelist, blockEnabled) {
  if (!blockEnabled) {
    await clearBlockingRule();
    return;
  }

  await applyBlockingRule(whitelist);
}

async function applyBlockingRule(whitelist) {
  const sanitizedWhitelist = normalizeDomainList(whitelist);

  const condition = {
    regexFilter: "^https?://",
    resourceTypes: ["main_frame"]
  };

  if (sanitizedWhitelist.length > 0) {
    condition.excludedRequestDomains = sanitizedWhitelist;
  }

  const rule = {
    id: BLOCK_RULE_ID,
    priority: 1,
    action: { type: "block" },
    condition
  };

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [BLOCK_RULE_ID],
    addRules: [rule]
  });
}

async function configureSyncAlarm(remoteConfig) {
  await chrome.alarms.clear(SYNC_ALARM_NAME);

  if (!remoteConfig.enabled || !remoteConfig.url) {
    return;
  }

  chrome.alarms.create(SYNC_ALARM_NAME, {
    periodInMinutes: remoteConfig.syncIntervalMinutes
  });
}

async function applySettingsFromStorage() {
  const settings = await getSettings();

  await applyBlockingState(settings.whitelist, settings.blockEnabled);
  await configureSyncAlarm(settings.remoteConfig);

  return settings;
}

function parseRemoteResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.whitelist)) {
    return payload.whitelist;
  }

  if (payload && Array.isArray(payload.domains)) {
    return payload.domains;
  }

  return null;
}

async function syncWhitelistFromRemote() {
  const settings = await getSettings();

  if (!settings.remoteConfig.enabled || !settings.remoteConfig.url) {
    return {
      ok: true,
      skipped: true,
      message: "Remote sync is disabled or URL is missing"
    };
  }

  const headers = {
    Accept: "application/json"
  };

  if (settings.remoteConfig.apiKey) {
    headers.Authorization = `Bearer ${settings.remoteConfig.apiKey}`;
  }

  const response = await fetch(settings.remoteConfig.url, {
    method: "GET",
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Remote sync failed with status ${response.status}`);
  }

  const payload = await response.json();
  const remoteDomains = parseRemoteResponse(payload);

  if (!remoteDomains) {
    throw new Error("Remote response must be an array or include whitelist/domains array");
  }

  const whitelist = normalizeDomainList(remoteDomains);

  if (whitelist.length === 0) {
    throw new Error("Remote whitelist is empty after normalization");
  }

  await chrome.storage.sync.set({
    whitelist,
    lastSync: {
      at: new Date().toISOString(),
      status: `Success: synced ${whitelist.length} domains`
    }
  });

  await applySettingsFromStorage();

  return {
    ok: true,
    skipped: false,
    message: `Synced ${whitelist.length} domains`
  };
}

async function initialize() {
  try {
    await applySettingsFromStorage();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown initialization error";
    await saveLastSync(`Init error: ${message}`);
    throw error;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  initialize().catch((error) => {
    console.error("Initialization failed after install", error);
  });
});

chrome.runtime.onStartup.addListener(() => {
  initialize().catch((error) => {
    console.error("Initialization failed on startup", error);
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") {
    return;
  }

  if (changes.blockEnabled || changes.whitelist || changes.remoteConfig) {
    applySettingsFromStorage().catch((error) => {
      console.error("Failed to apply changed settings", error);
    });
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== SYNC_ALARM_NAME) {
    return;
  }

  syncWhitelistFromRemote()
    .then((result) => {
      if (!result.skipped) {
        return saveLastSync(result.message);
      }
      return null;
    })
    .catch(async (error) => {
      const message = error instanceof Error ? error.message : "Unknown sync error";
      await saveLastSync(`Sync error: ${message}`);
    });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== "object") {
    sendResponse({ ok: false, message: "Invalid message" });
    return false;
  }

  if (message.type === "apply-settings") {
    applySettingsFromStorage()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => {
        const msg = error instanceof Error ? error.message : "Unknown apply error";
        sendResponse({ ok: false, message: msg });
      });
    return true;
  }

  if (message.type === "sync-now") {
    syncWhitelistFromRemote()
      .then((result) => sendResponse(result))
      .catch(async (error) => {
        const msg = error instanceof Error ? error.message : "Unknown sync error";
        await saveLastSync(`Sync error: ${msg}`);
        sendResponse({ ok: false, skipped: false, message: msg });
      });
    return true;
  }

  if (message.type === "set-block-enabled") {
    if (typeof message.enabled !== "boolean") {
      sendResponse({ ok: false, message: "enabled must be a boolean" });
      return false;
    }

    chrome.storage.sync
      .set({ blockEnabled: message.enabled })
      .then(() => applySettingsFromStorage())
      .then(() => sendResponse({ ok: true, message: message.enabled ? "Block enabled" : "Block disabled" }))
      .catch((error) => {
        const msg = error instanceof Error ? error.message : "Unknown toggle error";
        sendResponse({ ok: false, message: msg });
      });
    return true;
  }

  sendResponse({ ok: false, message: "Unknown message type" });
  return false;
});
