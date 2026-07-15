const { app, BrowserWindow, dialog, globalShortcut, ipcMain, Notification, powerMonitor, screen, shell } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let tasksCache = [];
let settingsCache = {
  opacity: 0.92,
  level: "normal",
  lockPosition: false,
  clickThrough: false,
  openAtLogin: false,
  showCalendar: true,
  sound: true,
  language: "zh",
  theme: "classic",
};
let boundsTimer;
let windowDragOffset = null;
let windowDragOuterSize = null;
let windowResizeState = null;
let stableContentSize = null;
let ignoreResizeTrackingUntil = 0;
const notified = new Set();
const activeNotifications = new Map();
let lastReminderCheckAt = Date.now() - 60_000;
let updateState = {
  status: "idle",
  currentVersion: app.getVersion(),
  availableVersion: null,
  progress: 0,
  error: null,
};

const dataPath = () => path.join(app.getPath("userData"), "tasks-v1.json");
const settingsPath = () => path.join(app.getPath("userData"), "settings-v1.json");

function publishUpdateState(patch) {
  updateState = { ...updateState, ...patch, currentVersion: app.getVersion() };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update:state-changed", updateState);
  }
  return updateState;
}

function normalizeUpdateError(error) {
  const message = String(error?.message || error || "Unknown update error");
  return message.replace(/(token|authorization|password)=?[^\s&]*/gi, "$1=[redacted]").slice(0, 500);
}

async function checkForUpdates({ manual = false } = {}) {
  if (process.platform === "darwin") {
    return publishUpdateState({ status: "disabled", error: null, manual });
  }
  if (!app.isPackaged) {
    return publishUpdateState({ status: "development", error: null });
  }
  publishUpdateState({ status: "checking", error: null, manual });
  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    publishUpdateState({ status: "error", error: normalizeUpdateError(error), manual });
  }
  return updateState;
}

function setupAutoUpdater() {
  if (process.platform === "darwin") return;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => publishUpdateState({ status: "checking", error: null }));
  autoUpdater.on("update-available", (info) => publishUpdateState({
    status: "available",
    availableVersion: info.version,
    progress: 0,
    error: null,
  }));
  autoUpdater.on("update-not-available", () => publishUpdateState({
    status: "up-to-date",
    availableVersion: null,
    progress: 0,
    error: null,
  }));
  autoUpdater.on("download-progress", (progress) => publishUpdateState({
    status: "downloading",
    progress: Math.max(0, Math.min(100, Math.round(progress.percent || 0))),
    error: null,
  }));
  autoUpdater.on("update-downloaded", (info) => publishUpdateState({
    status: "downloaded",
    availableVersion: info.version,
    progress: 100,
    error: null,
  }));
  autoUpdater.on("error", (error) => publishUpdateState({
    status: "error",
    error: normalizeUpdateError(error),
  }));

  setTimeout(() => checkForUpdates({ manual: false }), 8_000);
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") console.error("读取本地数据失败", error);
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function loadTasks() {
  return readJson(dataPath(), []);
}

async function saveTasks(tasks) {
  tasksCache = Array.isArray(tasks) ? tasks : [];
  await writeJson(dataPath(), tasksCache);
  return true;
}

function toLocalISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function notifyRenderer() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send("tasks:updated", tasksCache);
}

async function handleNotificationAction(taskId, actionIndex) {
  const task = tasksCache.find((item) => item.id === taskId);
  if (!task) return;
  if (actionIndex === 0) {
    task.completed = true;
  } else if (actionIndex === 1) {
    const later = new Date(Date.now() + 15 * 60_000);
    const hour = String(later.getHours()).padStart(2, "0");
    const minute = String(later.getMinutes()).padStart(2, "0");
    task.reminderAt = `${toLocalISO(later)}T${hour}:${minute}`;
    notified.delete(task.id);
  } else if (actionIndex === 2) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDate = toLocalISO(tomorrow);
    const time = task.time || task.reminderAt?.slice(11, 16) || "09:00";
    task.date = nextDate;
    task.reminderAt = `${nextDate}T${time}`;
    notified.delete(task.id);
  }
  await saveTasks(tasksCache);
  notifyRenderer();
}

function showTaskNotification(task) {
  if (!Notification.isSupported()) return;
  const english = settingsCache.language === "en";
  const notification = new Notification({
    id: `task-${task.id}`,
    title: english ? "Task reminder" : "任务提醒",
    body: task.title,
    silent: !settingsCache.sound,
    actions: [
      { type: "button", text: english ? "Complete" : "完成" },
      { type: "button", text: english ? "15 min later" : "15分钟后" },
      { type: "button", text: english ? "Tomorrow" : "明天提醒" },
    ],
  });
  notification.on("action", (event, actionIndex) => handleNotificationAction(task.id, event.actionIndex ?? actionIndex));
  notification.on("click", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
  notification.on("close", () => activeNotifications.delete(task.id));
  activeNotifications.set(task.id, notification);
  notification.show();
}

async function loadSettings() {
  const saved = await readJson(settingsPath(), {});
  settingsCache = { ...settingsCache, ...saved };
  let settingsChanged = false;
  if (settingsCache.clickThrough) {
    settingsCache.clickThrough = false;
    settingsChanged = true;
  }
  if (!settingsCache.minimumFullSizeV4) {
    settingsCache.bounds = { ...settingsCache.bounds, width: 920, height: 650 };
    settingsCache.minimumFullSizeV4 = true;
    settingsChanged = true;
  }
  if (settingsChanged) await writeJson(settingsPath(), settingsCache);
  return settingsCache;
}

async function saveSettings(settings) {
  settingsCache = { ...settingsCache, ...settings };
  await writeJson(settingsPath(), settingsCache);
  applyWindowSettings();
  return settingsCache;
}

function applyWindowSettings() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.setOpacity(1);
  mainWindow.setMovable(!settingsCache.lockPosition);
  mainWindow.setIgnoreMouseEvents(Boolean(settingsCache.clickThrough), { forward: true });

  if (settingsCache.level === "top") {
    mainWindow.setAlwaysOnTop(true, "floating");
    mainWindow.setSkipTaskbar(false);
    mainWindow.setVisibleOnAllWorkspaces(false);
  } else if (settingsCache.level === "desktop") {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setSkipTaskbar(true);
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  } else {
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setSkipTaskbar(false);
    mainWindow.setVisibleOnAllWorkspaces(false);
  }

  if (app.isPackaged) {
    app.setLoginItemSettings({ openAtLogin: Boolean(settingsCache.openAtLogin) });
  }
}

async function setClickThrough(enabled, { focusWindow = false } = {}) {
  settingsCache.clickThrough = Boolean(enabled);
  await writeJson(settingsPath(), settingsCache);
  applyWindowSettings();
  mainWindow?.webContents.send("settings:click-through-changed", settingsCache.clickThrough);
  if (focusWindow && !settingsCache.clickThrough) {
    mainWindow?.show();
    mainWindow?.focus();
  }
}

function rememberBounds() {
  clearTimeout(boundsTimer);
  boundsTimer = setTimeout(async () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    settingsCache.bounds = mainWindow.getBounds();
    if (stableContentSize) {
      settingsCache.bounds.width = stableContentSize[0];
      settingsCache.bounds.height = stableContentSize[1];
    }
    await writeJson(settingsPath(), settingsCache);
  }, 350);
}

function createWindow() {
  const savedBounds = settingsCache.bounds || {};
  const primaryWorkArea = screen.getPrimaryDisplay().workArea;
  const savedRect = {
    x: Number.isFinite(savedBounds.x) ? savedBounds.x : primaryWorkArea.x,
    y: Number.isFinite(savedBounds.y) ? savedBounds.y : primaryWorkArea.y,
    width: Number.isFinite(savedBounds.width) ? savedBounds.width : 920,
    height: Number.isFinite(savedBounds.height) ? savedBounds.height : 650,
  };
  const workArea = screen.getDisplayMatching(savedRect).workArea;
  const margin = 10;
  const availableWidth = workArea.width - margin * 2;
  const availableHeight = workArea.height - margin * 2;
  const minimumFullWidth = Math.min(920, availableWidth);
  const minimumFullHeight = Math.min(650, availableHeight);
  const width = Math.min(Math.max(savedRect.width, minimumFullWidth), availableWidth);
  const height = Math.min(Math.max(savedRect.height, minimumFullHeight), availableHeight);
  const fallbackX = workArea.x + Math.round((workArea.width - width) / 2);
  const fallbackY = workArea.y + Math.round((workArea.height - height) / 2);
  const x = Number.isFinite(savedBounds.x)
    ? Math.max(workArea.x + margin, Math.min(savedBounds.x, workArea.x + workArea.width - width - margin))
    : fallbackX;
  const y = Number.isFinite(savedBounds.y)
    ? Math.max(workArea.y + margin, Math.min(savedBounds.y, workArea.y + workArea.height - height - margin))
    : fallbackY;
  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    minWidth: 760,
    minHeight: 520,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: false,
    resizable: true,
    autoHideMenuBar: true,
    title: "专注日历",
    icon: path.join(__dirname, "../assets/focus-calendar.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  stableContentSize = [width, height];
  ignoreResizeTrackingUntil = Date.now() + 1500;

  applyWindowSettings();
  mainWindow.on("moved", rememberBounds);
  mainWindow.on("resized", () => {
    mainWindow.webContents.invalidate();
    if (!windowDragOffset && !windowResizeState && Date.now() >= ignoreResizeTrackingUntil) stableContentSize = mainWindow.getContentSize();
    rememberBounds();
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || "http://127.0.0.1:5173";
  if (!app.isPackaged) mainWindow.loadURL(devUrl);
  else mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
}

ipcMain.handle("tasks:load", async () => {
  tasksCache = await loadTasks();
  return tasksCache;
});

ipcMain.handle("tasks:save", async (_event, tasks) => saveTasks(tasks));
ipcMain.handle("settings:load", async () => settingsCache);
ipcMain.handle("settings:save", async (_event, settings) => saveSettings(settings));
ipcMain.handle("update:get-state", () => updateState);
ipcMain.handle("update:check", () => checkForUpdates({ manual: true }));
ipcMain.handle("update:download", async () => {
  if (!app.isPackaged || updateState.status !== "available") return updateState;
  publishUpdateState({ status: "downloading", progress: 0, error: null });
  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    publishUpdateState({ status: "error", error: normalizeUpdateError(error) });
  }
  return updateState;
});
ipcMain.handle("update:install", () => {
  if (updateState.status !== "downloaded") return false;
  setImmediate(() => autoUpdater.quitAndInstall(false, true));
  return true;
});

ipcMain.handle("window:close", () => {
  mainWindow?.close();
  return true;
});

ipcMain.on("window:drag-start", (_event, point) => {
  if (!mainWindow || settingsCache.lockPosition) return;
  const bounds = mainWindow.getBounds();
  windowDragOffset = { x: point.x - bounds.x, y: point.y - bounds.y };
  windowDragOuterSize = { width: bounds.width, height: bounds.height };
});

ipcMain.on("window:drag-move", (_event, point) => {
  if (!mainWindow || !windowDragOffset || !windowDragOuterSize || settingsCache.lockPosition) return;
  mainWindow.setBounds({
    x: Math.round(point.x - windowDragOffset.x),
    y: Math.round(point.y - windowDragOffset.y),
    width: windowDragOuterSize.width,
    height: windowDragOuterSize.height,
  }, false);
});

ipcMain.on("window:drag-end", () => {
  ignoreResizeTrackingUntil = Date.now() + 600;
  windowDragOffset = null;
  windowDragOuterSize = null;
  rememberBounds();
});

ipcMain.on("window:resize-start", (_event, payload) => {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const direction = String(payload?.direction || "");
  if (!/^(n|ne|e|se|s|sw|w|nw)$/.test(direction)) return;
  const x = Number(payload?.x);
  const y = Number(payload?.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  windowResizeState = {
    direction,
    startX: x,
    startY: y,
    bounds: mainWindow.getBounds(),
  };
  ignoreResizeTrackingUntil = Date.now() + 1000;
});

ipcMain.on("window:resize-move", (_event, point) => {
  if (!mainWindow || mainWindow.isDestroyed() || !windowResizeState) return;
  const pointerX = Number(point?.x);
  const pointerY = Number(point?.y);
  if (!Number.isFinite(pointerX) || !Number.isFinite(pointerY)) return;

  const { direction, startX, startY, bounds } = windowResizeState;
  const [minimumWidth, minimumHeight] = mainWindow.getMinimumSize();
  const deltaX = pointerX - startX;
  const deltaY = pointerY - startY;
  let x = bounds.x;
  let y = bounds.y;
  let width = bounds.width;
  let height = bounds.height;

  if (direction.includes("e")) width = Math.max(minimumWidth, bounds.width + deltaX);
  if (direction.includes("s")) height = Math.max(minimumHeight, bounds.height + deltaY);
  if (direction.includes("w")) {
    width = Math.max(minimumWidth, bounds.width - deltaX);
    x = bounds.x + bounds.width - width;
  }
  if (direction.includes("n")) {
    height = Math.max(minimumHeight, bounds.height - deltaY);
    y = bounds.y + bounds.height - height;
  }

  mainWindow.setBounds({
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  }, false);
});

ipcMain.on("window:resize-end", () => {
  if (!mainWindow || mainWindow.isDestroyed() || !windowResizeState) return;
  windowResizeState = null;
  ignoreResizeTrackingUntil = Date.now() + 600;
  stableContentSize = mainWindow.getContentSize();
  rememberBounds();
});

ipcMain.handle("data:export", async () => {
  const language = settingsCache.language === "en";
  const result = await dialog.showSaveDialog(mainWindow, {
    title: language ? "Export backup" : "导出备份",
    defaultPath: path.join(app.getPath("documents"), `FocusCalendar-backup-${toLocalISO(new Date())}.json`),
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (result.canceled || !result.filePath) return false;
  await writeJson(result.filePath, { version: 1, exportedAt: new Date().toISOString(), tasks: tasksCache, settings: settingsCache });
  return true;
});

ipcMain.handle("data:import", async () => {
  const language = settingsCache.language === "en";
  const result = await dialog.showOpenDialog(mainWindow, {
    title: language ? "Import backup" : "导入备份",
    properties: ["openFile"],
    filters: [{ name: "JSON", extensions: ["json"] }],
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const imported = await readJson(result.filePaths[0], null);
  const importedTasks = Array.isArray(imported) ? imported : imported?.tasks;
  if (!Array.isArray(importedTasks)) throw new Error(language ? "Invalid backup file" : "备份文件格式无效");
  const confirmation = await dialog.showMessageBox(mainWindow, {
    type: "warning",
    title: language ? "Replace current data?" : "替换当前数据？",
    message: language ? "Importing this backup will replace the current tasks and settings." : "导入该备份将替换当前任务和设置。",
    buttons: [language ? "Cancel" : "取消", language ? "Import" : "确认导入"],
    defaultId: 0,
    cancelId: 0,
    noLink: true,
  });
  if (confirmation.response !== 1) return null;
  await saveTasks(importedTasks);
  if (imported?.settings) await saveSettings(imported.settings);
  notifyRenderer();
  mainWindow?.webContents.send("settings:updated", settingsCache);
  return { tasks: tasksCache, settings: settingsCache };
});

ipcMain.handle("data:open-folder", async () => shell.openPath(app.getPath("userData")));

ipcMain.handle("window:set-mode", (_event, mode) => {
  if (!mainWindow) return false;
  const workArea = screen.getDisplayMatching(mainWindow.getBounds()).workArea;
  const fit = (preferredWidth, preferredHeight, minWidth, minHeight) => ({
    width: Math.max(minWidth, Math.min(preferredWidth, workArea.width - 20)),
    height: Math.max(minHeight, Math.min(preferredHeight, workArea.height - 20)),
  });
  let target;
  if (mode === "mini") {
    mainWindow.setMinimumSize(400, 260);
    target = fit(480, 320, 400, 260);
  } else {
    mainWindow.setMinimumSize(760, 520);
    target = fit(920, 650, 760, 520);
  }
  stableContentSize = [target.width, target.height];
  mainWindow.setBounds({
    x: workArea.x + Math.round((workArea.width - target.width) / 2),
    y: workArea.y + Math.round((workArea.height - target.height) / 2),
    ...target,
  }, true);
  applyWindowSettings();
  return true;
});

ipcMain.handle("notification:show", (_event, payload) => {
  if (Notification.isSupported()) {
    new Notification({ ...payload, silent: !settingsCache.sound }).show();
  }
  return true;
});

function checkDueReminders() {
  const now = Date.now();
  if (now < lastReminderCheckAt) {
    lastReminderCheckAt = now;
    return;
  }
  for (const task of tasksCache) {
    if (!task.reminderAt || task.completed || notified.has(task.id)) continue;
    const due = new Date(task.reminderAt).getTime();
    if (due <= now && due > lastReminderCheckAt) {
      showTaskNotification(task);
      notified.add(task.id);
    }
  }
  lastReminderCheckAt = now;
}

setInterval(checkDueReminders, 15_000);

app.whenReady().then(async () => {
  app.setAppUserModelId("com.focuscalendar.desktop");
  tasksCache = await loadTasks();
  await loadSettings();
  createWindow();
  setupAutoUpdater();

  powerMonitor.on("resume", () => setTimeout(checkDueReminders, 1_500));
  powerMonitor.on("unlock-screen", () => setTimeout(checkDueReminders, 500));

  globalShortcut.register("CommandOrControl+Shift+X", async () => {
    const nextClickThrough = !settingsCache.clickThrough;
    await setClickThrough(nextClickThrough, { focusWindow: !nextClickThrough });
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => globalShortcut.unregisterAll());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
