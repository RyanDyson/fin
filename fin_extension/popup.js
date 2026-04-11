const DEFAULT_SETTINGS = {
  blockEnabled: true,
  whitelist: ["poe.com", "youtube.com"],
  lastSync: {
    at: null,
    status: "Not synced yet"
  }
};

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

async function getSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    lastSync: {
      ...DEFAULT_SETTINGS.lastSync,
      ...(settings.lastSync || {})
    }
  };
}

function render(settings) {
  const blockToggle = document.getElementById("blockToggle");
  const domainList = document.getElementById("domains");
  const syncAt = document.getElementById("syncAt");
  const syncStatus = document.getElementById("syncStatus");

  blockToggle.checked = Boolean(settings.blockEnabled);
  domainList.innerHTML = "";

  if (!settings.whitelist || settings.whitelist.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No allowed domains";
    domainList.appendChild(item);
  } else {
    for (const domain of settings.whitelist) {
      const item = document.createElement("li");
      item.textContent = domain;
      domainList.appendChild(item);
    }
  }

  syncAt.textContent = `At: ${formatDateTime(settings.lastSync.at)}`;
  syncStatus.textContent = `Status: ${settings.lastSync.status || "Not synced yet"}`;
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

async function onSyncNow() {
  setStatus("Sync in progress...");

  const result = await sendMessage({ type: "sync-now" });
  if (!result.ok) {
    setStatus(`Sync failed: ${result.message || "unknown"}`, true);
    return;
  }

  const settings = await getSettings();
  render(settings);
  setStatus(result.message || "Sync completed");
}

async function onToggleBlock(enabled) {
  const result = await sendMessage({ type: "set-block-enabled", enabled });
  if (!result.ok) {
    setStatus(`Toggle failed: ${result.message || "unknown"}`, true);
    const settings = await getSettings();
    render(settings);
    return;
  }

  const settings = await getSettings();
  render(settings);
  setStatus(result.message || (enabled ? "Block enabled" : "Block disabled"));
}

async function init() {
  const blockToggle = document.getElementById("blockToggle");
  const optionsBtn = document.getElementById("optionsBtn");
  const syncBtn = document.getElementById("syncBtn");

  optionsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  syncBtn.addEventListener("click", () => {
    onSyncNow().catch((error) => {
      setStatus(error instanceof Error ? error.message : "Sync error", true);
    });
  });

  blockToggle.addEventListener("change", (event) => {
    const enabled = event.target.checked;
    onToggleBlock(enabled).catch((error) => {
      setStatus(error instanceof Error ? error.message : "Toggle error", true);
    });
  });

  const settings = await getSettings();
  render(settings);
}

init().catch((error) => {
  setStatus(error instanceof Error ? error.message : "Initialization failed", true);
});
