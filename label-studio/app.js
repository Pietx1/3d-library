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
    document.querySelectorAll("select").forEach((select) => {
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
      shrinkText(brand, 96, 78, 31, 24);
      const material = $("previewMaterial");
      shrinkText(material, 190, 38, 32, 20);
      const finish = $("previewFinish");
      shrinkText(finish, 190, 24, 17, 12);
      const color = $("previewColor");
      shrinkText(color, color.clientWidth || 188, 56, 22, 14);
    });
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function renderRecent() {
    const root = $("savedList");
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
    // 40 × 14 mm. The PNG is exported at 2× (640 × 224 px) for cleaner edges;
    // its 20:7 aspect ratio remains exact and it can be fitted to the P21 label.
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const scale = width / 320;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#080808";
    context.textBaseline = "middle";

    // Move the manufacturer area and divider left to give the important
    // material/finish/color block more usable width.
    const brandX = 7 * scale;
    const brandWidth = 98 * scale;
    const dividerX = 112 * scale;
    const rightX = 123 * scale;
    const rightWidth = 189 * scale;

    // Brand is left aligned instead of centered in a wide empty column.
    let brandSize = 38 * scale;
    context.textAlign = "left";
    context.font = `900 ${brandSize}px Arial, Helvetica, sans-serif`;
    const brand = String(value.brand || "").toUpperCase();
    while (context.measureText(brand).width > brandWidth && brandSize > 24 * scale) {
      brandSize -= 1 * scale;
      context.font = `900 ${brandSize}px Arial, Helvetica, sans-serif`;
    }
    context.fillText(brand, brandX, height / 2, brandWidth);

    context.fillRect(dividerX, 9 * scale, 1.3 * scale, height - 18 * scale);

    // Material is prominent; finish is larger but remains secondary.
    context.textAlign = "left";
    let materialSize = 42 * scale;
    const material = String(value.material || "PLA").toUpperCase();
    context.font = `900 ${materialSize}px Arial, Helvetica, sans-serif`;
    while (context.measureText(material).width > rightWidth * 0.58 && materialSize > 19 * scale) {
      materialSize -= 1 * scale;
      context.font = `900 ${materialSize}px Arial, Helvetica, sans-serif`;
    }
    const materialWidth = context.measureText(material).width;

    let finishSize = 25 * scale;
    context.font = `700 ${finishSize}px Arial, Helvetica, sans-serif`;
    while (materialWidth + 7 * scale + context.measureText(value.finish || "").width > rightWidth && finishSize > 11 * scale) {
      finishSize -= 1 * scale;
      context.font = `700 ${finishSize}px Arial, Helvetica, sans-serif`;
    }

    const rowY = 29 * scale;
    context.font = `900 ${materialSize}px Arial, Helvetica, sans-serif`;
    context.fillText(material, rightX, rowY);
    context.font = `700 ${finishSize}px Arial, Helvetica, sans-serif`;
    context.fillText(String(value.finish || ""), rightX + materialWidth + 7 * scale, rowY);

    // Color is the second most important field: larger, bold and allowed up
    // to three tidy lines for longer names rather than becoming tiny.
    const colorText = String(value.color || "");
    let colorSize = 34 * scale;
    let colorLines;
    do {
      context.font = `800 ${colorSize}px Arial, Helvetica, sans-serif`;
      colorLines = wrapText(context, colorText, rightWidth, 3);
      if (colorLines.every((line) => context.measureText(line).width <= rightWidth)) break;
      colorSize -= 1 * scale;
    } while (colorSize > 14 * scale);

    const colorLineHeight = colorSize * 1.08;
    const colorCenterY = 79 * scale;
    const colorStartY = colorCenterY - ((colorLines.length - 1) * colorLineHeight) / 2;
    context.font = `800 ${colorSize}px Arial, Helvetica, sans-serif`;
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

  function exportLabel() {
    const value = currentValues();
    if (!value.brand) {
      toast("Bitte einen Hersteller auswählen");
      return;
    }
    if (!value.color) {
      toast("Bitte zuerst eine Farbbezeichnung über ＋ hinzufügen");
      return;
    }

    const canvas = createPrintCanvas(value);

    canvas.toBlob((blob) => {
      if (!blob) {
        toast("PNG-Export fehlgeschlagen");
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${value.brand}-${value.material}-${value.color}.png`
        .replace(/[^a-z0-9._-]/gi, "_");
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);

      recent.unshift(value);
      recent = recent.slice(0, 8);
      writeJSON(RECENT_KEY, recent);
      renderRecent();
      toast("Etikett als PNG exportiert");
    }, "image/png");
  }


  function createLabelFile(value) {
    const canvas = createPrintCanvas(value);
    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.split(",")[1];
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    const blob = new Blob([bytes], { type: "image/png" });
    const filename = `${value.brand}-${value.material}-${value.color}.png`
      .replace(/[^a-z0-9._-]/gi, "_");
    return new File([blob], filename, { type: "image/png" });
  }

  const PRINT_BRIDGE_URL = "http://127.0.0.1:8765";
  let printerStatusBusy = false;
  let printerConnected = false;

  function showPrinterStatus(state, message, hint = "") {
    const node = $("printerStatus");
    if (!node) return;
    node.textContent = message;
    node.dataset.state = state;
    $("printerHint").textContent = hint;
    $("printerDot").dataset.state = state;
  }

  async function bridgeRequest(path, options = {}) {
    const response = await fetch(`${PRINT_BRIDGE_URL}${path}`, {
      cache: "no-store",
      ...options
    });
    let payload = {};
    try { payload = await response.json(); } catch (_) {}
    if (!response.ok) {
      throw new Error(payload.error || `Druckdienst antwortet mit ${response.status}`);
    }
    return payload;
  }

  function renderPrinterPorts(ports, preferred = "") {
    const select = $("printerPort");
    const previous = preferred || select.value;
    select.replaceChildren();
    if (!Array.isArray(ports) || ports.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Kein Bluetooth-COM-Port gefunden";
      select.append(option);
      select.disabled = true;
      $("connectPrinter").disabled = true;
      return;
    }

    ports.forEach((port) => {
      const option = document.createElement("option");
      option.value = port.device;
      option.textContent = `${port.device} · ${port.description || "Serieller Anschluss"}`;
      select.append(option);
    });
    select.disabled = false;
    $("connectPrinter").disabled = false;
    if (previous && ports.some((port) => port.device === previous)) {
      select.value = previous;
    } else {
      const likely = ports.find((port) => /COM5/i.test(port.device))
        || ports.find((port) => /nelko|p21|bluetooth/i.test(port.description || ""))
        || ports[0];
      select.value = likely.device;
    }
  }

  async function refreshPrinterStatus() {
    if (printerStatusBusy) return;
    printerStatusBusy = true;
    try {
      const status = await bridgeRequest("/status");
      renderPrinterPorts(status.ports, status.port || "");
      printerConnected = Boolean(status.connected);
      if (status.connected) {
        showPrinterStatus("connected", `Nelko P21 verbunden · ${status.port}`, "Der Drucker ist bereit.");
      } else if (status.ports && status.ports.length) {
        showPrinterStatus("disconnected", "Druckdienst läuft – Drucker nicht verbunden", "Wähle den ausgehenden Bluetooth-COM-Port und klicke auf Verbinden.");
      } else {
        showPrinterStatus("disconnected", "Druckdienst läuft – kein COM-Port gefunden", "Prüfe die Bluetooth-Kopplung und die COM-Ports in Windows.");
      }
    } catch (error) {
      printerConnected = false;
      renderPrinterPorts([]);
      showPrinterStatus("offline", "Windows-Druckdienst nicht erreichbar", "Starte im Ordner windows-app die Datei START_DRUCKDIENST.bat. Das Fenster muss offen bleiben.");
    } finally {
      printerStatusBusy = false;
    }
  }

  async function connectPrinter() {
    const device = $("printerPort").value;
    if (!device) {
      toast("Windows hat keinen COM-Port gemeldet");
      return;
    }
    const button = $("connectPrinter");
    button.disabled = true;
    button.textContent = "Verbinde …";
    showPrinterStatus("checking", `Verbinde über ${device} …`, "Bluetooth-Verbindung wird geöffnet.");
    try {
      const result = await bridgeRequest("/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device })
      });
      printerConnected = Boolean(result.connected || result.ok);
      if (!printerConnected) throw new Error(result.error || "Verbindung fehlgeschlagen");
      showPrinterStatus("connected", `Nelko P21 verbunden · ${device}`, "Der Drucker ist bereit.");
      toast(`Nelko P21 über ${device} verbunden`);
    } catch (error) {
      printerConnected = false;
      showPrinterStatus("error", `Verbindung über ${device} fehlgeschlagen`, error.message);
      toast(error.message || "Verbindung fehlgeschlagen");
    } finally {
      button.disabled = false;
      button.textContent = "Verbinden";
      refreshPrinterStatus();
    }
  }

  async function printDirectly() {
    const value = currentValues();
    if (!value.brand) {
      toast("Bitte einen Hersteller auswählen");
      return;
    }
    if (!value.color) {
      toast("Bitte zuerst eine Farbbezeichnung über ＋ hinzufügen");
      return;
    }

    const button = $("printLabel");
    button.disabled = true;
    button.classList.add("is-printing");
    try {
      if (!printerConnected) {
        const device = $("printerPort").value;
        if (!device) throw new Error("Kein COM-Port verfügbar. Starte den Druckdienst und suche erneut.");
        showPrinterStatus("checking", `Verbinde über ${device} …`, "Bluetooth-Verbindung wird geöffnet.");
        const connected = await bridgeRequest("/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device })
        });
        if (!connected.ok) throw new Error(connected.error || "Nelko P21 konnte nicht verbunden werden.");
        printerConnected = true;
      }

      showPrinterStatus("checking", "Etikett wird übertragen …", "Bitte den Drucker eingeschaltet lassen.");
      const pngDataUrl = createPrintCanvas(value).toDataURL("image/png");
      const result = await bridgeRequest("/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pngDataUrl, density: 10, copies: 1 })
      });
      if (!result.ok) throw new Error(result.error || "Druckauftrag fehlgeschlagen");
      rememberRecent(value);
      printerConnected = true;
      showPrinterStatus("connected", `Nelko P21 verbunden · ${result.port}`, "Etikett wurde an den Drucker gesendet.");
      toast("Etikett wurde an den Nelko P21 gesendet");
    } catch (error) {
      printerConnected = false;
      showPrinterStatus("error", "Drucken nicht möglich", error.message || "Bitte Verbindung prüfen.");
      toast(error.message || "Drucken fehlgeschlagen");
    } finally {
      button.disabled = false;
      button.classList.remove("is-printing");
      refreshPrinterStatus();
    }
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function rememberRecent(value) {
    recent.unshift(value);
    recent = recent.slice(0, 8);
    writeJSON(RECENT_KEY, recent);
    renderRecent();
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
    $(id).addEventListener("change", updatePreview);
  });

  $("exportLabel").addEventListener("click", exportLabel);
  $("printLabel").addEventListener("click", printDirectly);
  $("connectPrinter").addEventListener("click", connectPrinter);
  $("refreshPrinter").addEventListener("click", refreshPrinterStatus);
  refreshPrinterStatus();
  window.setInterval(refreshPrinterStatus, 5000);

  $("clearSaved").addEventListener("click", () => {
    recent = [];
    writeJSON(RECENT_KEY, recent);
    renderRecent();
    toast("Liste geleert");
  });

  initializeCustomDropdowns();
  refreshOptions();
  updatePreview();
  renderRecent();
})();