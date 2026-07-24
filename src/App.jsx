import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import packageInfo from "../package.json";
import {
  Alarm,
  ArrowRight,
  ArrowsClockwise,
  ArrowsOut,
  DownloadSimple,
  Bell,
  CalendarBlank,
  CalendarCheck,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  Circle,
  Clock,
  DotsSixVertical,
  DotsThree,
  Eye,
  GearSix,
  Lock,
  Minus,
  Plus,
  PushPin,
  SpeakerHigh,
  SquaresFour,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";

import kittyBow from "../assets/themes/hello-kitty/bow.png";
import kittyHomeCornerBow from "../assets/themes/hello-kitty/home/corner-bow.png";
import kittyHomeDayIcon from "../assets/themes/hello-kitty/home/day-icon.png";
import kittyHomeMascot from "../assets/themes/hello-kitty/home/mascot.png";
import kittyHomeMonthIcon from "../assets/themes/hello-kitty/home/month-icon.png";
import kittyHomeSideHeart from "../assets/themes/hello-kitty/home/side-heart.png";
import kittyHomeTinyBow from "../assets/themes/hello-kitty/home/tiny-bow.png";
import kittyHomeWeekIcon from "../assets/themes/hello-kitty/home/week-icon.png";
import kittyWhiskerLeft from "../assets/themes/hello-kitty/home/whisker-left.png";
import kittyWhiskerRight from "../assets/themes/hello-kitty/home/whisker-right.png";

const TYPE_META = {
  day: { color: "cyan" },
  week: { color: "violet" },
  month: { color: "coral" },
};

const APP_VERSION = packageInfo.version;
const APP_DEVELOPER = "Aaron";

const COPY = {
  zh: {
    weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    weekdayShort: ["日", "一", "二", "三", "四", "五", "六"],
    types: { day: "日任务", week: "周任务", month: "月任务" },
    today: "今天", calendarToday: "今日", goToToday: "返回今天", todayTasks: "今日任务", selectedTasks: "当天任务", thisWeek: "本周", thisMonth: "本月",
    addTask: "添加任务", quickAdd: "快速添加", add: "添加", settingsTitle: "显示与提醒设置", desktopDisplay: "桌面显示",
    theme: "界面主题", classicTheme: "深色经典", kittyTheme: "Hello Kitty", kittyThemeHint: "暖白与珊瑚粉主题，完整模式、迷你模式与弹窗会同步换肤。",
    language: "界面语言", chinese: "中文", english: "English", opacity: "窗口透明度", windowLevel: "窗口层级",
    top: "始终置顶", normal: "普通窗口", desktop: "桌面模式", desktopHint: "桌面模式会隐藏任务栏图标，并保持在普通应用窗口下方。",
    lockPosition: "锁定窗口位置", clickThrough: "鼠标穿透", clickHint: "按 Ctrl + Shift + X 可随时开启或关闭鼠标穿透。", clickEnabled: "鼠标穿透已开启 · Ctrl + Shift + X 关闭", clickDisabled: "鼠标穿透已关闭",
    showCalendar: "显示迷你日历", showWeekNumbers: "显示周数（ISO）", sound: "提醒声音", openAtLogin: "开机启动", closeSettings: "关闭设置", exitApp: "退出应用",
    miniCalendar: "迷你日历", upcoming: "后续安排", noUpcoming: "暂无后续安排", noTasks: "这一天还没有任务，点击添加", addToday: "添加今天的任务",
    newTask: "新建任务", editTask: "编辑任务", arrangeWork: "安排你的工作", adjustTask: "调整任务安排",
    taskName: "任务名称", taskPlaceholder: "例如：准备项目汇报", date: "日期", time: "时间", reminder: "到点提醒",
    category: "任务归类", repeat: "重复频率", noRepeat: "不重复", daily: "每天重复", weekly: "每周重复", monthly: "每月重复",
    categoryHint: "决定任务显示在日、周或月任务区域。",
    repeatHintDaily: "以后每天自动生成新任务。", repeatHintWeekly: "以后每周的同一星期自动生成新任务。", repeatHintMonthly: "以后每月的同一日期自动生成新任务。",
    editScope: "修改范围", occurrenceOnly: "仅修改本次", wholeSeries: "修改整个循环",
    deleteTask: "删除任务", deleteOccurrence: "删除本次", stopSeries: "停止后续循环", cancel: "取消", save: "保存修改",
    markDone: "标记完成", markUndone: "标记未完成", edit: "编辑", selectedDatePrefix: "输入任务，添加到",
    enterAdd: "Enter 添加", closeQuick: "关闭快速添加", switchCompact: "切换迷你模式", expand: "展开完整模式", displaySettings: "显示设置",
    microMode: "迷你模式", viewAll: "查看全部", allDayTasks: "当天全部任务", allWeekTasks: "本周全部任务", allMonthTasks: "本月全部任务", completedCount: "已完成",
    overdueTitle: "处理未完成任务", overdueText: "以下任务已经过期，请选择如何处理。", rolloverToday: "顺延到今天", keepDate: "保留原日期", abandon: "标记放弃",
    dataBackup: "数据备份", exportData: "导出备份", importData: "导入备份", openDataFolder: "打开数据目录", dataImported: "数据已导入", importFailed: "备份文件无效或导入失败",
    aboutApp: "关于专注日历", versionLabel: "版本", developerLabel: "开发者",
    softwareUpdate: "软件更新", currentVersion: "当前版本", checkForUpdates: "检查更新", checkingUpdate: "正在检查更新…",
    updateAvailable: "发现新版本，正在后台下载", downloadingUpdate: "正在后台下载", updateReady: "更新已准备好",
    restartAndInstall: "重启并安装", updateCurrent: "已是最新版本", updateFailed: "暂时无法检查或下载更新，不影响正常使用。", retryUpdate: "重试", updateDev: "安装版中可检查更新",
    taskUnitOne: "个任务", taskUnitMany: "个任务", pendingStatus: "待完成", progressStatus: "进行中", completedStatus: "已完成",
    allDone: "今天的任务已完成", moveTaskUp: "上移任务", moveTaskDown: "下移任务",
    year: "年", month: "月", day: "日",
  },
  en: {
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdayShort: ["S", "M", "T", "W", "T", "F", "S"],
    types: { day: "Day", week: "Week", month: "Month" },
    today: "Today", calendarToday: "Today", goToToday: "Go to today", todayTasks: "Today", selectedTasks: "Selected day", thisWeek: "This week", thisMonth: "This month",
    addTask: "Add task", quickAdd: "Quick add", add: "Add", settingsTitle: "Display & reminders", desktopDisplay: "Desktop display",
    theme: "Theme", classicTheme: "Classic dark", kittyTheme: "Hello Kitty", kittyThemeHint: "Warm white and coral pink styling across full, mini, and dialog views.",
    language: "Language", chinese: "中文", english: "English", opacity: "Window opacity", windowLevel: "Window level",
    top: "Always on top", normal: "Normal window", desktop: "Desktop mode", desktopHint: "Desktop mode hides the taskbar icon and stays below normal app windows.",
    lockPosition: "Lock window position", clickThrough: "Click through", clickHint: "Press Ctrl + Shift + X to toggle click-through at any time.", clickEnabled: "Click-through on · Ctrl + Shift + X to turn off", clickDisabled: "Click-through off",
    showCalendar: "Show mini calendar", showWeekNumbers: "Show week numbers (ISO)", sound: "Reminder sound", openAtLogin: "Launch at startup", closeSettings: "Close settings", exitApp: "Exit app",
    miniCalendar: "Mini calendar", upcoming: "Upcoming", noUpcoming: "No upcoming tasks", noTasks: "No tasks for this day. Click to add one.", addToday: "Add a task for today",
    newTask: "New task", editTask: "Edit task", arrangeWork: "Plan your work", adjustTask: "Adjust task",
    taskName: "Task name", taskPlaceholder: "For example: Prepare project update", date: "Date", time: "Time", reminder: "Reminder",
    category: "Task category", repeat: "Repeat frequency", noRepeat: "Does not repeat", daily: "Repeat daily", weekly: "Repeat weekly", monthly: "Repeat monthly",
    categoryHint: "Controls whether the task appears in the day, week, or month area.",
    repeatHintDaily: "A new task will be created every day.", repeatHintWeekly: "A new task will be created on the same weekday every week.", repeatHintMonthly: "A new task will be created on the same date every month.",
    editScope: "Apply changes to", occurrenceOnly: "This task only", wholeSeries: "Entire series",
    deleteTask: "Delete task", deleteOccurrence: "Delete this one", stopSeries: "Stop future repeats", cancel: "Cancel", save: "Save changes",
    markDone: "Mark complete", markUndone: "Mark incomplete", edit: "Edit", selectedDatePrefix: "Add a task to ",
    enterAdd: "Enter to add", closeQuick: "Close quick add", switchCompact: "Switch to mini mode", expand: "Expand full mode", displaySettings: "Display settings",
    microMode: "Mini mode", viewAll: "View all", allDayTasks: "All tasks for this day", allWeekTasks: "All tasks this week", allMonthTasks: "All tasks this month", completedCount: "Completed",
    overdueTitle: "Handle unfinished tasks", overdueText: "These tasks are overdue. Choose what to do with them.", rolloverToday: "Move to today", keepDate: "Keep original date", abandon: "Mark abandoned",
    dataBackup: "Data backup", exportData: "Export backup", importData: "Import backup", openDataFolder: "Open data folder", dataImported: "Data imported", importFailed: "Invalid backup or import failed",
    aboutApp: "About Focus Calendar", versionLabel: "Version", developerLabel: "Developer",
    softwareUpdate: "Software update", currentVersion: "Current version", checkForUpdates: "Check for updates", checkingUpdate: "Checking for updates…",
    updateAvailable: "New version found. Downloading in the background", downloadingUpdate: "Downloading in the background", updateReady: "Update ready",
    restartAndInstall: "Restart and install", updateCurrent: "You're up to date", updateFailed: "Unable to check or download right now. You can keep using the app.", retryUpdate: "Retry", updateDev: "Update checks are available in the installed app",
    taskUnitOne: "task", taskUnitMany: "tasks", pendingStatus: "Pending", progressStatus: "In progress", completedStatus: "Completed",
    allDone: "All tasks complete", moveTaskUp: "Move task up", moveTaskDown: "Move task down",
    year: "", month: "", day: "",
  },
};

const DEFAULT_SETTINGS = {
  opacity: 0.92,
  level: "normal",
  lockPosition: false,
  clickThrough: false,
  openAtLogin: false,
  showCalendar: true,
  showWeekNumbers: true,
  sound: true,
  language: "zh",
  theme: "classic",
};

function localISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, count) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function startOfWeek(date) {
  const next = new Date(date);
  const offset = next.getDay() === 0 ? -6 : 1 - next.getDay();
  next.setDate(next.getDate() + offset);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getISOWeekInfo(date) {
  const current = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = current.getUTCDay() || 7;
  current.setUTCDate(current.getUTCDate() + 4 - weekday);
  const weekYear = current.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const week = Math.ceil((((current - yearStart) / 86_400_000) + 1) / 7);
  return { week, year: weekYear };
}

function formatISOWeekTitle(date, copy) {
  const { week, year } = getISOWeekInfo(date);
  return copy === COPY.en ? `Week ${week}, ${year}` : `${year}年第${week}周`;
}

function formatMonthDay(date, copy) {
  if (copy === COPY.en) return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatFullDate(date, copy) {
  if (copy === COPY.en) return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatMonth(date, copy) {
  if (copy === COPY.en) return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function sortTasks(items) {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const left = `${a.date}T${a.time || "23:59"}`;
    const right = `${b.date}T${b.time || "23:59"}`;
    const dateTimeOrder = left.localeCompare(right);
    if (dateTimeOrder !== 0) return dateTimeOrder;
    if (canManuallyOrder(a) && canManuallyOrder(b)) {
      return (Number.isFinite(a.manualOrder) ? a.manualOrder : Number.MAX_SAFE_INTEGER)
        - (Number.isFinite(b.manualOrder) ? b.manualOrder : Number.MAX_SAFE_INTEGER);
    }
    return 0;
  });
}

function canManuallyOrder(task) {
  return task.type === "day" && !task.time && !task.completed;
}

function isTemplate(item) {
  return item.kind === "recurrence-template";
}

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function endOfMonthAfter(date, monthsAhead = 2) {
  return new Date(date.getFullYear(), date.getMonth() + monthsAhead + 1, 0);
}

function previousDayISO(value) {
  return localISO(addDays(fromISO(value), -1));
}

function occurrenceDates(template, throughDate) {
  const dates = [];
  const anchor = fromISO(template.anchorDate);
  const through = fromISO(throughDate);
  const end = template.endDate ? fromISO(template.endDate) : through;
  const limit = end < through ? end : through;
  if (anchor > limit) return dates;

  if (template.frequency === "daily") {
    let cursor = new Date(anchor);
    for (let count = 0; cursor <= limit && count < 3650; count += 1) {
      dates.push(localISO(cursor));
      cursor = addDays(cursor, 1);
    }
  } else if (template.frequency === "weekly") {
    let cursor = new Date(anchor);
    for (let count = 0; cursor <= limit && count < 520; count += 1) {
      dates.push(localISO(cursor));
      cursor = addDays(cursor, 7);
    }
  } else if (template.frequency === "monthly") {
    const anchorDay = anchor.getDate();
    for (let offset = 0; offset < 240; offset += 1) {
      const year = anchor.getFullYear();
      const month = anchor.getMonth() + offset;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const cursor = new Date(year, month, Math.min(anchorDay, lastDay));
      if (cursor > limit) break;
      dates.push(localISO(cursor));
    }
  }
  return dates;
}

function makeRecurringInstance(template, date) {
  return {
    id: `${template.id}:${date}`,
    title: template.title,
    type: template.type,
    date,
    time: template.time || "",
    reminderAt: template.reminder && template.time ? `${date}T${template.time}` : "",
    completed: false,
    templateId: template.id,
    occurrenceDate: date,
  };
}

function materializeRecurring(records, throughDate) {
  const result = [...records];
  const templates = records.filter(isTemplate);
  const instances = records.filter((item) => !isTemplate(item));
  for (const template of templates) {
    const existingDates = new Set(instances.filter((task) => task.templateId === template.id).map((task) => task.occurrenceDate || task.date));
    const skipped = new Set(template.skippedDates || []);
    for (const date of occurrenceDates(template, throughDate)) {
      if (!existingDates.has(date) && !skipped.has(date)) result.push(makeRecurringInstance(template, date));
    }
  }
  return result;
}

function makeDefaults(today) {
  const date = localISO(today);
  const tomorrow = localISO(addDays(today, 1));
  const nextWeek = localISO(addDays(today, 4));
  return [
    { id: "d-1", title: "准备季度汇报", type: "day", date, time: "09:00", reminderAt: `${date}T08:45`, completed: false },
    { id: "d-2", title: "完成设备巡检", type: "day", date, time: "14:00", reminderAt: `${date}T13:45`, completed: false },
    { id: "d-3", title: "整理本周工作资料", type: "day", date, time: "18:00", reminderAt: `${date}T17:45`, completed: false },
    { id: "d-4", title: "与团队同步项目进度", type: "day", date, time: "10:30", reminderAt: `${date}T10:15`, completed: false },
    { id: "d-5", title: "审核合同文档", type: "day", date, time: "15:00", reminderAt: `${date}T14:45`, completed: false },
    { id: "d-6", title: "提交周报", type: "day", date, time: "16:30", reminderAt: `${date}T16:15`, completed: false },
    { id: "w-1", title: "提交周报", type: "week", date, time: "16:30", reminderAt: `${date}T16:15`, completed: false },
    { id: "w-2", title: "与团队同步项目进度", type: "week", date: tomorrow, time: "10:30", reminderAt: `${tomorrow}T10:15`, completed: false },
    { id: "w-3", title: "学习新系统操作", type: "week", date: nextWeek, time: "15:00", reminderAt: `${nextWeek}T14:45`, completed: false },
    { id: "m-1", title: "准备季度汇报材料", type: "month", date: localISO(addDays(today, 7)), time: "", reminderAt: "", completed: false },
    { id: "m-2", title: "更新项目计划", type: "month", date: localISO(addDays(today, 14)), time: "", reminderAt: "", completed: false },
  ];
}

async function loadTasks() {
  if (window.desktopAPI) return window.desktopAPI.loadTasks();
  try {
    return JSON.parse(localStorage.getItem("focus-calendar-tasks-v2") || "[]");
  } catch {
    return [];
  }
}

async function persistTasks(tasks) {
  if (window.desktopAPI) return window.desktopAPI.saveTasks(tasks);
  localStorage.setItem("focus-calendar-tasks-v2", JSON.stringify(tasks));
  return true;
}

async function loadSettings() {
  if (window.desktopAPI) return window.desktopAPI.loadSettings();
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("focus-calendar-settings-v1") || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function persistSettings(settings) {
  if (window.desktopAPI) return window.desktopAPI.saveSettings(settings);
  localStorage.setItem("focus-calendar-settings-v1", JSON.stringify(settings));
  return settings;
}

function CalendarGrid({ cursor, selectedDate, onSelect, copy, compact = false, showWeekNumbers = false }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const mondayOffset = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const start = addDays(first, showWeekNumbers ? -mondayOffset : -first.getDay());
  const weeks = Array.from({ length: 6 }, (_, weekIndex) => (
    Array.from({ length: 7 }, (_, dayIndex) => addDays(start, weekIndex * 7 + dayIndex))
  ));
  const weekdayLabels = showWeekNumbers
    ? [...copy.weekdayShort.slice(1), copy.weekdayShort[0]]
    : copy.weekdayShort;
  const calendarTodayISO = localISO(new Date());

  return (
    <div className={`calendar-grid ${compact ? "is-compact" : ""} ${showWeekNumbers ? "with-week-numbers" : ""}`}>
      {showWeekNumbers && <span className="week-number-heading" aria-hidden="true">W</span>}
      {weekdayLabels.map((day, index) => <span className="weekday" key={`${day}-${index}`}>{day}</span>)}
      {weeks.map((weekDates) => {
        const weekStartDate = weekDates[0];
        const weekInfo = getISOWeekInfo(showWeekNumbers ? weekStartDate : addDays(weekStartDate, 1));
        return (
          <Fragment key={localISO(weekStartDate)}>
            {showWeekNumbers && (
              <span className="calendar-week-number" title={formatISOWeekTitle(weekStartDate, copy)}>
                W{weekInfo.week}
              </span>
            )}
            {weekDates.map((date) => {
              const iso = localISO(date);
              const outside = date.getMonth() !== month;
              const isToday = iso === calendarTodayISO;
              return (
                <button
                  className={`calendar-day ${iso === selectedDate ? "selected" : ""} ${isToday ? "current-day" : ""} ${outside ? "outside" : ""} ${date.getDay() === 0 ? "sunday" : ""}`}
                  key={iso}
                  onClick={() => onSelect(iso)}
                  aria-label={formatMonthDay(date, copy)}
                >
                  {date.getDate()}
                  {isToday && <span className="today-label">{copy.calendarToday}</span>}
                </button>
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
}

const KITTY_REFERENCE_WIDTH = 1487;
const KITTY_REFERENCE_HEIGHT = 1058;
const KITTY_CARD_BOUNDS = { left: 54, top: 30, right: 1429, bottom: 976 };

function WindowResizeHandles({ left, top, right, bottom }) {
  const activeResize = useRef(null);
  if (!window.desktopAPI) return null;

  function startResize(event, direction) {
    if (event.button !== 0) return;
    event.preventDefault();
    activeResize.current = { pointerId: event.pointerId, direction };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    window.desktopAPI.beginWindowResize?.(direction, event.screenX, event.screenY);
  }

  function moveResize(event) {
    const active = activeResize.current;
    if (!active || active.pointerId !== event.pointerId) return;
    event.preventDefault();
    window.desktopAPI.moveWindowResize?.(event.screenX, event.screenY);
  }

  function finishResize(event) {
    const active = activeResize.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    window.desktopAPI.endWindowResize?.();
    activeResize.current = null;
  }

  const shared = (direction) => ({
    onPointerDown: (event) => startResize(event, direction),
    onPointerMove: moveResize,
    onPointerUp: finishResize,
    onPointerCancel: finishResize,
  });
  const edge = 12;
  const corner = 18;
  const width = right - left;
  const height = bottom - top;

  return <div className="window-resize-handles" aria-hidden="true">
    <div className="window-resize-handle resize-n" style={{ left: left + corner / 2, top: top - edge / 2, width: width - corner, height: edge }} {...shared("n")} />
    <div className="window-resize-handle resize-e" style={{ left: right - edge / 2, top: top + corner / 2, width: edge, height: height - corner }} {...shared("e")} />
    <div className="window-resize-handle resize-s" style={{ left: left + corner / 2, top: bottom - edge / 2, width: width - corner, height: edge }} {...shared("s")} />
    <div className="window-resize-handle resize-w" style={{ left: left - edge / 2, top: top + corner / 2, width: edge, height: height - corner }} {...shared("w")} />
    <div className="window-resize-handle resize-nw resize-corner" style={{ left: left - corner / 2, top: top - corner / 2, width: corner, height: corner }} {...shared("nw")} />
    <div className="window-resize-handle resize-ne resize-corner" style={{ left: right - corner / 2, top: top - corner / 2, width: corner, height: corner }} {...shared("ne")} />
    <div className="window-resize-handle resize-se resize-corner" style={{ left: right - corner / 2, top: bottom - corner / 2, width: corner, height: corner }} {...shared("se")} />
    <div className="window-resize-handle resize-sw resize-corner" style={{ left: left - corner / 2, top: bottom - corner / 2, width: corner, height: corner }} {...shared("sw")} />
  </div>;
}

function KittyReferenceStage({ children }) {
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useEffect(() => {
    let frame = 0;
    const syncViewport = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setViewport({ width: window.innerWidth, height: window.innerHeight });
      });
    };
    window.addEventListener("resize", syncViewport);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  const scale = Math.min(
    viewport.width / KITTY_REFERENCE_WIDTH,
    viewport.height / KITTY_REFERENCE_HEIGHT,
  );
  const left = Math.max(0, (viewport.width - KITTY_REFERENCE_WIDTH * scale) / 2);
  const resizeBounds = {
    left: left + KITTY_CARD_BOUNDS.left * scale,
    top: KITTY_CARD_BOUNDS.top * scale,
    right: left + KITTY_CARD_BOUNDS.right * scale,
    bottom: KITTY_CARD_BOUNDS.bottom * scale,
  };

  return (
    <div className="kitty-reference-stage">
      <div
        className="kitty-reference-canvas"
        style={{
          "--kitty-reference-scale": scale,
          "--kitty-reference-left": `${left}px`,
        }}
      >
        {children}
      </div>
      <WindowResizeHandles {...resizeBounds} />
    </div>
  );
}

function TaskRow({ task, onToggle, onEdit, onMove, copy, compact = false, showDate = false, reminderTimeOnly = false, reorderable = false }) {
  const meta = TYPE_META[task.type];
  const displayTime = reminderTimeOnly ? (task.reminderAt ? task.reminderAt.slice(11, 16) : "") : task.time;
  return (
    <div className={`task-row ${meta.color} ${task.completed ? "completed" : ""} ${compact ? "compact" : ""} ${reorderable ? "reorderable" : ""}`}>
      {reorderable && <span className="task-order-controls">
        <button type="button" onClick={() => onMove?.(task.id, "up")} title={copy.moveTaskUp} aria-label={copy.moveTaskUp}><CaretUp weight="bold" /></button>
        <button type="button" onClick={() => onMove?.(task.id, "down")} title={copy.moveTaskDown} aria-label={copy.moveTaskDown}><CaretDown weight="bold" /></button>
      </span>}
      <button className="check-button" onClick={() => onToggle(task.id)} aria-label={task.completed ? copy.markUndone : copy.markDone}>
        {task.completed ? <Check weight="bold" /> : <Circle />}
      </button>
      <div className="task-copy">
        <div className="task-title-line">
          <button className="task-title" onClick={() => onEdit?.(task)}>{task.title}</button>
          {task.templateId && <ArrowsClockwise className="repeat-icon" weight="bold" aria-label={copy.repeat} />}
        </div>
        {showDate && <span className="task-date">{formatMonthDay(fromISO(task.date), copy)}</span>}
      </div>
      {displayTime && <span className="task-time">{displayTime}</span>}
      {task.reminderAt && <Bell className="reminder-icon" weight="regular" />}
      {!compact && <button className="more-button" onClick={() => onEdit?.(task)} aria-label={`${copy.edit} ${task.title}`}><DotsThree weight="bold" /></button>}
    </div>
  );
}

function TaskEditor({ selectedDate, onClose, onSave, onDelete, copy, initialType = "day", initialTask = null, initialRepeat = "none" }) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [type, setType] = useState(initialTask?.type || initialType);
  const [date, setDate] = useState(initialTask?.date || selectedDate);
  const [time, setTime] = useState(initialTask?.time || "");
  const [reminder, setReminder] = useState(Boolean(initialTask?.reminderAt));
  const [repeat, setRepeat] = useState(initialRepeat);
  const [editScope, setEditScope] = useState(initialTask?.templateId ? "occurrence" : "series");

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    const reminderAt = reminder && time ? `${date}T${time}` : "";
    onSave({
      id: initialTask?.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      title: title.trim(),
      type,
      date,
      time,
      reminderAt,
      completed: initialTask?.completed || false,
      templateId: initialTask?.templateId,
      occurrenceDate: initialTask?.occurrenceDate,
    }, { repeat, editScope, reminder });
  }

  function changeRepeat(nextRepeat) {
    setRepeat(nextRepeat);
    if (nextRepeat === "daily") setType("day");
    if (nextRepeat === "weekly") setType("week");
    if (nextRepeat === "monthly") setType("month");
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="task-editor glass-panel" onSubmit={submit}>
        <header>
          <div>
            <span className="eyebrow">{initialTask ? copy.editTask : copy.newTask}</span>
            <h2>{initialTask ? copy.adjustTask : copy.arrangeWork}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}><X /></button>
        </header>
        <label>
          <span>{copy.taskName}</span>
          <input autoFocus value={title} onInput={(event) => setTitle(event.currentTarget.value)} onChange={(event) => setTitle(event.target.value)} placeholder={copy.taskPlaceholder} />
        </label>
        <div className="category-field">
          <span>{copy.category}</span>
          <div className="type-switcher">
            {Object.entries(TYPE_META).map(([key, value]) => (
              <button type="button" key={key} className={`${value.color} ${type === key ? "active" : ""}`} onClick={() => setType(key)}>{copy.types[key]}</button>
            ))}
          </div>
          <small>{copy.categoryHint}</small>
        </div>
        <div className="editor-grid">
          <label><span>{copy.date}</span><input type="date" value={date} onInput={(event) => setDate(event.currentTarget.value)} onChange={(event) => setDate(event.target.value)} /></label>
          <label><span>{copy.time}</span><input type="time" value={time} onInput={(event) => setTime(event.currentTarget.value)} onChange={(event) => setTime(event.target.value)} /></label>
        </div>
        {initialTask?.templateId && <label className="select-setting recurrence-scope">
          <span>{copy.editScope}</span>
          <select value={editScope} onChange={(event) => setEditScope(event.target.value)}>
            <option value="occurrence">{copy.occurrenceOnly}</option>
            <option value="series">{copy.wholeSeries}</option>
          </select>
        </label>}
        <label className="select-setting recurrence-setting">
          <span>{copy.repeat}</span>
          <select value={repeat} disabled={initialTask?.templateId && editScope === "occurrence"} onChange={(event) => changeRepeat(event.target.value)}>
            <option value="none">{copy.noRepeat}</option>
            <option value="daily">{copy.daily}</option>
            <option value="weekly">{copy.weekly}</option>
            <option value="monthly">{copy.monthly}</option>
          </select>
          {repeat !== "none" && <small>{repeat === "daily" ? copy.repeatHintDaily : repeat === "weekly" ? copy.repeatHintWeekly : copy.repeatHintMonthly}</small>}
        </label>
        <label className="toggle-row">
          <span><Bell /> {copy.reminder}</span>
          <input type="checkbox" checked={reminder} onChange={(event) => setReminder(event.target.checked)} />
        </label>
        <footer>
          {initialTask && <button type="button" className="delete-button" onClick={() => onDelete(initialTask.id, "occurrence")}>{initialTask.templateId ? copy.deleteOccurrence : copy.deleteTask}</button>}
          {initialTask?.templateId && <button type="button" className="series-stop-button" onClick={() => onDelete(initialTask.id, "series")}>{copy.stopSeries}</button>}
          <button type="button" className="secondary-button" onClick={onClose}>{copy.cancel}</button>
          <button type="submit" className="primary-button">{initialTask ? <Check weight="bold" /> : <Plus weight="bold" />} {initialTask ? copy.save : copy.addTask}</button>
        </footer>
      </form>
    </div>
  );
}

function SettingsPanel({ settings, onChange, onClose, onClickThroughChange, copy, onExport, onImport, onOpenData, onExit, updateState, onCheckUpdate, onInstallUpdate }) {
  const fileInput = useRef(null);
  const [backupMessage, setBackupMessage] = useState("");
  function update(key, value) {
    const nextSettings = { ...settings, [key]: value };
    onChange(nextSettings);
    if (key === "theme") persistSettings(nextSettings);
    if (key === "clickThrough") {
      onClickThroughChange?.(value);
      if (value) onClose();
    }
  }

  async function exportBackup() {
    const done = await onExport();
    if (done) setBackupMessage(copy.exportData);
  }

  async function importBackup(file) {
    try {
      const done = await onImport(file);
      setBackupMessage(done ? copy.dataImported : copy.importFailed);
    } catch {
      setBackupMessage(copy.importFailed);
    }
  }

  const updateStatus = (() => {
    if (updateState.status === "checking") return copy.checkingUpdate;
    if (updateState.status === "available") return `${copy.updateAvailable} v${updateState.availableVersion}`;
    if (updateState.status === "downloading") return `${copy.downloadingUpdate} ${updateState.progress || 0}%`;
    if (updateState.status === "downloaded") return `${copy.updateReady} v${updateState.availableVersion}`;
    if (updateState.status === "up-to-date") return copy.updateCurrent;
    if (updateState.status === "error") return copy.updateFailed;
    if (updateState.status === "development") return copy.updateDev;
    return `${copy.currentVersion} v${APP_VERSION}`;
  })();

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="settings-panel glass-panel" aria-label={copy.displaySettings}>
        <header>
          <div>
            <span className="eyebrow">{copy.desktopDisplay}</span>
            <h2>{copy.settingsTitle}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label={copy.closeSettings}><X /></button>
        </header>

        <label className="range-setting">
          <span><Eye /> {copy.opacity} <b>{Math.round(settings.opacity * 100)}%</b></span>
          <input type="range" min="40" max="100" step="1" value={Math.round(settings.opacity * 100)} onChange={(event) => update("opacity", Number(event.target.value) / 100)} />
        </label>

        <label className="select-setting">
          <span><PushPin /> {copy.windowLevel}</span>
          <select value={settings.level} onChange={(event) => update("level", event.target.value)}>
            <option value="top">{copy.top}</option>
            <option value="normal">{copy.normal}</option>
            <option value="desktop">{copy.desktop}</option>
          </select>
          <small>{copy.desktopHint}</small>
        </label>

        <label className="select-setting language-setting">
          <span>{copy.language}</span>
          <select value={settings.language} onChange={(event) => update("language", event.target.value)}>
            <option value="zh">{copy.chinese}</option>
            <option value="en">{copy.english}</option>
          </select>
        </label>

        <section className="theme-setting" aria-label={copy.theme}>
          <span className="theme-setting-title">{copy.theme}</span>
          <div className="theme-options">
            <button type="button" className={`theme-option classic-option ${settings.theme === "classic" ? "active" : ""}`} onClick={() => update("theme", "classic")}>
              <span className="theme-swatch classic-swatch" aria-hidden="true" />
              <strong>{copy.classicTheme}</strong>
            </button>
            <button type="button" className={`theme-option kitty-option ${settings.theme === "hello-kitty" ? "active" : ""}`} onClick={() => update("theme", "hello-kitty")}>
              <span className="theme-swatch kitty-swatch" aria-hidden="true"><img src={kittyBow} alt="" /></span>
              <strong>{copy.kittyTheme}</strong>
            </button>
          </div>
          <small>{copy.kittyThemeHint}</small>
        </section>

        <div className="settings-list">
          <label className="setting-row">
            <span><Lock /> {copy.lockPosition}</span>
            <input type="checkbox" checked={settings.lockPosition} onChange={(event) => update("lockPosition", event.target.checked)} />
          </label>
          <label className="setting-row">
            <span><Eye /> {copy.clickThrough}</span>
            <input type="checkbox" checked={settings.clickThrough} onChange={(event) => update("clickThrough", event.target.checked)} />
          </label>
          <p className="setting-hint">{copy.clickHint}</p>
          <label className="setting-row">
            <span><CalendarBlank /> {copy.showCalendar}</span>
            <input type="checkbox" checked={settings.showCalendar} onChange={(event) => update("showCalendar", event.target.checked)} />
          </label>
          <label className="setting-row">
            <span><CalendarCheck /> {copy.showWeekNumbers}</span>
            <input type="checkbox" checked={settings.showWeekNumbers} onChange={(event) => update("showWeekNumbers", event.target.checked)} />
          </label>
          <label className="setting-row">
            <span><SpeakerHigh /> {copy.sound}</span>
            <input type="checkbox" checked={settings.sound} onChange={(event) => update("sound", event.target.checked)} />
          </label>
          <label className="setting-row">
            <span><SquaresFour /> {copy.openAtLogin}</span>
            <input type="checkbox" checked={settings.openAtLogin} onChange={(event) => update("openAtLogin", event.target.checked)} />
          </label>
        </div>
        <section className="backup-setting">
          <h3>{copy.dataBackup}</h3>
          <div>
            <button type="button" className="secondary-button" onClick={exportBackup}><DownloadSimple /> {copy.exportData}</button>
            <button type="button" className="secondary-button" onClick={() => window.desktopAPI ? importBackup() : fileInput.current?.click()}><UploadSimple /> {copy.importData}</button>
            <button type="button" className="secondary-button" onClick={onOpenData}>{copy.openDataFolder}</button>
          </div>
          <input ref={fileInput} className="hidden-file-input" type="file" accept="application/json,.json" onChange={(event) => importBackup(event.target.files?.[0])} />
          {backupMessage && <p>{backupMessage}</p>}
        </section>
        <section className="update-setting" aria-label={copy.softwareUpdate}>
          <div>
            <h3>{copy.softwareUpdate}</h3>
            <p className={`update-status status-${updateState.status}`} title={updateState.error || ""}>{updateStatus}</p>
          </div>
          {updateState.status === "downloading" && <progress max="100" value={updateState.progress || 0} aria-label={updateStatus} />}
          <div className="update-actions">
            {updateState.status === "downloaded" && <button type="button" className="primary-button" onClick={onInstallUpdate}><ArrowsClockwise /> {copy.restartAndInstall}</button>}
            {!['available', 'downloaded', 'downloading', 'development'].includes(updateState.status) && <button type="button" className="secondary-button" onClick={onCheckUpdate} disabled={updateState.status === "checking"}><ArrowsClockwise /> {updateState.status === "error" ? copy.retryUpdate : copy.checkForUpdates}</button>}
          </div>
        </section>
        <section className="about-setting" aria-label={copy.aboutApp}>
          <span className="about-app-icon" aria-hidden="true"><CalendarCheck weight="duotone" /></span>
          <div>
            <h3>{copy.aboutApp}</h3>
            <p><span>{copy.versionLabel}</span><strong>{APP_VERSION}</strong></p>
            <p><span>{copy.developerLabel}</span><strong>{APP_DEVELOPER}</strong></p>
          </div>
          <small>© 2026 {APP_DEVELOPER}</small>
        </section>
        {window.desktopAPI && <footer className="settings-exit">
          <button type="button" className="exit-button" onClick={onExit}><X /> {copy.exitApp}</button>
        </footer>}
      </section>
    </div>
  );
}

function QuickAdd({ selectedDate, onAdd, onClose, copy }) {
  const [title, setTitle] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
  }

  return (
    <form className="quick-add-inline" onSubmit={submit}>
      <Plus weight="bold" />
      <input
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => event.key === "Escape" && onClose()}
        placeholder={`${copy.selectedDatePrefix}${formatMonthDay(fromISO(selectedDate), copy)}`}
        aria-label={copy.quickAdd}
      />
      <button type="submit" className="quick-submit" aria-label={`${copy.add} ${copy.quickAdd}`}>{copy.enterAdd}</button>
      <button type="button" className="icon-button" onClick={onClose} aria-label={copy.closeQuick}><X /></button>
    </form>
  );
}

function KittyWhiskers({ children, className = "" }) {
  return <span className={`kitty-whiskered-title ${className}`}>
    <img src={kittyWhiskerLeft} alt="" aria-hidden="true" />
    {children}
    <img src={kittyWhiskerRight} alt="" aria-hidden="true" />
  </span>;
}

function UpcomingPanel({ tasks, onSelect, copy, kitty = false }) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const visibleCount = Math.min(2, tasks.length);

  useEffect(() => {
    if (paused || tasks.length <= visibleCount) return undefined;
    const timer = setInterval(() => setOffset((current) => (current + 1) % tasks.length), 4500);
    return () => clearInterval(timer);
  }, [paused, tasks.length, visibleCount]);

  useEffect(() => setOffset(0), [tasks.map((task) => task.id).join("|")]);

  const visible = Array.from({ length: visibleCount }, (_, index) => tasks[(offset + index) % tasks.length]);
  function wheel(event) {
    if (tasks.length <= visibleCount) return;
    event.preventDefault();
    setOffset((current) => (current + (event.deltaY > 0 ? 1 : -1) + tasks.length) % tasks.length);
  }

  return (
    <section className="upcoming-panel glass-panel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onWheel={wheel}>
      <header>
        {kitty ? <KittyWhiskers className="kitty-upcoming-title"><img className="kitty-title-bow" src={kittyHomeTinyBow} alt="" /> {copy.upcoming}</KittyWhiskers> : <span><CalendarBlank weight="duotone" /> {copy.upcoming}</span>}
        <b>{tasks.length}</b>
      </header>
      <div className="upcoming-window">
        {visible.length ? (
          <div className="upcoming-list" key={offset}>
            {visible.map((task) => (
              <button key={`${task.id}-${offset}`} onClick={() => onSelect(task.date)}>
                <span>{formatMonthDay(fromISO(task.date), copy)}</span>
                <strong>{task.title}</strong>
                <CaretRight />
              </button>
            ))}
          </div>
        ) : <div className="upcoming-empty"><CalendarBlank weight="duotone" /><span>{copy.noUpcoming}</span></div>}
      </div>
    </section>
  );
}

function OverduePanel({ tasks, copy, onAction }) {
  return (
    <div className="modal-backdrop overdue-backdrop">
      <section className="overdue-panel glass-panel" aria-label={copy.overdueTitle}>
        <header>
          <WarningCircle weight="duotone" />
          <div>
            <span className="eyebrow">{tasks.length}</span>
            <h2>{copy.overdueTitle}</h2>
            <p>{copy.overdueText}</p>
          </div>
        </header>
        <div className="overdue-list">
          {tasks.slice(0, 6).map((task) => (
            <div key={task.id}>
              <span>{formatMonthDay(fromISO(task.date), copy)}</span>
              <strong>{task.title}</strong>
            </div>
          ))}
          {tasks.length > 6 && <small>+{tasks.length - 6}</small>}
        </div>
        <footer>
          <button className="secondary-button" onClick={() => onAction("keep")}>{copy.keepDate}</button>
          <button className="secondary-button abandon-button" onClick={() => onAction("abandon")}>{copy.abandon}</button>
          <button className="primary-button" onClick={() => onAction("rollover")}><ArrowRight /> {copy.rolloverToday}</button>
        </footer>
      </section>
    </div>
  );
}

function FullView({ tasks, selectedDate, setSelectedDate, cursor, setCursor, settings, copy, onToggle, onEdit, onMove, onAdd, onMini, onViewAll, onOpenSettings }) {
  const weekDrag = useRef(null);
  const headerDrag = useRef(null);
  const suppressWeekClick = useRef(false);
  const selected = fromISO(selectedDate);
  const weekStart = startOfWeek(selected);
  const weekEnd = addDays(weekStart, 6);
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const dayTasks = sortTasks(tasks.filter((task) => task.type === "day" && task.date === selectedDate));
  const visibleByType = (type) => sortTasks(tasks.filter((task) => {
    if (task.type !== type) return false;
    const taskDate = fromISO(task.date);
    if (type === "day") return task.date === selectedDate;
    if (type === "week") return taskDate >= weekStart && taskDate <= weekEnd;
    return taskDate.getFullYear() === selected.getFullYear() && taskDate.getMonth() === selected.getMonth();
  }));
  const tasksByType = {
    day: visibleByType("day"),
    week: visibleByType("week"),
    month: visibleByType("month"),
  };
  const upcomingTasks = sortTasks(tasks.filter((task) => !task.completed && task.date > localISO(new Date()))).slice(0, 12);
  const hasSidePanel = settings.showCalendar || upcomingTasks.length > 0;
  const isKittyTheme = settings.theme === "hello-kitty";
  const selectedWeek = getISOWeekInfo(selected);

  function goToToday() {
    const current = new Date();
    setSelectedDate(localISO(current));
    setCursor(new Date(current.getFullYear(), current.getMonth(), 1));
  }

  function beginWeekPointer(event) {
    if (event.button !== 0) return;
    weekDrag.current = {
      pointerId: event.pointerId,
      startX: event.screenX,
      startY: event.screenY,
      dragging: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function moveWeekPointer(event) {
    const drag = weekDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.dragging && Math.hypot(event.screenX - drag.startX, event.screenY - drag.startY) >= 6) {
      drag.dragging = true;
      window.desktopAPI?.beginWindowDrag?.(drag.startX, drag.startY);
    }
    if (!drag.dragging) return;
    event.preventDefault();
    window.desktopAPI?.moveWindowDrag?.(event.screenX, event.screenY);
  }

  function finishWeekPointer(event) {
    const drag = weekDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    if (drag.dragging) {
      suppressWeekClick.current = true;
      window.desktopAPI?.endWindowDrag?.();
      window.setTimeout(() => { suppressWeekClick.current = false; }, 0);
    }
    weekDrag.current = null;
  }

  function cancelWeekPointer(event) {
    const drag = weekDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.dragging) window.desktopAPI?.endWindowDrag?.();
    weekDrag.current = null;
  }

  function selectWeekDate(event, iso) {
    if (suppressWeekClick.current) {
      event.preventDefault();
      suppressWeekClick.current = false;
      return;
    }
    setSelectedDate(iso);
  }

  function beginHeaderPointer(event) {
    if (event.button !== 0 || event.target.closest("button")) return;
    headerDrag.current = {
      pointerId: event.pointerId,
      startX: event.screenX,
      startY: event.screenY,
      dragging: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function moveHeaderPointer(event) {
    const drag = headerDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.dragging && Math.hypot(event.screenX - drag.startX, event.screenY - drag.startY) >= 4) {
      drag.dragging = true;
      window.desktopAPI?.beginWindowDrag?.(drag.startX, drag.startY);
    }
    if (!drag.dragging) return;
    event.preventDefault();
    window.desktopAPI?.moveWindowDrag?.(event.screenX, event.screenY);
  }

  function finishHeaderPointer(event) {
    const drag = headerDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    }
    if (drag.dragging) window.desktopAPI?.endWindowDrag?.();
    headerDrag.current = null;
  }

  function cancelHeaderPointer(event) {
    const drag = headerDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.dragging) window.desktopAPI?.endWindowDrag?.();
    headerDrag.current = null;
  }

  return (
    <div className="full-view">
      <nav className="week-strip glass-panel" aria-label={copy.thisWeek}>
        {weekDays.map((date) => {
          const iso = localISO(date);
          return (
            <button
              key={iso}
              className={iso === selectedDate ? "active" : ""}
              onPointerDown={beginWeekPointer}
              onPointerMove={moveWeekPointer}
              onPointerUp={finishWeekPointer}
              onPointerCancel={cancelWeekPointer}
              onClick={(event) => selectWeekDate(event, iso)}
            >
              <strong>{formatMonthDay(date, copy)}</strong>
              <span>{copy.weekdays[date.getDay()]}</span>
              <i />
            </button>
          );
        })}
      </nav>

      <section className={`hero-grid ${hasSidePanel ? "" : "without-side"}`}>
        <div className="today-panel glass-panel">
          <header
            className="panel-header"
            onPointerDown={beginHeaderPointer}
            onPointerMove={moveHeaderPointer}
            onPointerUp={finishHeaderPointer}
            onPointerCancel={cancelHeaderPointer}
          >
            <div>
              <h1 className={isKittyTheme ? "kitty-today-heading" : ""}>
                {isKittyTheme ? <KittyWhiskers><span>{selectedDate === localISO(new Date()) ? copy.today : formatMonthDay(selected, copy)}</span> · {copy.weekdays[selected.getDay()]}</KittyWhiskers> : <><span>{selectedDate === localISO(new Date()) ? copy.today : formatMonthDay(selected, copy)}</span> · {copy.weekdays[selected.getDay()]}</>}
                {settings.showWeekNumbers && <em className="week-number-badge" title={formatISOWeekTitle(selected, copy)}>W{selectedWeek.week}</em>}
              </h1>
              <p>{formatFullDate(selected, copy)}</p>
            </div>
            <div className="header-actions">
              <button className="outline-button" onClick={() => onAdd("day")}><Plus weight="bold" /> {copy.addTask}</button>
              <button className="icon-button" onClick={onOpenSettings} title={copy.displaySettings}><GearSix /></button>
              <button className="icon-button" onClick={onMini} title={copy.switchCompact}><Minus /></button>
            </div>
          </header>
          <div className="timeline-list">
            {dayTasks.length ? dayTasks.map((task) => (
              <div className="timeline-entry" key={task.id}>
                <span className="timeline-time">{task.time || ""}</span>
                <span className={`timeline-dot ${TYPE_META[task.type].color}`} />
                <TaskRow task={task} onToggle={onToggle} onEdit={onEdit} onMove={onMove} copy={copy} reminderTimeOnly reorderable={canManuallyOrder(task)} />
              </div>
            )) : (
              <button className="empty-state" onClick={() => onAdd("day")}><Plus /> {copy.noTasks}</button>
            )}
          </div>
        </div>

        {hasSidePanel && <aside className={`calendar-side ${settings.showCalendar ? "" : "upcoming-only"}`}>
          {settings.showCalendar && <div className="mini-calendar glass-panel">
            <header>
              <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><CaretLeft /></button>
              <strong>{isKittyTheme ? <KittyWhiskers>{formatMonth(cursor, copy)}</KittyWhiskers> : formatMonth(cursor, copy)}</strong>
              <button className={`today-jump-button ${selectedDate === localISO(new Date()) ? "active" : ""}`} onClick={goToToday} title={copy.goToToday}>{copy.today}</button>
              <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><CaretRight /></button>
            </header>
            <CalendarGrid cursor={cursor} selectedDate={selectedDate} onSelect={setSelectedDate} copy={copy} compact showWeekNumbers={settings.showWeekNumbers} />
          </div>}
          <UpcomingPanel tasks={upcomingTasks} onSelect={setSelectedDate} copy={copy} kitty={isKittyTheme} />
        </aside>}
      </section>

      {isKittyTheme ? <section className="overview-panel glass-panel kitty-overview-panel">
        {Object.entries(TYPE_META).map(([type, meta], index) => {
          const typeTasks = tasksByType[type];
          const completed = typeTasks.filter((task) => task.completed).length;
          const pending = typeTasks.length - completed;
          const icon = [kittyHomeDayIcon, kittyHomeWeekIcon, kittyHomeMonthIcon][index];
          return <button className={`kitty-summary ${meta.color}`} key={type} onClick={() => onViewAll(type)}>
            <header><span><img className="kitty-summary-icon" src={icon} alt="" /> {copy.types[type]} <img className="kitty-summary-bow" src={kittyHomeTinyBow} alt="" /></span></header>
            <div className="kitty-summary-body">
              <div className="kitty-total"><strong>{typeTasks.length}</strong><span>{typeTasks.length === 1 ? copy.taskUnitOne : copy.taskUnitMany}</span></div>
              <dl>
                <div><dt><i className="pending" />{copy.pendingStatus}</dt><dd>{pending}</dd></div>
                <div><dt><i className="done" />{copy.completedStatus}</dt><dd>{completed}</dd></div>
              </dl>
              {type === "month" && <img className="kitty-overview-mascot" src={kittyHomeMascot} alt="" />}
            </div>
          </button>;
        })}
      </section> : <section className="overview-panel glass-panel">
        {Object.entries(TYPE_META).map(([type, meta]) => (
          <div className={`task-group ${meta.color}`} key={type}>
            <header>
              <span><CalendarCheck weight="duotone" /> {copy.types[type]}</span>
              <b>{tasksByType[type].length}</b>
            </header>
            <div className="group-list">
              {tasksByType[type].map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onMove={onMove} copy={copy} compact showDate={type !== "day"} reorderable={type === "day" && canManuallyOrder(task)} />)}
            </div>
            <footer className="task-group-actions">
              <button className="text-button" onClick={() => onAdd(type)}><Plus /> {copy.add} {copy.types[type]}</button>
              <button className="view-all-button" onClick={() => onViewAll(type)}>{copy.viewAll} <ArrowRight /></button>
            </footer>
          </div>
        ))}
      </section>}
    </div>
  );
}

function PeriodTasksModal({ type, tasks, copy, onToggle, onEdit, onAdd, onClose }) {
  const completed = tasks.filter((task) => task.completed).length;
  const title = type === "day" ? copy.allDayTasks : type === "week" ? copy.allWeekTasks : copy.allMonthTasks;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`period-tasks-panel glass-panel ${TYPE_META[type].color}`} aria-label={title}>
        <header>
          <div>
            <span className="eyebrow">{copy.types[type]}</span>
            <h2>{title}</h2>
            <p>{tasks.length} · {copy.completedCount} {completed}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label={copy.closeSettings}><X /></button>
        </header>
        <div className="period-task-list">
          {tasks.length ? tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} copy={copy} showDate={type !== "day"} />
          )) : <button className="empty-state" onClick={onAdd}><Plus /> {copy.add} {copy.types[type]}</button>}
        </div>
        <footer>
          <button type="button" className="outline-button" onClick={onAdd}><Plus weight="bold" /> {copy.add} {copy.types[type]}</button>
        </footer>
      </section>
    </div>
  );
}

function CompactView({ tasks, selectedDate, setSelectedDate, cursor, setCursor, settings, copy, onToggle, onEdit, onAdd, onQuickAdd, onExpand, onMicro, onOpenSettings }) {
  const selected = fromISO(selectedDate);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const dayTasks = sortTasks(tasks.filter((task) => task.type === "day" && task.date === selectedDate));
  const weekStartDate = startOfWeek(selected);
  const weekEndDate = addDays(weekStartDate, 6);
  const weekTasks = sortTasks(tasks.filter((task) => task.type === "week" && fromISO(task.date) >= weekStartDate && fromISO(task.date) <= weekEndDate));
  const monthTasks = sortTasks(tasks.filter((task) => task.type === "month" && fromISO(task.date).getFullYear() === selected.getFullYear() && fromISO(task.date).getMonth() === selected.getMonth()));
  const dateLabel = selectedDate === localISO(new Date()) ? copy.today : formatMonthDay(selected, copy);
  const selectedWeek = getISOWeekInfo(selected);

  return (
    <div className="compact-view glass-panel">
      <header className="compact-header">
        <span className="drag-handle"><DotsSixVertical weight="bold" /></span>
        <h1>
          <span>{dateLabel}</span> · {selectedDate === localISO(new Date()) ? `${formatMonthDay(selected, copy)} ` : ""}{copy.weekdays[selected.getDay()]}
          {settings.showWeekNumbers && <em className="week-number-badge" title={formatISOWeekTitle(selected, copy)}>W{selectedWeek.week}</em>}
        </h1>
        <button className="outline-button" onClick={() => setQuickAddOpen(true)}><Plus weight="bold" /> {copy.quickAdd}</button>
        <button className="icon-button" onClick={onOpenSettings} title={copy.displaySettings}><GearSix /></button>
        <button className="icon-button" onClick={onMicro} title={copy.microMode}><Minus /></button>
        <button className="icon-button expand-button" onClick={onExpand} title={copy.expand}><ArrowsOut /></button>
      </header>
      {quickAddOpen && <QuickAdd selectedDate={selectedDate} onAdd={onQuickAdd} onClose={() => setQuickAddOpen(false)} copy={copy} />}
      <div className={`compact-columns ${settings.showCalendar ? "" : "without-calendar"}`}>
        {settings.showCalendar && <section className="compact-calendar">
          <h2><CalendarCheck weight="duotone" /> {copy.miniCalendar}</h2>
          <header>
            <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><CaretLeft /></button>
            <strong>{formatMonth(cursor, copy)}</strong>
            <button className="icon-button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><CaretRight /></button>
          </header>
          <CalendarGrid cursor={cursor} selectedDate={selectedDate} onSelect={setSelectedDate} copy={copy} compact showWeekNumbers={settings.showWeekNumbers} />
        </section>}
        <section className="compact-today">
          <h2><Check weight="bold" /> {selectedDate === localISO(new Date()) ? copy.todayTasks : copy.selectedTasks} <b>{dayTasks.length}</b></h2>
          <div className="compact-list">
            {dayTasks.map((task) => <TaskRow task={task} onToggle={onToggle} onEdit={onEdit} copy={copy} key={task.id} compact />)}
            {!dayTasks.length && <button className="empty-state" onClick={() => onAdd("day")}><Plus /> {copy.addToday}</button>}
          </div>
        </section>
        <section className="compact-horizon">
          <div className="horizon-block violet">
            <h2><CalendarBlank weight="duotone" /> {copy.thisWeek} <b>{weekTasks.length}</b></h2>
            {weekTasks.map((task) => <TaskRow task={task} onToggle={onToggle} onEdit={onEdit} copy={copy} key={task.id} compact />)}
          </div>
          <div className="horizon-block coral">
            <h2><CalendarBlank weight="duotone" /> {copy.thisMonth} <b>{monthTasks.length}</b></h2>
            {monthTasks.map((task) => <TaskRow task={task} onToggle={onToggle} onEdit={onEdit} copy={copy} key={task.id} compact showDate />)}
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniView({ tasks, selectedDate, settings, copy, onToggle, onEdit, onMove, onQuickAdd, onExpand, onOpenSettings }) {
  const selected = fromISO(selectedDate);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const dayTasks = sortTasks(tasks.filter((task) => task.type === "day" && task.date === selectedDate));
  const remaining = dayTasks.filter((task) => !task.completed);
  const selectedWeek = getISOWeekInfo(selected);

  return (
    <div className="micro-view glass-panel">
      <header className="micro-drag-header">
        <div className="micro-date">
          <span>{selectedDate === localISO(new Date()) ? copy.today : formatMonthDay(selected, copy)}</span>
          <strong>{copy.weekdays[selected.getDay()]}</strong>
          {settings.showWeekNumbers && <em className="week-number-badge" title={formatISOWeekTitle(selected, copy)}>W{selectedWeek.week}</em>}
        </div>
        <div>
          <button className="icon-button" onClick={() => setQuickAddOpen(true)} title={copy.quickAdd}><Plus /></button>
          <button className="icon-button" onClick={onOpenSettings} title={copy.displaySettings}><GearSix /></button>
          <button className="icon-button" onClick={onExpand} title={copy.expand}><ArrowsOut /></button>
        </div>
      </header>
      {quickAddOpen && <QuickAdd selectedDate={selectedDate} onAdd={onQuickAdd} onClose={() => setQuickAddOpen(false)} copy={copy} />}
      <section>
        <h2><Check weight="bold" /> {copy.todayTasks} <b>{remaining.length}</b></h2>
        <div className="micro-list">
          {remaining.slice(0, 5).map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onMove={onMove} copy={copy} compact reorderable={canManuallyOrder(task)} />)}
          {!dayTasks.length && <button className="empty-state" onClick={() => setQuickAddOpen(true)}><Plus /> {copy.addToday}</button>}
          {dayTasks.length > 0 && !remaining.length && <div className="micro-all-done"><Check weight="bold" /> {copy.allDone}</div>}
        </div>
      </section>
    </div>
  );
}

export function App() {
  const [today, setToday] = useState(() => new Date());
  const todayISORef = useRef(localISO(today));
  const [records, setRecords] = useState(() => makeDefaults(today));
  const [hydrated, setHydrated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(localISO(today));
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [mode, setMode] = useState("full");
  const [editor, setEditor] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsHydrated, setSettingsHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [clickThroughNotice, setClickThroughNotice] = useState(null);
  const [taskListView, setTaskListView] = useState(null);
  const [updateState, setUpdateState] = useState({ status: "idle", currentVersion: APP_VERSION, availableVersion: null, progress: 0, error: null });
  const copy = COPY[settings.language] || COPY.zh;
  const panelOpacity = Math.max(0.4, Math.min(1, Number(settings.opacity) || DEFAULT_SETTINGS.opacity));
  const tasks = useMemo(() => records.filter((item) => !isTemplate(item)), [records]);
  const periodTasks = useMemo(() => {
    if (!taskListView) return [];
    const selected = fromISO(selectedDate);
    if (taskListView === "day") {
      return sortTasks(tasks.filter((task) => task.type === "day" && task.date === selectedDate));
    }
    if (taskListView === "week") {
      const first = startOfWeek(selected);
      const last = addDays(first, 6);
      return sortTasks(tasks.filter((task) => task.type === "week" && fromISO(task.date) >= first && fromISO(task.date) <= last));
    }
    return sortTasks(tasks.filter((task) => task.type === "month" && fromISO(task.date).getFullYear() === selected.getFullYear() && fromISO(task.date).getMonth() === selected.getMonth()));
  }, [taskListView, tasks, selectedDate]);
  const todayISO = localISO(today);
  const overdueTasks = useMemo(() => tasks.filter((task) => !task.completed && task.date < todayISO && task.overdueDecisionDate !== todayISO), [tasks, todayISO]);
  const recurrenceRevision = useMemo(() => records.filter(isTemplate).map((item) => JSON.stringify(item)).join("|"), [records]);

  useEffect(() => {
    const refreshCurrentDate = () => {
      const current = new Date();
      const nextTodayISO = localISO(current);
      const previousTodayISO = todayISORef.current;
      if (nextTodayISO === previousTodayISO) return;

      todayISORef.current = nextTodayISO;
      setToday(current);
      setSelectedDate((currentSelectedDate) => (
        currentSelectedDate === previousTodayISO ? nextTodayISO : currentSelectedDate
      ));
    };
    const handleVisibilityChange = () => {
      if (!document.hidden) refreshCurrentDate();
    };

    refreshCurrentDate();
    const timer = window.setInterval(refreshCurrentDate, 30_000);
    window.addEventListener("focus", refreshCurrentDate);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const unsubscribeSystemDateRefresh = window.desktopAPI?.onSystemDateRefresh?.(refreshCurrentDate);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshCurrentDate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribeSystemDateRefresh?.();
    };
  }, []);

  useEffect(() => {
    loadTasks().then((saved) => {
      if (saved?.length) setRecords(saved);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    loadSettings().then((saved) => {
      setSettings({ ...DEFAULT_SETTINGS, ...saved });
      setSettingsHydrated(true);
    });
    const unsubscribe = window.desktopAPI?.onClickThroughChanged?.((value) => {
      setSettings((current) => ({ ...current, clickThrough: value }));
      setClickThroughNotice(value ? "enabled" : "disabled");
      if (value) setSettingsOpen(false);
    });
    const unsubscribeTasks = window.desktopAPI?.onTasksUpdated?.((value) => setRecords(value));
    const unsubscribeSettings = window.desktopAPI?.onSettingsUpdated?.((value) => setSettings((current) => ({ ...current, ...value })));
    window.desktopAPI?.getUpdateState?.().then((value) => value && setUpdateState(value));
    const unsubscribeUpdate = window.desktopAPI?.onUpdateStateChanged?.((value) => setUpdateState(value));
    return () => {
      unsubscribe?.();
      unsubscribeTasks?.();
      unsubscribeSettings?.();
      unsubscribeUpdate?.();
    };
  }, []);

  useEffect(() => {
    if (!clickThroughNotice) return undefined;
    const timer = window.setTimeout(() => setClickThroughNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [clickThroughNotice]);

  useEffect(() => {
    if (hydrated) persistTasks(records);
  }, [records, hydrated]);

  useEffect(() => {
    if (settingsHydrated) persistSettings(settings);
  }, [settings, settingsHydrated]);

  useEffect(() => {
    document.documentElement.lang = settings.language === "en" ? "en" : "zh-CN";
    document.documentElement.classList.toggle("desktop-runtime", Boolean(window.desktopAPI));
  }, [settings.language]);

  useEffect(() => {
    const selected = fromISO(selectedDate);
    if (selected.getMonth() !== cursor.getMonth() || selected.getFullYear() !== cursor.getFullYear()) {
      setCursor(new Date(selected.getFullYear(), selected.getMonth(), 1));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!hydrated) return;
    const selected = fromISO(selectedDate);
    const currentToday = fromISO(todayISO);
    const horizonBase = selected > currentToday ? selected : currentToday;
    const horizon = localISO(endOfMonthAfter(horizonBase, 2));
    setRecords((current) => {
      const next = materializeRecurring(current, horizon);
      return next.length === current.length ? current : next;
    });
  }, [hydrated, selectedDate, todayISO, recurrenceRevision]);

  function toggleTask(id) {
    setRecords((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  function moveUntimedDayTask(taskId, direction) {
    setRecords((current) => {
      const source = current.find((task) => task.id === taskId);
      if (!source || !canManuallyOrder(source)) return current;
      const ordered = sortTasks(current.filter((task) => canManuallyOrder(task) && task.date === source.date));
      const sourceIndex = ordered.findIndex((task) => task.id === taskId);
      const targetIndex = sourceIndex + (direction === "up" ? -1 : 1);
      if (sourceIndex < 0 || targetIndex < 0 || targetIndex >= ordered.length) return current;
      [ordered[sourceIndex], ordered[targetIndex]] = [ordered[targetIndex], ordered[sourceIndex]];
      const orderById = new Map(ordered.map((task, index) => [task.id, index]));
      return current.map((task) => orderById.has(task.id) ? { ...task, manualOrder: orderById.get(task.id) } : task);
    });
  }

  function saveTask(task, options) {
    const { repeat, editScope, reminder } = options;
    setRecords((current) => {
      const existing = current.find((item) => item.id === task.id);
      const cleanTask = { ...task };
      if (existing && canManuallyOrder(cleanTask) && existing.date === cleanTask.date && Number.isFinite(existing.manualOrder)) {
        cleanTask.manualOrder = existing.manualOrder;
      }

      if (existing?.templateId && editScope === "occurrence") {
        return current.map((item) => item.id === task.id
          ? { ...cleanTask, templateId: existing.templateId, occurrenceDate: existing.occurrenceDate || existing.date }
          : item);
      }

      if (existing?.templateId && editScope === "series") {
        const cutoff = existing.occurrenceDate || existing.date;
        if (repeat === "none") {
          return current
            .filter((item) => item.id !== existing.templateId)
            .filter((item) => !(item.templateId === existing.templateId && !item.completed && (item.occurrenceDate || item.date) >= cutoff))
            .concat({ ...cleanTask, templateId: undefined, occurrenceDate: undefined });
        }
        const template = {
          id: existing.templateId,
          kind: "recurrence-template",
          frequency: repeat,
          anchorDate: cleanTask.date,
          title: cleanTask.title,
          type: cleanTask.type,
          time: cleanTask.time,
          reminder,
          skippedDates: [],
          endDate: "",
        };
        const kept = current
          .filter((item) => item.id !== existing.templateId)
          .filter((item) => !(item.templateId === existing.templateId && !item.completed && (item.occurrenceDate || item.date) >= cutoff));
        return [...kept, template, { ...cleanTask, templateId: template.id, occurrenceDate: cleanTask.date }];
      }

      if (repeat !== "none") {
        const templateId = `series-${uuid()}`;
        const template = {
          id: templateId,
          kind: "recurrence-template",
          frequency: repeat,
          anchorDate: cleanTask.date,
          title: cleanTask.title,
          type: cleanTask.type,
          time: cleanTask.time,
          reminder,
          skippedDates: [],
          endDate: "",
        };
        const instance = { ...cleanTask, templateId, occurrenceDate: cleanTask.date };
        return current.some((item) => item.id === cleanTask.id)
          ? [...current.filter((item) => item.id !== cleanTask.id), template, instance]
          : [...current, template, instance];
      }

      return current.some((item) => item.id === cleanTask.id)
        ? current.map((item) => item.id === cleanTask.id ? cleanTask : item)
        : [...current, cleanTask];
    });
    setSelectedDate(task.date);
    setEditor(null);
  }

  function quickAddTask(title) {
    const task = {
      id: uuid(),
      title,
      type: "day",
      date: selectedDate,
      time: "",
      reminderAt: "",
      completed: false,
    };
    setRecords((current) => [...current, task]);
  }

  function deleteTask(id, scope = "occurrence") {
    setRecords((current) => {
      const task = current.find((item) => item.id === id);
      if (!task?.templateId) return current.filter((item) => item.id !== id);
      const occurrenceDate = task.occurrenceDate || task.date;
      if (scope === "series") {
        return current
          .map((item) => item.id === task.templateId ? { ...item, endDate: previousDayISO(occurrenceDate) } : item)
          .filter((item) => !(item.templateId === task.templateId && !item.completed && (item.occurrenceDate || item.date) >= occurrenceDate));
      }
      return current
        .map((item) => item.id === task.templateId ? { ...item, skippedDates: [...new Set([...(item.skippedDates || []), occurrenceDate])] } : item)
        .filter((item) => item.id !== id);
    });
    setEditor(null);
  }

  function openEditor(task) {
    const template = task?.templateId ? records.find((item) => item.id === task.templateId) : null;
    setEditor({ type: task.type, task, repeat: template?.frequency || "none" });
  }

  async function exportData() {
    if (window.desktopAPI) return window.desktopAPI.exportData();
    const payload = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), tasks: records, settings }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `FocusCalendar-backup-${localISO(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  }

  async function importData(file) {
    if (window.desktopAPI) {
      const result = await window.desktopAPI.importData();
      if (!result) return false;
      setRecords(result.tasks);
      setSettings((current) => ({ ...current, ...result.settings }));
      return true;
    }
    if (!file) return false;
    const imported = JSON.parse(await file.text());
    const importedTasks = Array.isArray(imported) ? imported : imported.tasks;
    if (!Array.isArray(importedTasks)) return false;
    const confirmed = window.confirm(settings.language === "en" ? "Importing this backup will replace current tasks and settings. Continue?" : "导入该备份将替换当前任务和设置，是否继续？");
    if (!confirmed) return false;
    setRecords(importedTasks);
    if (imported.settings) setSettings((current) => ({ ...current, ...imported.settings }));
    return true;
  }

  function handleOverdue(action) {
    const overdueIds = new Set(overdueTasks.map((task) => task.id));
    setRecords((current) => current.map((task) => {
      if (!overdueIds.has(task.id)) return task;
      if (action === "rollover") {
        return {
          ...task,
          date: todayISO,
          reminderAt: task.reminderAt && task.time ? `${todayISO}T${task.time}` : "",
          overdueDecisionDate: todayISO,
        };
      }
      if (action === "abandon") return { ...task, completed: true, abandoned: true, overdueDecisionDate: todayISO };
      return { ...task, overdueDecisionDate: todayISO };
    }));
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    window.desktopAPI?.setWindowMode(nextMode);
  }

  const isKittyReferenceLayout = mode === "full" && settings.theme === "hello-kitty";
  const fullView = (
    <FullView
      tasks={tasks}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      cursor={cursor}
      setCursor={setCursor}
      settings={settings}
      copy={copy}
      onToggle={toggleTask}
      onEdit={openEditor}
      onMove={moveUntimedDayTask}
      onAdd={(type) => setEditor({ type })}
      onMini={() => changeMode("mini")}
      onViewAll={setTaskListView}
      onOpenSettings={() => setSettingsOpen(true)}
    />
  );

  return (
    <main
      className={`app-shell mode-${mode} theme-${settings.theme || "classic"} ${isKittyReferenceLayout ? "kitty-reference-layout" : ""}`}
      onDragStart={(event) => event.preventDefault()}
      style={{
        "--surface": settings.theme === "hello-kitty" ? `rgb(255 253 251 / ${panelOpacity})` : `rgb(15 29 42 / ${panelOpacity})`,
        "--surface-soft": settings.theme === "hello-kitty" ? `rgb(255 249 249 / ${panelOpacity * 0.96})` : `rgb(18 34 49 / ${panelOpacity * 0.85})`,
        "--surface-deep": settings.theme === "hello-kitty" ? `rgb(255 246 247 / ${panelOpacity * 0.98})` : `rgb(8 20 31 / ${panelOpacity * 0.96})`,
      }}
    >
      {isKittyReferenceLayout ? (
        <KittyReferenceStage>
          <img className="kitty-corner-bow" src={kittyHomeCornerBow} alt="" aria-hidden="true" />
          <img className="kitty-side-heart" src={kittyHomeSideHeart} alt="" aria-hidden="true" />
          {fullView}
        </KittyReferenceStage>
      ) : mode === "full" ? (
        <>
          <img className="kitty-corner-bow" src={kittyHomeCornerBow} alt="" aria-hidden="true" />
          {fullView}
        </>
      ) : (
        <>
          <img className="kitty-corner-bow" src={kittyBow} alt="" aria-hidden="true" />
          <MiniView
            tasks={tasks}
            selectedDate={selectedDate}
            settings={settings}
            copy={copy}
            onToggle={toggleTask}
            onEdit={openEditor}
            onMove={moveUntimedDayTask}
            onQuickAdd={quickAddTask}
            onExpand={() => changeMode("full")}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </>
      )}
      {taskListView && <PeriodTasksModal type={taskListView} tasks={periodTasks} copy={copy} onToggle={toggleTask} onEdit={openEditor} onAdd={() => setEditor({ type: taskListView })} onClose={() => setTaskListView(null)} />}
      {editor && <TaskEditor selectedDate={selectedDate} initialType={editor.type} initialTask={editor.task} initialRepeat={editor.repeat} copy={copy} onClose={() => setEditor(null)} onSave={saveTask} onDelete={deleteTask} />}
      {settingsOpen && <SettingsPanel settings={settings} onChange={setSettings} onClose={() => setSettingsOpen(false)} onClickThroughChange={(value) => setClickThroughNotice(value ? "enabled" : "disabled")} copy={copy} onExport={exportData} onImport={importData} onOpenData={() => window.desktopAPI?.openDataFolder?.()} onExit={() => window.desktopAPI?.closeWindow?.()} updateState={updateState} onCheckUpdate={() => window.desktopAPI?.checkForUpdates?.()} onInstallUpdate={() => window.desktopAPI?.installUpdate?.()} />}
      {clickThroughNotice && <div className="click-through-toast" role="status">{clickThroughNotice === "enabled" ? copy.clickEnabled : copy.clickDisabled}</div>}
      {!editor && !settingsOpen && overdueTasks.length > 0 && <OverduePanel tasks={overdueTasks} copy={copy} onAction={handleOverdue} />}
    </main>
  );
}
