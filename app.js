/* Duty AttendancePro — app logic (vanilla JS, localStorage-backed, offline-first) */
(() => {
  'use strict';

  const STORAGE_KEY = 'dap_records_v1';
  const SETTINGS_KEY = 'dap_settings_v1';
  const ONBOARD_KEY = 'dap_onboarded_v1';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const pad = (n) => String(n).padStart(2, '0');
  const todayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fmtTime = (d) => `${pad(d.getHours() % 12 === 0 ? 12 : d.getHours() % 12)}:${pad(d.getMinutes())} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;

  const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // ---------- state ----------
  let records = {};
  let settings = { name: 'there', wage: 500, currency: '₹', theme: 'light', notif: false };
  let calCursor = new Date();
  calCursor.setDate(1);
  let sheetTargetDate = null;

  function loadState() {
    try { records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { records = {}; }
    try { settings = Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}); } catch (e) {}
  }
  function saveRecords() { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
  function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

  // ---------- toast ----------
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // ================= SPLASH =================
  function runSplash() {
    const splash = $('#splash');
    setTimeout(() => {
      splash.classList.add('hide');
      setTimeout(() => {
        splash.style.display = 'none';
        if (localStorage.getItem(ONBOARD_KEY)) {
          startApp();
        } else {
          $('#onboarding').classList.add('show');
        }
      }, 650);
    }, 1700);
  }

  // ================= ONBOARDING =================
  function initOnboarding() {
    const slides = $$('.ob-slide');
    const dotsWrap = $('#obDots');
    let idx = 0;
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'ob-dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(d);
    });
    const dots = $$('.ob-dot');

    function render() {
      $('#obTrack').style.setProperty('--slide-offset', idx);
      slides.forEach((s, i) => { s.style.setProperty('--slide-offset', idx - i); s.style.transform = `translateX(${(i - idx) * 100}%)`; });
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      $('#obBack').classList.toggle('show', idx > 0);
      $('#obNext').innerHTML = idx === slides.length - 1 ? 'Get started' : 'Continue';
    }
    render();

    $('#obNext').addEventListener('click', () => {
      if (idx < slides.length - 1) { idx++; render(); }
      else finishOnboarding();
    });
    $('#obBack').addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
    $('#obSkip').addEventListener('click', finishOnboarding);

    // swipe support
    let startX = null;
    const track = $('#obTrack');
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (dx < -40 && idx < slides.length - 1) idx++;
      else if (dx > 40 && idx > 0) idx--;
      render();
      startX = null;
    }, { passive: true });

    function finishOnboarding() {
      localStorage.setItem(ONBOARD_KEY, '1');
      $('#onboarding').classList.remove('show');
      startApp();
    }
  }

  // ================= APP =================
  function startApp() {
    $('#app').classList.add('show');
    applyTheme();
    hydrateSettingsUI();
    renderHome();
    renderCalendar();
    renderSalary();
    updateGreeting();
  }

  function updateGreeting() {
    const h = new Date().getHours();
    const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    $('#greetText').textContent = `${part}, ${settings.name || 'there'} 👋`;
    $('#dateText').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    $('#avatarBtn').textContent = (settings.name || 'D').trim().charAt(0).toUpperCase() || 'D';
  }

  // ---------- punch clock ----------
  function renderHome() {
    const key = todayKey();
    const rec = records[key];
    const pill = $('#punchPill'), clock = $('#punchClock'), sub = $('#punchSub'), btn = $('#punchBtn'), label = $('#punchBtnLabel');

    if (rec && rec.inTime && !rec.outTime) {
      pill.textContent = 'On duty'; pill.classList.add('on');
      clock.textContent = rec.inTime;
      sub.textContent = 'Punched in — tap to punch out';
      label.textContent = 'PUNCH OUT';
      btn.classList.add('out');
    } else if (rec && rec.inTime && rec.outTime) {
      pill.textContent = 'Duty complete'; pill.classList.add('on');
      clock.textContent = rec.outTime;
      sub.textContent = `In ${rec.inTime} · Out ${rec.outTime}`;
      label.textContent = 'DONE';
      btn.classList.add('out');
      btn.disabled = true;
    } else {
      pill.textContent = 'Not started'; pill.classList.remove('on');
      clock.textContent = '--:--';
      sub.textContent = 'Tap below to punch in';
      label.textContent = 'PUNCH IN';
      btn.classList.remove('out');
      btn.disabled = false;
    }
    renderMonthStats();
  }

  function doPunch() {
    const key = todayKey();
    const now = new Date();
    const timeStr = fmtTime(now);
    if (!records[key]) records[key] = {};
    const rec = records[key];

    if (!rec.inTime) {
      rec.inTime = timeStr;
      rec.status = 'present';
      toast('Punched in at ' + timeStr);
    } else if (!rec.outTime) {
      rec.outTime = timeStr;
      toast('Punched out at ' + timeStr);
    } else {
      return;
    }
    saveRecords();
    stampAnim();
    renderHome();
    renderCalendar();
    renderSalary();
  }

  function stampAnim() {
    const ring = $('#stampRing');
    ring.classList.remove('animate');
    void ring.offsetWidth;
    ring.classList.add('animate');
    if (navigator.vibrate) navigator.vibrate(18);
  }

  function hoursForRecord(rec) {
    if (!rec || !rec.inTime || !rec.outTime) return 0;
    const parse = (s) => {
      const [time, mer] = s.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (mer === 'PM' && h !== 12) h += 12;
      if (mer === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    let diff = parse(rec.outTime) - parse(rec.inTime);
    if (diff < 0) diff += 24 * 60;
    return diff / 60;
  }

  function monthRecords(date = calCursor) {
    const y = date.getFullYear(), m = date.getMonth();
    return Object.entries(records).filter(([k]) => {
      const [ry, rm] = k.split('-').map(Number);
      return ry === y && rm === m + 1;
    });
  }

  function renderMonthStats() {
    const now = new Date();
    const entries = monthRecords(now);
    let present = 0, absent = 0, hours = 0;
    entries.forEach(([, r]) => {
      if (r.status === 'present') present++;
      else if (r.status === 'absent') absent++;
      hours += hoursForRecord(r);
    });
    $('#statPresent').textContent = present;
    $('#statAbsent').textContent = absent;
    $('#statHours').textContent = (Math.round(hours * 10) / 10) + 'h';
    const wage = Number(settings.wage) || 0;
    const leave = entries.filter(([, r]) => r.status === 'leave').length;
    const earned = (present + leave) * wage;
    $('#homeSalary').textContent = settings.currency + earned.toLocaleString('en-IN');
  }

  // ---------- calendar ----------
  function renderCalendar() {
    $('#calMonthLabel').textContent = `${MONTHS[calCursor.getMonth()]} ${calCursor.getFullYear()}`;
    const dowWrap = $('#calDow');
    if (!dowWrap.children.length) DOW.forEach(d => { const el = document.createElement('div'); el.className = 'cal-dow'; el.textContent = d; dowWrap.appendChild(el); });

    const grid = $('#calGrid');
    grid.innerHTML = '';
    const y = calCursor.getFullYear(), m = calCursor.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const todayStr = todayKey();

    for (let i = 0; i < firstDow; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${y}-${pad(m + 1)}-${pad(d)}`;
      const rec = records[key];
      const cell = document.createElement('div');
      cell.className = 'cal-day' + (rec && rec.status ? ' ' + rec.status : '') + (key === todayStr ? ' today' : '');
      cell.textContent = d;
      cell.addEventListener('click', () => openStatusSheet(key));
      grid.appendChild(cell);
    }
    renderSalary();
  }

  function openStatusSheet(key) {
    sheetTargetDate = key;
    const d = new Date(key + 'T00:00:00');
    $('#sheetDate').textContent = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    $('#sheetBackdrop').classList.add('show');
    $('#statusSheet').classList.add('show');
  }
  function closeSheet() {
    $('#sheetBackdrop').classList.remove('show');
    $('#statusSheet').classList.remove('show');
    sheetTargetDate = null;
  }

  // ---------- salary ----------
  function renderSalary() {
    const entries = monthRecords();
    const present = entries.filter(([, r]) => r.status === 'present').length;
    const leave = entries.filter(([, r]) => r.status === 'leave').length;
    const wage = Number(settings.wage) || 0;
    const total = (present + leave) * wage;
    $('#salWage').textContent = settings.currency + wage.toLocaleString('en-IN');
    $('#salPresent').textContent = present;
    $('#salLeave').textContent = leave;
    $('#salTotal').textContent = settings.currency + total.toLocaleString('en-IN');
    $('#wageInput').value = settings.wage || '';
  }

  // ---------- settings ----------
  function hydrateSettingsUI() {
    $('#nameInput').value = settings.name === 'there' ? '' : (settings.name || '');
    $('#currencyInput').value = settings.currency || '₹';
    $('#wageInput').value = settings.wage || '';
    $('#themeToggle').checked = settings.theme === 'dark';
    $('#notifToggle').checked = !!settings.notif;
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', settings.theme === 'dark' ? 'dark' : 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', settings.theme === 'dark' ? '#0B1220' : '#0A3A39');
  }

  function exportData() {
    const payload = { exportedAt: new Date().toISOString(), settings, records };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duty-attendancepro-export-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('Export downloaded');
  }

  // ================= NAV =================
  function switchView(name) {
    $$('.view').forEach(v => v.classList.remove('active'));
    $('#view-' + name).classList.add('active');
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    if (name === 'calendar') renderCalendar();
    if (name === 'salary') renderSalary();
  }

  // ================= WIRE UP =================
  function wireEvents() {
    $('#punchBtn').addEventListener('click', doPunch);
    $$('.nav-btn').forEach(b => b.addEventListener('click', () => switchView(b.dataset.view)));
    $('#goSalary').addEventListener('click', () => switchView('salary'));
    $('#avatarBtn').addEventListener('click', () => switchView('settings'));

    $('#calPrev').addEventListener('click', () => { calCursor.setMonth(calCursor.getMonth() - 1); renderCalendar(); });
    $('#calNext').addEventListener('click', () => { calCursor.setMonth(calCursor.getMonth() + 1); renderCalendar(); });

    $('#sheetBackdrop').addEventListener('click', closeSheet);
    $$('.status-choice button').forEach(btn => btn.addEventListener('click', () => {
      if (!sheetTargetDate) return;
      const status = btn.dataset.status;
      if (!records[sheetTargetDate]) records[sheetTargetDate] = {};
      records[sheetTargetDate].status = status;
      saveRecords();
      renderCalendar();
      renderHome();
      closeSheet();
      toast('Day marked as ' + status);
    }));

    $('#nameInput').addEventListener('change', (e) => { settings.name = e.target.value.trim() || 'there'; saveSettings(); updateGreeting(); });
    $('#currencyInput').addEventListener('change', (e) => { settings.currency = e.target.value.trim() || '₹'; saveSettings(); renderSalary(); renderMonthStats(); });
    $('#wageInput').addEventListener('change', (e) => { settings.wage = Number(e.target.value) || 0; saveSettings(); renderSalary(); renderMonthStats(); });

    $('#themeToggle').addEventListener('change', (e) => { settings.theme = e.target.checked ? 'dark' : 'light'; saveSettings(); applyTheme(); });
    $('#notifToggle').addEventListener('change', async (e) => {
      if (e.target.checked && 'Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') { e.target.checked = false; toast('Notifications blocked'); return; }
      }
      settings.notif = e.target.checked; saveSettings();
    });

    $('#exportBtn').addEventListener('click', exportData);
    $('#resetBtn').addEventListener('click', () => {
      if (confirm('This will permanently delete all attendance records on this device. Continue?')) {
        records = {};
        saveRecords();
        renderHome(); renderCalendar(); renderSalary();
        toast('All data cleared');
      }
    });
  }

  // ================= INIT =================
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    wireEvents();
    initOnboarding();
    runSplash();
  });
})();
