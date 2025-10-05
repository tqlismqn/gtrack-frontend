// UUID polyfill (iOS safe)
window.uuid = (function () {
  const cryptoObj = window.crypto || window.msCrypto;
  return function uuidV4() {
    if (cryptoObj && cryptoObj.getRandomValues) {
      const buf = new Uint8Array(16);
      cryptoObj.getRandomValues(buf);
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;
      const byteToHex = [];
      for (let i = 0; i < 256; ++i) {
        byteToHex.push((i + 0x100).toString(16).substring(1));
      }
      return (
        byteToHex[buf[0]] +
        byteToHex[buf[1]] +
        byteToHex[buf[2]] +
        byteToHex[buf[3]] +
        "-" +
        byteToHex[buf[4]] +
        byteToHex[buf[5]] +
        "-" +
        byteToHex[buf[6]] +
        byteToHex[buf[7]] +
        "-" +
        byteToHex[buf[8]] +
        byteToHex[buf[9]] +
        "-" +
        byteToHex[buf[10]] +
        byteToHex[buf[11]] +
        byteToHex[buf[12]] +
        byteToHex[buf[13]] +
        byteToHex[buf[14]] +
        byteToHex[buf[15]]
      );
    }
    let d = new Date().getTime();
    let d2 = (performance && performance.now && performance.now() * 1000) || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };
})();

const STORE = {
  key: "gtrack_demo_v4",
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("STORE load error", err);
      return null;
    }
  },
  save(payload) {
    try {
      localStorage.setItem(this.key, JSON.stringify(payload));
    } catch (err) {
      console.warn("STORE save error", err);
    }
  },
  clear() {
    try {
      localStorage.removeItem(this.key);
    } catch (err) {
      console.warn("STORE clear error", err);
    }
  }
};

const THEME = {
  key: "gtrack_theme",
  get() {
    try {
      return localStorage.getItem(this.key) || "light";
    } catch (err) {
      return "light";
    }
  },
  set(value) {
    try {
      localStorage.setItem(this.key, value);
    } catch (err) {
      console.warn("theme save error", err);
    }
    document.body.setAttribute("data-theme", value);
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.textContent = value === "light" ? "🌙" : "🌞";
      toggle.dataset.mode = value;
    }
  }
};

const PERMISSIONS = {
  key: "gtrack_demo_permissions",
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw
        ? JSON.parse(raw)
        : {
            roles: { Admin: true, SuperAdmin: false },
            access: { Orders: true, Invoices: true, Drivers: true, Settings: true }
          };
    } catch (err) {
      return {
        roles: { Admin: true, SuperAdmin: false },
        access: { Orders: true, Invoices: true, Drivers: true, Settings: true }
      };
    }
  },
  save(value) {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (err) {
      console.warn("permissions save error", err);
    }
  }
};

function futureDate(days) {
  if (days === null || days === undefined) return null;
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now.toISOString().split("T")[0];
}

function pastDate(days) {
  if (!days) return null;
  const now = new Date();
  now.setDate(now.getDate() - days);
  return now.toISOString().split("T")[0];
}

function daysToState(days) {
  if (days === null || days === undefined) return "ok";
  if (days <= 0) return "bad";
  if (days <= 30) return "warn";
  return "ok";
}

function daysDiff(date) {
  if (!date) return Infinity;
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function worstDocState(driver) {
  const docs = driver.docs || {};
  let worst = "ok";
  Object.keys(docs).forEach((key) => {
    const doc = docs[key];
    if (!doc) return;
    const state = daysToState(daysDiff(doc.expires));
    if (state === "bad") {
      worst = "bad";
    } else if (state === "warn" && worst !== "bad") {
      worst = "warn";
    }
  });
  return worst;
}

function totalSalary(salary) {
  if (!salary) return 0;
  const { base = 0, bonus = 0, deductions = 0, trips = 0, perDiem = 0 } = salary;
  return base + bonus - deductions + trips * perDiem;
}

function seedDrivers() {
  const base = [
    {
      fullName: "Lukáš Dvořák",
      rc: "850312/4567",
      email: "lukas.dvorak@example.cz",
      phone: "+420 777 123 456",
      status: "Active",
      citizenship: "CZ",
      workplace: "Praha",
      hireDate: "2018-06-12",
      contractType: "Бессрочный",
      pasSouhlas: true,
      propiskaCZ: true,
      docs: {
        passport: { expires: futureDate(240), uploaded: true },
        visa: { expires: futureDate(120), uploaded: true },
        license: { expires: futureDate(180), uploaded: true },
        code95: { expires: futureDate(45), uploaded: true },
        tachograph: { expires: futureDate(32), uploaded: true },
        medical: { expires: futureDate(12), uploaded: true },
        adr: { expires: futureDate(90), uploaded: true }
      },
      salary: { base: 32000, bonus: 4500, deductions: 1500, trips: 5, perDiem: 1200 }
    },
    {
      fullName: "Martin Šebesta",
      rc: "920104/7788",
      email: "martin.sebesta@example.cz",
      phone: "+420 602 998 114",
      status: "Active",
      citizenship: "CZ",
      workplace: "Kladno",
      hireDate: "2020-01-20",
      contractType: "Бессрочный",
      pasSouhlas: true,
      propiskaCZ: true,
      docs: {
        passport: { expires: futureDate(320), uploaded: true },
        visa: { expires: futureDate(210), uploaded: false },
        license: { expires: futureDate(12), uploaded: true },
        code95: { expires: futureDate(5), uploaded: true },
        tachograph: { expires: pastDate(4), uploaded: true },
        medical: { expires: futureDate(120), uploaded: true },
        adr: { expires: futureDate(60), uploaded: false }
      },
      salary: { base: 29500, bonus: 3200, deductions: 1000, trips: 8, perDiem: 900 }
    },
    {
      fullName: "Aneta Kovářová",
      rc: "900821/2256",
      email: "aneta.kovarova@example.cz",
      phone: "+420 733 655 889",
      status: "OnLeave",
      citizenship: "EU",
      workplace: "Praha",
      hireDate: "2019-09-02",
      contractType: "Срочный",
      pasSouhlas: true,
      propiskaCZ: false,
      docs: {
        passport: { expires: futureDate(480), uploaded: true },
        visa: { expires: null, uploaded: false },
        license: { expires: futureDate(22), uploaded: true },
        code95: { expires: pastDate(2), uploaded: false },
        tachograph: { expires: futureDate(160), uploaded: true },
        medical: { expires: futureDate(64), uploaded: true },
        adr: { expires: futureDate(10), uploaded: false }
      },
      salary: { base: 27800, bonus: 0, deductions: 800, trips: 4, perDiem: 1100 }
    },
    {
      fullName: "Serhii Melnyk",
      rc: "870201/5544",
      email: "serhii.melnyk@example.cz",
      phone: "+420 608 221 003",
      status: "Active",
      citizenship: "Non-EU",
      workplace: "Praha",
      hireDate: "2017-04-08",
      contractType: "Бессрочный",
      pasSouhlas: true,
      propiskaCZ: true,
      docs: {
        passport: { expires: futureDate(90), uploaded: true },
        visa: { expires: futureDate(18), uploaded: true },
        license: { expires: futureDate(150), uploaded: true },
        code95: { expires: futureDate(25), uploaded: true },
        tachograph: { expires: futureDate(70), uploaded: true },
        medical: { expires: futureDate(8), uploaded: true },
        adr: { expires: pastDate(3), uploaded: true }
      },
      salary: { base: 34000, bonus: 6000, deductions: 2500, trips: 10, perDiem: 1000 }
    },
    {
      fullName: "Karolína Horská",
      rc: "930712/1165",
      email: "karolina.horska@example.cz",
      phone: "+420 604 998 765",
      status: "Active",
      citizenship: "CZ",
      workplace: "Kladno",
      hireDate: "2021-11-11",
      contractType: "Срочный",
      pasSouhlas: false,
      propiskaCZ: true,
      docs: {
        passport: { expires: futureDate(560), uploaded: true },
        visa: { expires: null, uploaded: false },
        license: { expires: futureDate(180), uploaded: true },
        code95: { expires: futureDate(90), uploaded: true },
        tachograph: { expires: futureDate(45), uploaded: false },
        medical: { expires: futureDate(30), uploaded: true },
        adr: { expires: null, uploaded: false }
      },
      salary: { base: 26500, bonus: 1800, deductions: 600, trips: 3, perDiem: 800 }
    },
    {
      fullName: "Jana Holubová",
      rc: "880102/9421",
      email: "jana.holubova@example.cz",
      phone: "+420 739 876 543",
      status: "Inactive",
      citizenship: "EU",
      workplace: "Praha",
      hireDate: "2015-02-17",
      contractType: "Бессрочный",
      pasSouhlas: true,
      propiskaCZ: false,
      docs: {
        passport: { expires: pastDate(80), uploaded: true },
        visa: { expires: null, uploaded: false },
        license: { expires: futureDate(9), uploaded: true },
        code95: { expires: pastDate(10), uploaded: false },
        tachograph: { expires: futureDate(34), uploaded: true },
        medical: { expires: pastDate(2), uploaded: true },
        adr: { expires: null, uploaded: false }
      },
      salary: { base: 25000, bonus: 0, deductions: 0, trips: 0, perDiem: 0 }
    },
    {
      fullName: "Marek Benda",
      rc: "940421/6655",
      email: "marek.benda@example.cz",
      phone: "+420 601 456 897",
      status: "Active",
      citizenship: "CZ",
      workplace: "Kladno",
      hireDate: "2022-04-01",
      contractType: "Срочный",
      pasSouhlas: false,
      propiskaCZ: true,
      docs: {
        passport: { expires: futureDate(365), uploaded: true },
        visa: { expires: null, uploaded: false },
        license: { expires: futureDate(55), uploaded: true },
        code95: { expires: futureDate(88), uploaded: true },
        tachograph: { expires: futureDate(40), uploaded: true },
        medical: { expires: futureDate(25), uploaded: true },
        adr: { expires: null, uploaded: false }
      },
      salary: { base: 25500, bonus: 2100, deductions: 400, trips: 6, perDiem: 700 }
    },
    {
      fullName: "Igor Král",
      rc: "860909/3322",
      email: "igor.kral@example.cz",
      phone: "+420 720 134 768",
      status: "OnLeave",
      citizenship: "Non-EU",
      workplace: "Praha",
      hireDate: "2012-08-30",
      contractType: "Бессрочный",
      pasSouhlas: true,
      propiskaCZ: false,
      docs: {
        passport: { expires: futureDate(200), uploaded: true },
        visa: { expires: futureDate(16), uploaded: true },
        license: { expires: futureDate(14), uploaded: true },
        code95: { expires: pastDate(1), uploaded: true },
        tachograph: { expires: futureDate(12), uploaded: true },
        medical: { expires: futureDate(18), uploaded: true },
        adr: { expires: futureDate(25), uploaded: true }
      },
      salary: { base: 31000, bonus: 2200, deductions: 1200, trips: 7, perDiem: 950 }
    },
    {
      fullName: "Elena Novotná",
      rc: "950215/8811",
      email: "elena.novotna@example.cz",
      phone: "+420 734 123 789",
      status: "Active",
      citizenship: "EU",
      workplace: "Praha",
      hireDate: "2023-02-14",
      contractType: "Срочный",
      pasSouhlas: false,
      propiskaCZ: true,
      docs: {
        passport: { expires: futureDate(400), uploaded: true },
        visa: { expires: futureDate(250), uploaded: true },
        license: { expires: futureDate(75), uploaded: true },
        code95: { expires: futureDate(180), uploaded: true },
        tachograph: { expires: futureDate(90), uploaded: true },
        medical: { expires: futureDate(45), uploaded: true },
        adr: { expires: futureDate(160), uploaded: true }
      },
      salary: { base: 27000, bonus: 3000, deductions: 900, trips: 5, perDiem: 850 }
    }
  ];
  return base.map((item) => ({ id: window.uuid(), ...item }));
}

const driverState = {
  list: (() => {
    const stored = STORE.load();
    if (stored && Array.isArray(stored.drivers)) {
      return stored.drivers;
    }
    const seeded = seedDrivers();
    STORE.save({ drivers: seeded });
    return seeded;
  })(),
  page: 1,
  perPage: 10,
  query: "",
  status: "",
  docState: "",
  citizenship: "",
  workplace: "",
  problemsOnly: false,
  selection: new Set(),
  activeTab: "general"
};

const routes = {
  "/dashboard": renderDashboard,
  "/address-book": renderAddressBook,
  "/orders": renderOrders,
  "/invoices": renderInvoices,
  "/drivers": renderDrivers,
  "/settings": renderSettings
};

let currentRoute = "";

function router() {
  const raw = location.hash.replace("#", "");
  const path = (raw || "/dashboard").split("?")[0];
  currentRoute = path;
  highlightNav(path);
  const render = routes[path] || renderNotFound;
  render();
}

function highlightNav(path) {
  document.querySelectorAll(".menu-item").forEach((item) => {
    const href = item.getAttribute("href") || "";
    if (href.includes(path)) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function showToast(message, kind = "ok") {
  const host = document.getElementById("toastHost");
  if (!host) return;
  const toast = document.createElement("div");
  toast.className = `toast ${kind}`;
  toast.textContent = message;
  host.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function renderDashboard() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <section>
      <h1 class="section-title">Dashboard</h1>
      <div class="chips">
        <div class="chip"><strong>12</strong> активных рейсов</div>
        <div class="chip"><strong>4</strong> новых заявки</div>
        <div class="chip warn">⚠️ <strong>3</strong> риска задержки</div>
      </div>
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="skeleton" style="height: 80px;"></div>
          <div class="skeleton" style="height: 18px;width:60%;"></div>
        </div>
        <div class="dashboard-card">
          <div class="skeleton" style="height: 120px;"></div>
        </div>
        <div class="dashboard-card">
          <div class="skeleton" style="height: 60px;"></div>
          <div class="skeleton" style="height: 60px;"></div>
        </div>
      </div>
    </section>
  `;
}

function renderAddressBook() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <section>
      <h1 class="section-title">Address Book</h1>
      <div class="address-table">
        <table class="table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Компания</th>
              <th>Телефон</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            ${Array.from({ length: 6 })
              .map(
                (_, idx) => `
                <tr>
                  <td>Контакт ${idx + 1}</td>
                  <td>ООО «Логистика»</td>
                  <td>+420 777 00${idx} ${idx}</td>
                  <td>contact${idx}@example.cz</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
        <div class="pagination">
          <button>‹</button>
          <button class="btn ghost">1</button>
          <button>›</button>
        </div>
      </div>
    </section>
  `;
}

function renderOrders() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <section>
      <h1 class="section-title">Orders</h1>
      <div class="orders-table">
        <table class="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Статус</th>
              <th>Контрагент</th>
              <th>Сумма</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ORD-1023</td>
              <td><span class="status-pill status-active">В пути</span></td>
              <td>EuroTrans</td>
              <td>€ 4 560</td>
              <td>05.10.2025</td>
            </tr>
            <tr>
              <td>ORD-1022</td>
              <td><span class="status-pill status-onleave">Готовится</span></td>
              <td>CargoHub</td>
              <td>€ 1 320</td>
              <td>04.10.2025</td>
            </tr>
            <tr>
              <td>ORD-1021</td>
              <td><span class="status-pill status-inactive">Отменён</span></td>
              <td>LogiSmart</td>
              <td>€ 2 870</td>
              <td>03.10.2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderInvoices() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <section>
      <h1 class="section-title">Invoices</h1>
      <div class="invoices-table">
        <table class="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Контрагент</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>INV-908</td>
              <td>EuroTrans</td>
              <td>€ 8 200</td>
              <td><span class="status-pill status-active">Оплачен</span></td>
              <td>01.10.2025</td>
            </tr>
            <tr>
              <td>INV-907</td>
              <td>NordicTrade</td>
              <td>€ 1 560</td>
              <td><span class="status-pill status-onleave">Ожидает</span></td>
              <td>29.09.2025</td>
            </tr>
            <tr>
              <td>INV-906</td>
              <td>LogiSmart</td>
              <td>€ 4 010</td>
              <td><span class="status-pill status-inactive">Просрочен</span></td>
              <td>21.09.2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSettings() {
  const app = document.getElementById("app");
  if (!app) return;
  const stored = PERMISSIONS.load();
  const roles = stored.roles || {};
  const access = stored.access || {};
  const enabled = Object.keys(access)
    .filter((k) => access[k])
    .join(", ");
  app.innerHTML = `
    <section>
      <h1 class="section-title">Settings</h1>
      <div class="permissions-panel">
        <div>
          <h2>Permissions</h2>
          <p class="permissions-preview">Этим ролям доступно: ${enabled || "ничего"}</p>
        </div>
        <div class="permissions-grid">
          <label>
            <input type="checkbox" data-role="Admin" ${roles.Admin ? "checked" : ""} />
            Admin
          </label>
          <label>
            <input type="checkbox" data-role="SuperAdmin" ${roles.SuperAdmin ? "checked" : ""} />
            SuperAdmin
          </label>
        </div>
        <div class="permissions-grid">
          ${["Orders", "Invoices", "Drivers", "Settings"]
            .map(
              (name) => `
                <label>
                  <input type="checkbox" data-access="${name}" ${access[name] ? "checked" : ""} />
                  Доступ к ${name}
                </label>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;

  app.querySelectorAll("input[data-role]").forEach((input) => {
    input.addEventListener("change", () => {
      const current = PERMISSIONS.load();
      current.roles[input.dataset.role] = input.checked;
      PERMISSIONS.save(current);
      renderSettings();
      showToast("Роли обновлены", "ok");
    });
  });

  app.querySelectorAll("input[data-access]").forEach((input) => {
    input.addEventListener("change", () => {
      const current = PERMISSIONS.load();
      current.access[input.dataset.access] = input.checked;
      PERMISSIONS.save(current);
      renderSettings();
      showToast("Доступ обновлён", "ok");
    });
  });
}

function renderNotFound() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <section>
      <h1 class="section-title">Oops</h1>
      <p>Раздел не найден.</p>
    </section>
  `;
}

function persistDrivers() {
  STORE.save({ drivers: driverState.list });
}

function renderDrivers() {
  const app = document.getElementById("app");
  if (!app) return;
  const list = driverState.list.slice();
  const filtered = list.filter((driver) => {
    const haystack = `${driver.fullName} ${driver.email} ${driver.phone}`.toLowerCase();
    if (driverState.query && !haystack.includes(driverState.query.toLowerCase())) {
      return false;
    }
    if (driverState.status && driver.status !== driverState.status) {
      return false;
    }
    if (driverState.citizenship && driver.citizenship !== driverState.citizenship) {
      return false;
    }
    if (driverState.workplace && driver.workplace !== driverState.workplace) {
      return false;
    }
    const docStatus = worstDocState(driver);
    if (driverState.docState && docStatus !== driverState.docState) {
      return false;
    }
    if (driverState.problemsOnly && docStatus === "ok") {
      return false;
    }
    return true;
  });

  const paged = filtered.slice((driverState.page - 1) * driverState.perPage, driverState.page * driverState.perPage);
  const summary = buildDriverSummary(list);

  app.innerHTML = `
    <section>
      <h1 class="section-title">Drivers</h1>
      <div class="actions-bar">
        <div class="chips">
          <div class="chip"><strong>${summary.total}</strong> всего</div>
          <div class="chip ok">✅ <strong>${summary.status.Active}</strong> Active</div>
          <div class="chip warn">⚠️ <strong>${summary.status.OnLeave}</strong> On Leave</div>
          <div class="chip bad">⛔ <strong>${summary.status.Inactive}</strong> Inactive</div>
          <div class="chip ok">📄 ok <strong>${summary.docs.ok}</strong></div>
          <div class="chip warn">📄 warn <strong>${summary.docs.warn}</strong></div>
          <div class="chip bad">📄 bad <strong>${summary.docs.bad}</strong></div>
        </div>
        <div class="filters">
          <input type="search" id="driversSearch" placeholder="Фильтр по имени…" value="${driverState.query}" />
          <select id="filterStatus">
            <option value="">Статус</option>
            <option value="Active" ${driverState.status === "Active" ? "selected" : ""}>Active</option>
            <option value="OnLeave" ${driverState.status === "OnLeave" ? "selected" : ""}>On Leave</option>
            <option value="Inactive" ${driverState.status === "Inactive" ? "selected" : ""}>Inactive</option>
          </select>
          <select id="filterDocState">
            <option value="">Документы</option>
            <option value="ok" ${driverState.docState === "ok" ? "selected" : ""}>ok</option>
            <option value="warn" ${driverState.docState === "warn" ? "selected" : ""}>warn</option>
            <option value="bad" ${driverState.docState === "bad" ? "selected" : ""}>bad</option>
          </select>
          <select id="filterCitizenship">
            <option value="">Гражданство</option>
            <option value="CZ" ${driverState.citizenship === "CZ" ? "selected" : ""}>CZ</option>
            <option value="EU" ${driverState.citizenship === "EU" ? "selected" : ""}>EU</option>
            <option value="Non-EU" ${driverState.citizenship === "Non-EU" ? "selected" : ""}>Non-EU</option>
          </select>
          <select id="filterWorkplace">
            <option value="">Локация</option>
            <option value="Praha" ${driverState.workplace === "Praha" ? "selected" : ""}>Praha</option>
            <option value="Kladno" ${driverState.workplace === "Kladno" ? "selected" : ""}>Kladno</option>
          </select>
          <label><input type="checkbox" id="filterProblems" ${driverState.problemsOnly ? "checked" : ""}/> только с проблемами</label>
        </div>
        <div class="btn-row" style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn primary" id="addDriver">＋ Добавить</button>
          <button class="btn ghost" id="seedDrivers">Наполнить демо</button>
          <button class="btn ghost" id="resetDrivers">Сбросить</button>
          <button class="btn ghost" id="randomDriver">🎲 Случайный</button>
        </div>
      </div>
      <div class="layout">
        <div class="table-wrapper">
          ${driverState.selection.size > 0
            ? `<div class="bulk-actions">
                <span>${driverState.selection.size} выбрано</span>
                <button class="btn danger" id="bulkDelete">Удалить выбранных</button>
                <button class="btn ghost" id="bulkActivate">Пометить как Active</button>
              </div>`
            : ""}
          <table class="table">
            <thead>
              <tr>
                <th><input type="checkbox" id="selectAll" ${paged.length && paged.every((d) => driverState.selection.has(d.id)) ? "checked" : ""}/></th>
                <th>Водитель</th>
                <th>Статус</th>
                <th>Город</th>
                <th>Документы</th>
              </tr>
            </thead>
            <tbody>
              ${
                paged.length
                  ? paged
                      .map((driver) => {
                        const docState = worstDocState(driver);
                        const rowClass = docState === "bad" ? "row-bad" : "";
                        const statusClass =
                          driver.status === "Active"
                            ? "status-active"
                            : driver.status === "OnLeave"
                            ? "status-onleave"
                            : "status-inactive";
                        return `
                          <tr class="${rowClass}" data-id="${driver.id}">
                            <td><input type="checkbox" data-select="${driver.id}" ${driverState.selection.has(driver.id) ? "checked" : ""}/></td>
                            <td>
                              <div><strong>${driver.fullName}</strong></div>
                              <div class="icon-meta">${driver.email}</div>
                            </td>
                            <td><span class="status-pill ${statusClass}">${driver.status}</span></td>
                            <td>${driver.workplace}</td>
                            <td><span class="chip ${docState}">${docState.toUpperCase()}</span></td>
                          </tr>
                        `;
                      })
                      .join("")
                  : `<tr><td colspan="5">Ничего не найдено.</td></tr>`
              }
            </tbody>
          </table>
        </div>
        <div class="icons-grid">
          ${filtered
            .map((driver) => {
              const docState = worstDocState(driver);
              return `
                <div class="icon-card" data-id="${driver.id}">
                  <div class="icon-avatar ${docState}">${initials(driver.fullName)}</div>
                  <strong>${driver.fullName.split(" ")[0]}</strong>
                  <span class="icon-meta">${driver.workplace} · ${driver.citizenship}</span>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    </section>
  `;

  bindDriverListEvents(filtered, paged);
}

function bindDriverListEvents(filtered, paged) {
  const driversSearch = document.getElementById("driversSearch");
  if (driversSearch) {
    driversSearch.addEventListener("input", (e) => {
      driverState.query = e.target.value;
      driverState.page = 1;
      renderDrivers();
    });
  }
  const filterStatus = document.getElementById("filterStatus");
  if (filterStatus) {
    filterStatus.addEventListener("change", (e) => {
      driverState.status = e.target.value;
      driverState.page = 1;
      renderDrivers();
    });
  }
  const filterDocState = document.getElementById("filterDocState");
  if (filterDocState) {
    filterDocState.addEventListener("change", (e) => {
      driverState.docState = e.target.value;
      driverState.page = 1;
      renderDrivers();
    });
  }
  const filterCitizenship = document.getElementById("filterCitizenship");
  if (filterCitizenship) {
    filterCitizenship.addEventListener("change", (e) => {
      driverState.citizenship = e.target.value;
      driverState.page = 1;
      renderDrivers();
    });
  }
  const filterWorkplace = document.getElementById("filterWorkplace");
  if (filterWorkplace) {
    filterWorkplace.addEventListener("change", (e) => {
      driverState.workplace = e.target.value;
      driverState.page = 1;
      renderDrivers();
    });
  }
  const filterProblems = document.getElementById("filterProblems");
  if (filterProblems) {
    filterProblems.addEventListener("change", (e) => {
      driverState.problemsOnly = e.target.checked;
      driverState.page = 1;
      renderDrivers();
    });
  }

  const addDriverBtn = document.getElementById("addDriver");
  if (addDriverBtn) {
    addDriverBtn.addEventListener("click", () => openDriverForm());
  }

  const seedBtn = document.getElementById("seedDrivers");
  if (seedBtn) {
    seedBtn.addEventListener("click", () => {
      const seeded = seedDrivers();
      driverState.list = mergeNewDrivers(driverState.list, seeded);
      persistDrivers();
      showToast("Демо данные обновлены", "ok");
      renderDrivers();
    });
  }

  const resetBtn = document.getElementById("resetDrivers");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      driverState.list = seedDrivers();
      driverState.selection.clear();
      persistDrivers();
      showToast("Сброшено к исходному состоянию", "ok");
      renderDrivers();
    });
  }

  const randomBtn = document.getElementById("randomDriver");
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const driver = randomDriver();
      driverState.list.unshift(driver);
      persistDrivers();
      showToast(`Добавлен ${driver.fullName}`, "ok");
      renderDrivers();
    });
  }

  const selectAll = document.getElementById("selectAll");
  if (selectAll) {
    selectAll.addEventListener("change", (e) => {
      paged.forEach((driver) => {
        if (e.target.checked) {
          driverState.selection.add(driver.id);
        } else {
          driverState.selection.delete(driver.id);
        }
      });
      renderDrivers();
    });
  }

  document.querySelectorAll("input[data-select]").forEach((checkbox) => {
    checkbox.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = event.target.dataset.select;
      if (event.target.checked) {
        driverState.selection.add(id);
      } else {
        driverState.selection.delete(id);
      }
      renderDrivers();
    });
  });

  const bulkDelete = document.getElementById("bulkDelete");
  if (bulkDelete) {
    bulkDelete.addEventListener("click", () => {
      driverState.list = driverState.list.filter((driver) => !driverState.selection.has(driver.id));
      driverState.selection.clear();
      persistDrivers();
      showToast("Выбранные водители удалены", "ok");
      renderDrivers();
    });
  }

  const bulkActivate = document.getElementById("bulkActivate");
  if (bulkActivate) {
    bulkActivate.addEventListener("click", () => {
      driverState.list = driverState.list.map((driver) =>
        driverState.selection.has(driver.id) ? { ...driver, status: "Active" } : driver
      );
      persistDrivers();
      showToast("Статус обновлён", "ok");
      renderDrivers();
    });
  }

  document.querySelectorAll(".table tbody tr").forEach((row) => {
    row.addEventListener("click", () => {
      const id = row.dataset.id;
      const driver = driverState.list.find((item) => item.id === id);
      if (driver) {
        openDriverCard(driver);
      }
    });
  });

  document.querySelectorAll(".icon-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const driver = driverState.list.find((item) => item.id === id);
      if (driver) {
        openDriverCard(driver);
      }
    });
  });
}

function buildDriverSummary(list) {
  const summary = {
    total: list.length,
    status: { Active: 0, OnLeave: 0, Inactive: 0 },
    docs: { ok: 0, warn: 0, bad: 0 }
  };
  list.forEach((driver) => {
    summary.status[driver.status] = (summary.status[driver.status] || 0) + 1;
    const docState = worstDocState(driver);
    summary.docs[docState] = (summary.docs[docState] || 0) + 1;
  });
  return summary;
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function openDriverCard(driver) {
  driverState.activeTab = "general";
  const drawer = document.getElementById("drawer");
  const card = document.getElementById("card");
  if (!drawer || !card) return;
  drawer.classList.remove("hidden");
  requestAnimationFrame(() => drawer.classList.add("show"));
  card.innerHTML = driverCardTemplate(driver);
  bindDriverCardEvents(driver);
}

function driverCardTemplate(driver) {
  const docState = worstDocState(driver);
  const tabs = [
    { key: "general", label: "Общее" },
    { key: "docs", label: "📄 Документы" },
    { key: "salary", label: "💰 Зарплата" }
  ];
  const general = `
    <div class="tab-content ${driverState.activeTab === "general" ? "active" : ""}" data-tab="general">
      <div class="form-grid">
        <div>
          <div class="tag">Гражданство: ${driver.citizenship}</div>
          <div class="tag">Локация: ${driver.workplace}</div>
        </div>
        <div class="form-grid two">
          <div class="form-field">
            <label>Email</label>
            <input type="email" value="${driver.email}" disabled />
          </div>
          <div class="form-field">
            <label>Телефон</label>
            <input type="text" value="${driver.phone}" disabled />
          </div>
        </div>
        <div class="form-grid two">
          <div class="form-field">
            <label>Статус</label>
            <select id="driverStatus">
              <option value="Active" ${driver.status === "Active" ? "selected" : ""}>Active</option>
              <option value="OnLeave" ${driver.status === "OnLeave" ? "selected" : ""}>On Leave</option>
              <option value="Inactive" ${driver.status === "Inactive" ? "selected" : ""}>Inactive</option>
            </select>
          </div>
          <div class="form-field">
            <label>Тип договора</label>
            <input type="text" value="${driver.contractType}" disabled />
          </div>
        </div>
        <label class="permissions-preview"><input type="checkbox" id="driverPas" ${driver.pasSouhlas ? "checked" : ""}/> Пас согласие</label>
        <label class="permissions-preview"><input type="checkbox" id="driverProp" ${driver.propiskaCZ ? "checked" : ""}/> Прописка CZ</label>
        <div class="chip ${docState}">Документы: ${docState.toUpperCase()}</div>
      </div>
    </div>
  `;

  const docs = `
    <div class="tab-content ${driverState.activeTab === "docs" ? "active" : ""}" data-tab="docs">
      <div class="form-grid">
        ${Object.entries(driver.docs)
          .map(([key, doc]) => {
            const diff = daysDiff(doc.expires);
            const state = daysToState(diff);
            let label = "";
            if (diff === Infinity) {
              label = "Без срока";
            } else if (diff >= 0) {
              label = `осталось ${diff} дн.`;
            } else {
              label = `просрочен на ${Math.abs(diff)} дн.`;
            }
            const emoji =
              key === "passport"
                ? "🛂"
                : key === "visa"
                ? "🪪"
                : key === "license"
                ? "🚗"
                : key === "code95"
                ? "📘"
                : key === "tachograph"
                ? "📟"
                : key === "medical"
                ? "🩺"
                : "⚠️";
            return `
              <div class="doc-row ${state === "ok" ? "doc-ok" : state === "warn" ? "doc-warn" : "doc-bad"}">
                <div>${emoji} ${labelDoc(key)}</div>
                <div>${label}</div>
                <div class="${doc.uploaded ? "uploaded-yes" : "uploaded-no"}">${doc.uploaded ? "✅" : "❌"}</div>
              </div>
            `;
          })
          .join("")}
      </div>
      <button class="btn ghost" id="shiftDocs">Сдвинуть сроки документов</button>
    </div>
  `;

  const salary = `
    <div class="tab-content ${driverState.activeTab === "salary" ? "active" : ""}" data-tab="salary">
      <div class="form-grid two">
        <div class="form-field"><label>Базовая</label><input type="number" id="salaryBase" value="${driver.salary.base}" /></div>
        <div class="form-field"><label>Бонус</label><input type="number" id="salaryBonus" value="${driver.salary.bonus}" /></div>
        <div class="form-field"><label>Удержания</label><input type="number" id="salaryDeductions" value="${driver.salary.deductions}" /></div>
        <div class="form-field"><label>Рейсов</label><input type="number" id="salaryTrips" value="${driver.salary.trips}" /></div>
        <div class="form-field"><label>Суточные</label><input type="number" id="salaryPerDiem" value="${driver.salary.perDiem}" /></div>
      </div>
      <div class="chip ok" style="margin-top:16px;">Итог: <strong>${formatCurrency(totalSalary(driver.salary))}</strong></div>
    </div>
  `;

  return `
    <div class="drawer-header">
      <div>
        <h2>${driver.fullName}</h2>
        <p class="icon-meta">RC ${driver.rc} · Нанят ${formatDate(driver.hireDate)}</p>
      </div>
      <button class="icon-btn" data-close>✕</button>
    </div>
    <div class="tabs">
      ${tabs
        .map((tab) => `<button class="tab-btn ${driverState.activeTab === tab.key ? "active" : ""}" data-tab-btn="${tab.key}">${tab.label}</button>`)
        .join("")}
    </div>
    ${general}
    ${docs}
    ${salary}
    <div class="drawer-footer">
      <button class="btn danger" id="deleteDriver">Удалить</button>
      <div style="display:flex;gap:12px;">
        <button class="btn ghost" data-close>Закрыть</button>
        <button class="btn primary" id="saveDriver">Сохранить</button>
      </div>
    </div>
  `;
}

function labelDoc(key) {
  const map = {
    passport: "Паспорт",
    visa: "Виза",
    license: "Вод. удостоверение",
    code95: "Код 95",
    tachograph: "Тахограф",
    medical: "Мед. допуск",
    adr: "ADR"
  };
  return map[key] || key;
}

function bindDriverCardEvents(driver) {
  const drawer = document.getElementById("drawer");
  const closeButtons = document.querySelectorAll("[data-close]");
  closeButtons.forEach((btn) => btn.addEventListener("click", closeDrawer));
  if (drawer) {
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) {
        closeDrawer();
      }
    });
  }

  document.querySelectorAll("[data-tab-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      driverState.activeTab = btn.dataset.tabBtn;
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-content").forEach((tab) => {
        if (tab.dataset.tab === driverState.activeTab) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });
    });
  });

  const shift = document.getElementById("shiftDocs");
  if (shift) {
    shift.addEventListener("click", () => {
      shiftDocuments(driver);
      persistDrivers();
      openDriverCard(driverState.list.find((item) => item.id === driver.id));
      showToast("Сроки документов обновлены", "ok");
    });
  }

  const deleteBtn = document.getElementById("deleteDriver");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      driverState.list = driverState.list.filter((item) => item.id !== driver.id);
      driverState.selection.delete(driver.id);
      persistDrivers();
      closeDrawer();
      renderDrivers();
      showToast("Водитель удалён", "ok");
    });
  }

  const saveBtn = document.getElementById("saveDriver");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const status = document.getElementById("driverStatus").value;
      const pas = document.getElementById("driverPas").checked;
      const prop = document.getElementById("driverProp").checked;
      const salaryBase = parseFloat(document.getElementById("salaryBase").value) || 0;
      const salaryBonus = parseFloat(document.getElementById("salaryBonus").value) || 0;
      const salaryDeductions = parseFloat(document.getElementById("salaryDeductions").value) || 0;
      const salaryTrips = parseFloat(document.getElementById("salaryTrips").value) || 0;
      const salaryPerDiem = parseFloat(document.getElementById("salaryPerDiem").value) || 0;
      driverState.list = driverState.list.map((item) =>
        item.id === driver.id
          ? {
              ...item,
              status,
              pasSouhlas: pas,
              propiskaCZ: prop,
              salary: {
                base: salaryBase,
                bonus: salaryBonus,
                deductions: salaryDeductions,
                trips: salaryTrips,
                perDiem: salaryPerDiem
              }
            }
          : item
      );
      persistDrivers();
      showToast("Данные обновлены", "ok");
      closeDrawer();
      renderDrivers();
    });
  }
}

function closeDrawer() {
  const drawer = document.getElementById("drawer");
  if (!drawer) return;
  drawer.classList.remove("show");
  setTimeout(() => {
    drawer.classList.add("hidden");
  }, 250);
}

function shiftDocuments(driver) {
  const delta = Math.floor(Math.random() * 120) - 30;
  const updated = JSON.parse(JSON.stringify(driver.docs));
  Object.keys(updated).forEach((key) => {
    const doc = updated[key];
    if (!doc || !doc.expires) return;
    const date = new Date(doc.expires);
    date.setDate(date.getDate() + delta);
    doc.expires = date.toISOString().split("T")[0];
  });
  driver.docs = updated;
}

function mergeNewDrivers(existing, incoming) {
  const existingIds = new Set(existing.map((d) => d.id));
  const merged = existing.slice();
  incoming.forEach((driver) => {
    if (!existingIds.has(driver.id)) {
      merged.push(driver);
    }
  });
  return merged;
}

function randomDriver() {
  const firstNames = ["Daria", "Olga", "Roman", "Petra", "Milan", "Viktor", "Nikol", "Filip"];
  const lastNames = ["Novák", "Urban", "Kučera", "Hrubý", "Řehák", "Král", "Duda", "Mašek"];
  const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  return {
    id: window.uuid(),
    fullName,
    rc: `${Math.floor(800000 + Math.random() * 199999)}/${Math.floor(1000 + Math.random() * 8999)}`,
    email: `${fullName.toLowerCase().replace(/[^a-z]/g, ".")}@demo.cz`,
    phone: `+420 7${Math.floor(10000000 + Math.random() * 8999999)}`,
    status: ["Active", "OnLeave", "Inactive"][Math.floor(Math.random() * 3)],
    citizenship: ["CZ", "EU", "Non-EU"][Math.floor(Math.random() * 3)],
    workplace: ["Praha", "Kladno"][Math.floor(Math.random() * 2)],
    hireDate: futureDate(-Math.floor(Math.random() * 2000)),
    contractType: Math.random() > 0.5 ? "Бессрочный" : "Срочный",
    pasSouhlas: Math.random() > 0.5,
    propiskaCZ: Math.random() > 0.5,
    docs: generateRandomDocs(),
    salary: {
      base: 24000 + Math.floor(Math.random() * 12000),
      bonus: Math.floor(Math.random() * 6000),
      deductions: Math.floor(Math.random() * 3000),
      trips: Math.floor(Math.random() * 12),
      perDiem: 600 + Math.floor(Math.random() * 900)
    }
  };
}

function generateRandomDocs() {
  const docKeys = ["passport", "visa", "license", "code95", "tachograph", "medical", "adr"];
  const docs = {};
  docKeys.forEach((key) => {
    const offset = Math.floor(Math.random() * 400) - 120;
    docs[key] = {
      expires: offset === Infinity ? null : futureDate(offset),
      uploaded: Math.random() > 0.2
    };
  });
  return docs;
}

function openDriverForm() {
  const drawer = document.getElementById("drawer");
  const card = document.getElementById("card");
  if (!drawer || !card) return;
  drawer.classList.remove("hidden");
  requestAnimationFrame(() => drawer.classList.add("show"));
  card.innerHTML = driverFormTemplate();
  bindDriverFormEvents();
}

function driverFormTemplate() {
  return `
    <div class="drawer-header">
      <div>
        <h2>Новый водитель</h2>
        <p class="icon-meta">Добавьте основные сведения</p>
      </div>
      <button class="icon-btn" data-close>✕</button>
    </div>
    <div class="drawer-body">
      <div class="form-grid">
        <div class="form-field">
          <label>Полное имя</label>
          <input type="text" id="formName" placeholder="Иван Иванов" required />
        </div>
        <div class="form-field">
          <label>RC</label>
          <input type="text" id="formRc" placeholder="900101/1234" />
        </div>
        <div class="form-field">
          <label>Email</label>
          <input type="email" id="formEmail" placeholder="driver@example.cz" />
        </div>
        <div class="form-field">
          <label>Телефон</label>
          <input type="tel" id="formPhone" placeholder="+420 700 000 000" />
        </div>
        <div class="form-field">
          <label>Гражданство</label>
          <select id="formCitizenship">
            <option value="CZ">CZ</option>
            <option value="EU">EU</option>
            <option value="Non-EU">Non-EU</option>
          </select>
        </div>
        <div class="form-field">
          <label>Локация</label>
          <select id="formWorkplace">
            <option value="Praha">Praha</option>
            <option value="Kladno">Kladno</option>
          </select>
        </div>
        <div class="form-field">
          <label>Статус</label>
          <select id="formStatus">
            <option value="Active">Active</option>
            <option value="OnLeave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <label class="permissions-preview"><input type="checkbox" id="formPas" /> Пас согласие</label>
      <label class="permissions-preview"><input type="checkbox" id="formProp" /> Прописка CZ</label>
    </div>
    <div class="drawer-footer">
      <button class="btn ghost" data-close>Отмена</button>
      <button class="btn primary" id="formSubmit">Сохранить</button>
    </div>
  `;
}

function bindDriverFormEvents() {
  const drawer = document.getElementById("drawer");
  const closeButtons = document.querySelectorAll("[data-close]");
  closeButtons.forEach((btn) => btn.addEventListener("click", closeDrawer));
  if (drawer) {
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) {
        closeDrawer();
      }
    });
  }

  const submit = document.getElementById("formSubmit");
  if (submit) {
    submit.addEventListener("click", () => {
      const fullName = document.getElementById("formName").value.trim();
      if (!fullName) {
        showToast("Введите имя", "err");
        return;
      }
      const driver = {
        id: window.uuid(),
        fullName,
        rc: document.getElementById("formRc").value.trim() || "",
        email: document.getElementById("formEmail").value.trim() || `${fullName.toLowerCase().replace(/[^a-z]/g, ".")}@demo.cz`,
        phone: document.getElementById("formPhone").value.trim() || "+420 700 000 000",
        status: document.getElementById("formStatus").value,
        citizenship: document.getElementById("formCitizenship").value,
        workplace: document.getElementById("formWorkplace").value,
        hireDate: new Date().toISOString().split("T")[0],
        contractType: "Срочный",
        pasSouhlas: document.getElementById("formPas").checked,
        propiskaCZ: document.getElementById("formProp").checked,
        docs: generateRandomDocs(),
        salary: {
          base: 25000,
          bonus: 2000,
          deductions: 0,
          trips: 4,
          perDiem: 800
        }
      };
      driverState.list.unshift(driver);
      persistDrivers();
      closeDrawer();
      renderDrivers();
      showToast("Водитель добавлен", "ok");
    });
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("cs-CZ");
  } catch (err) {
    return value;
  }
}

function setupShell() {
  const sidebar = document.getElementById("sidebar");
  const toggleButtons = [document.getElementById("sidebarToggle"), document.getElementById("sidebarCollapse")];
  toggleButtons.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        if (!sidebar) return;
        sidebar.classList.toggle("sidebar--open");
      });
    }
  });

  let touchStartX = null;
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  document.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 80) {
      sidebar && sidebar.classList.add("sidebar--open");
    }
    if (deltaX < -80) {
      sidebar && sidebar.classList.remove("sidebar--open");
    }
    touchStartX = null;
  });

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = themeToggle.dataset.mode === "light" ? "dark" : "light";
      THEME.set(next);
    });
  }

  const theme = THEME.get();
  THEME.set(theme);

  const globalSearch = document.getElementById("globalSearch");
  if (globalSearch) {
    globalSearch.addEventListener("input", (e) => {
      const value = e.target.value.trim();
      if (currentRoute === "/drivers") {
        driverState.query = value;
        renderDrivers();
      } else if (value.length > 2) {
        showToast("Глобальный поиск работает в разделе Drivers", "err");
      }
    });
  }
}

function init() {
  try {
    setupShell();
    router();
    window.addEventListener("hashchange", router);
  } catch (err) {
    console.error("init error", err);
  }
}

document.addEventListener("DOMContentLoaded", init);

