(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const DEFAULTS = {
    brand: ["SUNLU", "eSun", "Deeplee"],
    material: ["PLA+", "PLA", "PETG", "PETG HF", "TPU", "ASA", "ABS"],
    color: [],
    finish: ["Basic", "Matte", "Silk"]
  };
  const OPTIONS_KEY = "filament-label-options-v11";
  const RECENT_KEY = "filament-label-recent-v11";

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn("Lokaler Speicher konnte nicht gelesen werden:", error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (key === OPTIONS_KEY) saveDesktopSettings();
      return true;
    } catch (error) {
      console.warn("Lokaler Speicher konnte nicht beschrieben werden:", error);
      toast("Speichern im Browser nicht möglich");
      return false;
    }
  }

  const storedOptions = readJSON(OPTIONS_KEY, readJSON("filament-label-options-v9", readJSON("filament-label-options-v8", readJSON("filament-label-options-v7", readJSON("filament-label-options-v6", readJSON("filament-label-options-v5", DEFAULTS))))));
  const options = {};
  ["brand", "material", "color", "finish"].forEach((key) => {
    const saved = storedOptions && Array.isArray(storedOptions[key]) ? storedOptions[key] : DEFAULTS[key];
    options[key] = saved
      .map((name) => name === "DPLy" ? "Deeplee" : name)
      .filter((name) => !(key === "material" && name === "Andere"));
    if (key === "material" && options[key].includes("PLA+")) {
      options[key] = ["PLA+", ...options[key].filter((name) => name !== "PLA+")];
    }
  });
  let recent = readJSON(RECENT_KEY, readJSON("filament-label-recent-v9", readJSON("filament-label-recent-v8", readJSON("filament-label-recent-v7", readJSON("filament-label-recent-v6", readJSON("filament-label-recent-v5", []))))));
  if (!Array.isArray(recent)) recent = [];

  function toast(message) {
    const node = $("toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => node.classList.remove("show"), 2200);
  }

  function fillSelect(id, values, placeholder) {
    const select = $(id);
    select.replaceChildren();
    if (!values.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = placeholder;
      option.disabled = true;
      option.selected = true;
      select.append(option);
    } else {
      values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.append(option);
      });
    }
    syncCustomDropdown(select);
  }


  function syncCustomDropdown(select) {
    const wrapper = select.closest(".custom-select");
    if (!wrapper) return;
    const trigger = wrapper.querySelector(".custom-select-trigger");
    const menu = wrapper.querySelector(".custom-select-menu");
    const selected = select.options[select.selectedIndex];
    trigger.querySelector(".custom-select-value").textContent = selected ? selected.textContent : "";
    menu.replaceChildren();

    Array.from(select.options).forEach((option, index) => {
      if (option.disabled) return;
      const item = document.createElement("button");
      item.type = "button";
      item.className = "custom-select-option";
      item.textContent = option.textContent;
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", option.selected ? "true" : "false");
      let holdTimer = null;
      let held = false;
      const clearHold = () => {
        if (holdTimer) window.clearTimeout(holdTimer);
        holdTimer = null;
      };
      item.addEventListener("pointerdown", () => {
        held = false;
        clearHold();
        holdTimer = window.setTimeout(() => {
          held = true;
          const key = select.id;
          if (DEFAULTS[key].some((entry) => entry.toLocaleLowerCase() === option.value.toLocaleLowerCase())) {
            toast("Standard-Einträge können nicht gelöscht werden");
            return;
          }
          if (!window.confirm(`„${option.textContent}“ wirklich löschen?`)) return;
          const wasSelected = select.value === option.value;
          options[key] = options[key].filter((entry) => entry !== option.value);
          writeJSON(OPTIONS_KEY, options);
          refreshOptions();
          if (wasSelected && select.options.length) select.selectedIndex = 0;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          updatePreview();
          toast("Eintrag gelöscht");
        }, 600);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => item.addEventListener(eventName, clearHold));
      item.addEventListener("contextmenu", (event) => event.preventDefault());
      item.addEventListener("click", () => {
        if (held) { held = false; return; }
        select.selectedIndex = index;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        closeCustomDropdowns();
        trigger.focus();
      });
      menu.append(item);
    });
  }

  function closeCustomDropdowns(except = null) {
    document.querySelectorAll(".custom-select.open").forEach((wrapper) => {
      if (wrapper !== except) {
        wrapper.classList.remove("open");
        wrapper.querySelector(".custom-select-trigger").setAttribute("aria-expanded", "false");
      }
    });
  }

  function initializeCustomDropdowns() {
    document.querySelectorAll("select:not([data-native-dropdown])").forEach((select) => {
      if (select.closest(".custom-select")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "custom-select";
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "custom-select-trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      const value = document.createElement("span");
      value.className = "custom-select-value";
      trigger.append(value);

      const menu = document.createElement("div");
      menu.className = "custom-select-menu";
      menu.setAttribute("role", "listbox");

      wrapper.append(trigger, menu);
      select.parentNode.insertBefore(wrapper, select);
      wrapper.append(select);

      trigger.addEventListener("click", () => {
        const willOpen = !wrapper.classList.contains("open");
        closeCustomDropdowns(wrapper);
        wrapper.classList.toggle("open", willOpen);
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });

      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeCustomDropdowns();
          trigger.focus();
        } else if (["ArrowDown", "Enter", " "].includes(event.key)) {
          event.preventDefault();
          closeCustomDropdowns(wrapper);
          wrapper.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
          menu.querySelector(".custom-select-option")?.focus();
        }
      });

      menu.addEventListener("keydown", (event) => {
        const items = Array.from(menu.querySelectorAll(".custom-select-option"));
        const current = items.indexOf(document.activeElement);
        if (event.key === "Escape") {
          event.preventDefault();
          closeCustomDropdowns();
          trigger.focus();
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          const next = event.key === "ArrowDown"
            ? Math.min(items.length - 1, current + 1)
            : Math.max(0, current - 1);
          items[next]?.focus();
        }
      });

      select.addEventListener("change", () => syncCustomDropdown(select));
      syncCustomDropdown(select);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".custom-select")) closeCustomDropdowns();
    });
  }

  function refreshOptions() {
    fillSelect("brand", options.brand, "Hersteller hinzufügen");
    fillSelect("material", options.material, "Material hinzufügen");
    fillSelect("color", options.color, "Farbe hinzufügen");
    fillSelect("finish", options.finish, "Ausführung auswählen");
  }

  function currentValues() {
    return {
      brand: $("brand").value,
      material: $("material").value,
      color: $("color").value,
      finish: $("finish").value
    };
  }

  let desktopSettingsReady = false;

  function saveDesktopSettings() {
    if (!desktopSettingsReady || !bridgeAvailable()) return;
    const payload = {
      options,
      selected: currentValues(),
      materialDefaultMigrated: true
    };
    window.pywebview.api.save_settings(payload).then((result) => {
      if (!result || !result.ok) {
        toast((result && result.error) || "Einstellungen konnten nicht gespeichert werden");
      }
    }).catch(() => {
      toast("Einstellungen konnten nicht dauerhaft gespeichert werden");
    });
  }

  async function loadDesktopSettings() {
    if (!bridgeAvailable()) return;
    try {
      const saved = await window.pywebview.api.load_settings();
      if (saved && saved.options && typeof saved.options === "object") {
        ["brand", "material", "color", "finish"].forEach((key) => {
          if (Array.isArray(saved.options[key])) {
            options[key] = saved.options[key].map((name) => name === "DPLy" ? "Deeplee" : String(name));
          }
        });
        refreshOptions();
      }

      const selected = saved && saved.selected && typeof saved.selected === "object"
        ? saved.selected : {};
      const migrateOldPlaDefault = !(saved && saved.materialDefaultMigrated);
      ["brand", "material", "color", "finish"].forEach((key) => {
        const select = $(key);
        const savedValue = selected[key];
        if (key === "material" && options.material.includes("PLA+")
            && (!savedValue || (savedValue === "PLA" && migrateOldPlaDefault))) {
          select.value = "PLA+";
        } else if (savedValue && options[key].includes(savedValue)) {
          select.value = savedValue;
        }
        syncCustomDropdown(select);
      });

      desktopSettingsReady = true;
      // Seed the persistent settings file from existing website localStorage on first launch.
      saveDesktopSettings();
      updatePreview();
    } catch (error) {
      desktopSettingsReady = true;
      saveDesktopSettings();
      toast("Lokale Einstellungen konnten nicht geladen werden");
    }
  }

  let pendingAddKey = null;

  function openAddDialog(key, label) {
    pendingAddKey = key;
    $("addDialogTitle").textContent = `${label} hinzufügen`;
    $("newOptionInput").value = "";
    const dialog = $("addDialog");
    dialog.showModal();
    // Focus synchronously from the tap so iOS can open its keyboard immediately.
    $("newOptionInput").focus();
  }

  function saveNewOption() {
    const key = pendingAddKey;
    const value = $("newOptionInput").value.trim();
    if (!key || !value) {
      toast("Bitte einen Namen eingeben");
      return;
    }
    if (options[key].some((item) => item.toLocaleLowerCase() === value.toLocaleLowerCase())) {
      toast("Diesen Eintrag gibt es bereits");
      return;
    }
    options[key].push(value);
    writeJSON(OPTIONS_KEY, options);
    refreshOptions();
    $(key).value = value;
    syncCustomDropdown($(key));
    updatePreview();
    saveDesktopSettings();
    $("addDialog").close();
    pendingAddKey = null;
    toast("Eintrag gespeichert");
  }

  function shrinkText(element, maxWidth, maxHeight, startSize, minSize) {
    let size = startSize;
    element.style.fontSize = `${size}px`;
    while (size > minSize && (element.scrollWidth > maxWidth + 1 || element.scrollHeight > maxHeight + 1)) {
      size -= 1;
      element.style.fontSize = `${size}px`;
    }
  }

  function updatePreview() {
    const value = currentValues();
    $("previewBrand").textContent = value.brand || "Hersteller";
    $("previewMaterial").textContent = value.material || "PLA";
    $("previewFinish").textContent = value.finish || "Basic";
    $("previewColor").textContent = value.color || "Farbe auswählen";

    requestAnimationFrame(() => {
      const brand = $("previewBrand");
      shrinkText(brand, 102, 84, 38, 27);
      const material = $("previewMaterial");
      shrinkText(material, 112, 46, 42, 24);
      const finish = $("previewFinish");
      shrinkText(finish, 78, 32, 25, 15);
      const color = $("previewColor");
      shrinkText(color, color.clientWidth || 181, 72, 34, 18);
    });
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function renderRecent() {
    const root = $("savedList");
    if (!root) return;
    if (!recent.length) {
      root.innerHTML = '<p class="empty-state">Hier erscheinen deine zuletzt exportierten Etiketten.</p>';
      return;
    }
    root.innerHTML = recent.map((item) => `
      <div class="saved-item">
        <span class="saved-dot" aria-hidden="true"></span>
        <div>
          <strong>${escapeHTML(item.brand)} · ${escapeHTML(item.color)}</strong>
          <small>${escapeHTML(item.material)} · ${escapeHTML(item.finish)}</small>
        </div>
      </div>`).join("");
  }

  function wrapText(context, text, maxWidth, maxLines) {
    const words = String(text).trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (!line || context.measureText(candidate).width <= maxWidth) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);

    if (lines.length <= maxLines) return lines;
    const clipped = lines.slice(0, maxLines);
    let last = clipped[maxLines - 1];
    while (last.length > 1 && context.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    clipped[maxLines - 1] = `${last}…`;
    return clipped;
  }

  function drawLabel(canvas, value) {
    // 40 × 14 mm. Export canvas is 640 × 224 px (2× the website's 320 × 112 design).
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const scale = width / 320;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#080808";
    context.textBaseline = "middle";

    // Give the manufacturer a touch more room but preserve the large content area.
    const brandX = 7 * scale;
    const brandWidth = 106 * scale;
    const dividerX = 120 * scale;
    const rightX = 131 * scale;
    const rightWidth = 181 * scale;

    // Slightly larger, standard bold rather than ultra-heavy: more open counters in A/P/B/R.
    let brandSize = 38 * scale;
    context.textAlign = "left";
    const brand = String(value.brand || "").toUpperCase();
    context.font = `700 ${brandSize}px Arial, Helvetica, sans-serif`;
    while (context.measureText(brand).width > brandWidth && brandSize > 25 * scale) {
      brandSize -= 1 * scale;
      context.font = `700 ${brandSize}px Arial, Helvetica, sans-serif`;
    }
    context.fillText(brand, brandX, height / 2, brandWidth);

    context.fillRect(dividerX, 9 * scale, 1.3 * scale, height - 18 * scale);

    // Material is the main headline; allow a little more room before reducing it.
    context.textAlign = "left";
    let materialSize = 42 * scale;
    const material = String(value.material || "PLA").toUpperCase();
    context.font = `700 ${materialSize}px Arial, Helvetica, sans-serif`;
    while (context.measureText(material).width > rightWidth * 0.62 && materialSize > 22 * scale) {
      materialSize -= 1 * scale;
      context.font = `700 ${materialSize}px Arial, Helvetica, sans-serif`;
    }
    const materialWidth = context.measureText(material).width;

    let finishSize = 25 * scale;
    const finishText = String(value.finish || "");
    context.font = `700 ${finishSize}px Arial, Helvetica, sans-serif`;
    while (materialWidth + 7 * scale + context.measureText(finishText).width > rightWidth && finishSize > 12 * scale) {
      finishSize -= 1 * scale;
      context.font = `700 ${finishSize}px Arial, Helvetica, sans-serif`;
    }

    const rowY = 27 * scale;
    context.font = `700 ${materialSize}px Arial, Helvetica, sans-serif`;
    context.fillText(material, rightX, rowY);
    context.font = `700 ${finishSize}px Arial, Helvetica, sans-serif`;
    context.fillText(finishText, rightX + materialWidth + 7 * scale, rowY);

    // Bigger color lettering; for 2–3 lines shrink only as much as the label height requires.
    const colorText = String(value.color || "");
    let colorSize = 34 * scale;
    let colorLines = [];
    const maxColorHeight = 74 * scale;
    while (colorSize >= 15 * scale) {
      context.font = `700 ${colorSize}px Arial, Helvetica, sans-serif`;
      colorLines = wrapText(context, colorText, rightWidth, 3);
      const lineHeight = colorSize * 1.02;
      const fitsWidth = colorLines.every((line) => context.measureText(line).width <= rightWidth);
      const fitsHeight = colorLines.length * lineHeight <= maxColorHeight;
      if (fitsWidth && fitsHeight) break;
      colorSize -= 1 * scale;
    }

    const colorLineHeight = colorSize * 1.02;
    const colorCenterY = 80 * scale;
    const colorStartY = colorCenterY - ((colorLines.length - 1) * colorLineHeight) / 2;
    context.font = `700 ${colorSize}px Arial, Helvetica, sans-serif`;
    colorLines.forEach((line, index) => {
      context.fillText(line, rightX, colorStartY + index * colorLineHeight, rightWidth);
    });
  }

  function createPrintCanvas(value) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 224;
    drawLabel(canvas, value);
    return canvas;
  }

  let printerConnected = false;
  let connectedPort = null;
  let printerPorts = [];

  function setPrinterStatus(state, text, detail = "") {
    const chip = $("connectPrinter");
    const dot = $("printerStatusDot");
    const label = $("printerStatusText");
    const line = $("printerStatusLine");
    if (!chip || !dot || !label || !line) return;
    chip.classList.remove("connected", "error");
    if (state === "connected") {
      chip.classList.add("connected");
      printerConnected = true;
      label.textContent = text || "Verbunden";
      line.textContent = detail || `Nelko P21 · verbunden${connectedPort ? " · " + connectedPort : ""}`;
    } else {
      if (state === "error") chip.classList.add("error");
      printerConnected = false;
      label.textContent = text || "Verbinden";
      line.textContent = detail || "Nelko P21 · nicht verbunden";
    }
  }

  function bridgeAvailable() {
    return !!(window.pywebview && window.pywebview.api);
  }

  async function refreshPrinterPorts(autoConnect = false) {
    if (!bridgeAvailable()) {
      setPrinterStatus("error", "Nicht bereit", "Druckerschnittstelle noch nicht bereit");
      return;
    }
    try {
      printerPorts = await window.pywebview.api.list_ports();
      const select = $("printerPort");
      select.replaceChildren();
      if (!printerPorts.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Keine COM-Ports gefunden";
        select.append(option);
      } else {
        printerPorts.forEach((port) => {
          const option = document.createElement("option");
          option.value = port.device;
          option.textContent = `${port.device} — ${port.description}`;
          select.append(option);
        });
      }
      syncCustomDropdown(select);

      if (autoConnect) {
        const candidate = printerPorts.find((port) => port.device.toUpperCase() === "COM5")
          || printerPorts.find((port) => /nelko|p21/i.test(port.description || ""));
        if (candidate) {
          $("printerPort").value = candidate.device;
          syncCustomDropdown($("printerPort"));
          await connectToPort(candidate.device, false);
        } else {
          setPrinterStatus("error", "P21 nicht gefunden", "Bitte COM5 auswählen oder Drucker einschalten");
        }
      }
    } catch (error) {
      setPrinterStatus("error", "Portsuche fehlgeschlagen", "COM-Port konnte nicht gelesen werden");
      toast("COM-Ports konnten nicht geladen werden");
    }
  }

  async function connectToPort(device, closeDialog = true) {
    if (!bridgeAvailable() || !device) {
      toast("Bitte einen Bluetooth-COM-Port auswählen");
      return;
    }
    setPrinterStatus("connecting", "Verbinde …", `Verbinde mit ${device} …`);
    try {
      const result = await window.pywebview.api.connect(device);
      if (!result || !result.ok) throw new Error(result && result.error ? result.error : "Verbindung fehlgeschlagen");
      connectedPort = result.port || device;
      setPrinterStatus("connected", "Verbunden", `Nelko P21 · verbunden · ${connectedPort}`);
      if (closeDialog) $("printerDialog").close();
      toast(`Nelko P21 verbunden · ${connectedPort}`);
    } catch (error) {
      connectedPort = null;
      setPrinterStatus("error", "Nicht verbunden", `Verbindung zu ${device} fehlgeschlagen`);
      toast(error.message || "Verbindung fehlgeschlagen");
    }
  }

  async function printDirectly() {
    const value = currentValues();
    if (!value.brand) { toast("Bitte einen Hersteller auswählen"); return; }
    if (!value.color) { toast("Bitte zuerst eine Farbbezeichnung über ＋ hinzufügen"); return; }
    if (!bridgeAvailable()) {
      const canvas = createPrintCanvas(value);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      const safeName = [value.brand, value.material, value.color, value.finish]
        .filter(Boolean).join("-").replace(/[^a-z0-9äöüß_-]+/gi, "-").replace(/^-+|-+$/g, "");
      link.download = `${safeName || "filament-label"}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      toast("PNG gespeichert. Für Nelko-P21-Direktdruck bitte STARTEN.bat verwenden.");
      return;
    }
    if (!printerConnected) {
      $("printerDialog").showModal();
      await refreshPrinterPorts(false);
      toast("Bitte zuerst den Nelko P21 verbinden");
      return;
    }
    const button = $("printLabel");
    button.disabled = true;
    button.innerHTML = 'Drucke Etikett …';
    try {
      const canvas = createPrintCanvas(value);
      const pngDataUrl = canvas.toDataURL("image/png");
      const result = await window.pywebview.api.print_label(pngDataUrl, 10, 1);
      if (!result || !result.ok) throw new Error(result && result.error ? result.error : "Druckauftrag fehlgeschlagen");
      toast("Druckauftrag an den Nelko P21 gesendet");
      setPrinterStatus("connected", "Verbunden", `Nelko P21 · Druckauftrag gesendet · ${connectedPort}`);
    } catch (error) {
      toast(error.message || "Drucken fehlgeschlagen");
      setPrinterStatus("error", "Druckfehler", error.message || "Druckauftrag fehlgeschlagen");
    } finally {
      button.disabled = false;
      button.innerHTML = 'Etikett direkt drucken <span aria-hidden="true">→</span>';
    }
  }

  function openPrinterDialog() {
    if (!$("printerDialog").open) $("printerDialog").showModal();
    refreshPrinterPorts(false);
  }

  async function initializeDesktopBridge() {
    await loadDesktopSettings();
    await refreshPrinterPorts(true);
  }

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.add;
      const labels = { brand: "Hersteller", material: "Material", color: "Farbbezeichnung", finish: "Ausführung" };
      openAddDialog(key, labels[key]);
    });
  });
  $("addForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveNewOption();
  });
  $("cancelAdd").addEventListener("click", () => {
    $("addDialog").close();
    pendingAddKey = null;
  });

  ["brand", "material", "color", "finish"].forEach((id) => {
    $(id).addEventListener("change", () => {
      updatePreview();
      saveDesktopSettings();
    });
  });

  $("printLabel").addEventListener("click", printDirectly);
  $("connectPrinter").addEventListener("click", openPrinterDialog);
  $("refreshPrinterPorts").addEventListener("click", () => refreshPrinterPorts(false));
  $("connectPrinterPort").addEventListener("click", () => connectToPort($("printerPort").value, true));
  $("closePrinterDialog").addEventListener("click", () => $("printerDialog").close());
  if (window.pywebview && window.pywebview.api) {
    initializeDesktopBridge();
  } else {
    $("printLabel").innerHTML = 'Etikett als PNG speichern <span aria-hidden="true">↓</span>';
    setPrinterStatus("error", "Windows-Druck", "Für Bluetooth-Direktdruck bitte label-studio/STARTEN.bat starten");
    window.addEventListener("pywebviewready", initializeDesktopBridge, { once: true });
  }



  initializeCustomDropdowns();
  refreshOptions();
  if (options.material.includes("PLA+")) $("material").value = "PLA+";
  updatePreview();
})();