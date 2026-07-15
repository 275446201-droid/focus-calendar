const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopAPI", {
  loadTasks: () => ipcRenderer.invoke("tasks:load"),
  saveTasks: (tasks) => ipcRenderer.invoke("tasks:save", tasks),
  loadSettings: () => ipcRenderer.invoke("settings:load"),
  saveSettings: (settings) => ipcRenderer.invoke("settings:save", settings),
  exportData: () => ipcRenderer.invoke("data:export"),
  importData: () => ipcRenderer.invoke("data:import"),
  openDataFolder: () => ipcRenderer.invoke("data:open-folder"),
  getUpdateState: () => ipcRenderer.invoke("update:get-state"),
  checkForUpdates: () => ipcRenderer.invoke("update:check"),
  installUpdate: () => ipcRenderer.invoke("update:install"),
  onUpdateStateChanged: (callback) => {
    const listener = (_event, value) => callback(value);
    ipcRenderer.on("update:state-changed", listener);
    return () => ipcRenderer.removeListener("update:state-changed", listener);
  },
  onClickThroughChanged: (callback) => {
    const listener = (_event, value) => callback(value);
    ipcRenderer.on("settings:click-through-changed", listener);
    return () => ipcRenderer.removeListener("settings:click-through-changed", listener);
  },
  onTasksUpdated: (callback) => {
    const listener = (_event, value) => callback(value);
    ipcRenderer.on("tasks:updated", listener);
    return () => ipcRenderer.removeListener("tasks:updated", listener);
  },
  onSettingsUpdated: (callback) => {
    const listener = (_event, value) => callback(value);
    ipcRenderer.on("settings:updated", listener);
    return () => ipcRenderer.removeListener("settings:updated", listener);
  },
  setWindowMode: (mode) => ipcRenderer.invoke("window:set-mode", mode),
  closeWindow: () => ipcRenderer.invoke("window:close"),
  beginWindowDrag: (x, y) => ipcRenderer.send("window:drag-start", { x, y }),
  moveWindowDrag: (x, y) => ipcRenderer.send("window:drag-move", { x, y }),
  endWindowDrag: () => ipcRenderer.send("window:drag-end"),
  beginWindowResize: (direction, x, y) => ipcRenderer.send("window:resize-start", { direction, x, y }),
  moveWindowResize: (x, y) => ipcRenderer.send("window:resize-move", { x, y }),
  endWindowResize: () => ipcRenderer.send("window:resize-end"),
  showNotification: (title, body) => ipcRenderer.invoke("notification:show", { title, body }),
  platform: process.platform,
});
