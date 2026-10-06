
/* =========================================================
   3D LIBRARY
   Supabase + 3MF + Three.js
   ========================================================= */


/* =========================================================
   SUPABASE
   Publishable Key ist für Browser-Code vorgesehen.
   Niemals einen sb_secret / service_role Key hier eintragen.
   ========================================================= */

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL =
    "https://drzxekwrnkfssrqqjxyr.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_AABIUgvFSeK4GEGpUqQg2Q_MV5F1PV6";


const AUTH_REDIRECT_URL =
    "https://pietx1.github.io/3d-library/";


const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                experimental: {
                    passkey: true
                }
            }
        }
    );


/* =========================================================
   DOM
   ========================================================= */

const fileInput =
    document.getElementById("fileInput");

const dropZone =
    document.getElementById("dropZone");

const dropUploadButton =
    document.getElementById("dropUploadButton");

const modelGrid =
    document.getElementById("modelGrid");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const tagFilterList =
    document.getElementById("tagFilterList");

const addTagButton =
    document.getElementById("addTagButton");

const manageTagsButton =
    document.getElementById("manageTagsButton");

const managedTagList =
    document.getElementById("managedTagList");

const noTagsMessage =
    document.getElementById("noTagsMessage");

const modelCount =
    document.getElementById("modelCount");

const sortSelect =
    document.getElementById("sortSelect");


/* Navigation */

const libraryNav =
    document.getElementById("libraryNav");

const queueNav =
    document.getElementById("queueNav");

const mobileLibraryNav =
    document.getElementById("mobileLibraryNav");

const mobileQueueNav =
    document.getElementById("mobileQueueNav");

const libraryPage =
    document.getElementById("libraryPage");

const queuePage =
    document.getElementById("queuePage");

const queueBadge =
    document.getElementById("queueBadge");


/* Queue */

const queueHeader =
    document.getElementById("queueHeader");

const queueSummary =
    document.getElementById("queueSummary");

const queuePageList =
    document.getElementById("queuePageList");

const queueEmpty =
    document.getElementById("queueEmpty");

const clearQueueButton =
    document.getElementById("clearQueueButton");


/* Tags */

const tagModal =
    document.getElementById("tagModal");

const tagInput =
    document.getElementById("tagInput");

const saveTag =
    document.getElementById("saveTag");

const cancelTag =
    document.getElementById("cancelTag");

const closeTagModal =
    document.getElementById("closeTagModal");

const manageTagsModal =
    document.getElementById("manageTagsModal");

const closeManageTags =
    document.getElementById("closeManageTags");


/* Edit */

const editModelModal =
    document.getElementById("editModelModal");

const editNameInput =
    document.getElementById("editNameInput");

const editTagGrid =
    document.getElementById("editTagGrid");

const replaceFileInput =
    document.getElementById("replaceFileInput");

if (replaceFileInput) {
    replaceFileInput.accept = ".3mf,.stl";
}

const saveEditModel =
    document.getElementById("saveEditModel");

const cancelEditModel =
    document.getElementById("cancelEditModel");

const closeEditModel =
    document.getElementById("closeEditModel");


/* Queue modal */

const queueEntryModal =
    document.getElementById("queueEntryModal");

const queueModalTitle =
    document.getElementById("queueModalTitle");

const queueEntryModelName =
    document.getElementById("queueEntryModelName");

const quantityInput =
    document.getElementById("quantityInput");

const queueNotesInput =
    document.getElementById("queueNotesInput");

const queueNotesCounter =
    document.getElementById("queueNotesCounter");

const queueSizeArea =
    document.getElementById("queueSizeArea");

const queueSizePresets =
    document.getElementById("queueSizePresets");

const customSizeInput =
    document.getElementById("customSizeInput");

const unitToggleButton =
    document.getElementById("unitToggleButton");

const savePresetSizeButton =
    document.getElementById("savePresetSizeButton");

const saveQueueEntryButton =
    document.getElementById("saveQueueEntry");

const cancelQueueEntry =
    document.getElementById("cancelQueueEntry");

const closeQueueEntry =
    document.getElementById("closeQueueEntry");

/* Plate previews */

const platePreviewModal =
    document.getElementById("platePreviewModal");

const platePreviewTitle =
    document.getElementById("platePreviewTitle");

const platePreviewLoading =
    document.getElementById("platePreviewLoading");

const platePreviewError =
    document.getElementById("platePreviewError");

const platePreviewGrid =
    document.getElementById("platePreviewGrid");

const closePlatePreview =
    document.getElementById("closePlatePreview");


/* Companion */

const companionButton =
    document.getElementById("companionButton");

const companionModal =
    document.getElementById("companionModal");

const createCompanionPairing =
    document.getElementById("createCompanionPairing");

const companionCodeArea =
    document.getElementById("companionCodeArea");

const companionCode =
    document.getElementById("companionCode");

const companionExpires =
    document.getElementById("companionExpires");

const copyCompanionCode =
    document.getElementById("copyCompanionCode");

const closeCompanion =
    document.getElementById("closeCompanion");


/* Toast */

const toastContainer =
    document.getElementById("toastContainer");


/* Auth / Passkey */

const authModal =
    document.getElementById("authModal");

const authTitle =
    document.getElementById("authTitle");

const authDescription =
    document.getElementById("authDescription");

const passkeySignInButton =
    document.getElementById("passkeySignInButton");

const passkeyRegisterButton =
    document.getElementById("passkeyRegisterButton");

const openEmailSetupButton =
    document.getElementById("openEmailSetupButton");

const authEmailArea =
    document.getElementById("authEmailArea");

const authEmailInput =
    document.getElementById("authEmailInput");

const sendAuthEmailButton =
    document.getElementById("sendAuthEmailButton");

const authHelpText =
    document.getElementById("authHelpText");

const authStatus =
    document.getElementById("authStatus");


/* =========================================================
   APP STATE
   ========================================================= */

const models = [];

const tags = [];

const printQueue = [];


let currentUser = null;

let activeTag = "all";

let modelForEdit = null;

let queueModel = null;

let queueEntryForEdit = null;

let unitIsCentimeters = true;

let multiSelectMode = false;
const selectedModelIds = new Set();
let v42UiReady = false;

const LAST_OPENED_STORAGE_KEY =
    "3d-library-last-opened-v1";

const THEME_STORAGE_KEY =
    "3d-library-theme-v1";


/* =========================================================
   CLOUD HELPERS
   ========================================================= */

const MODEL_BUCKET =
    "models";

const PREVIEW_BUCKET =
    "preview";

const SIGNED_URL_SECONDS =
    24 * 60 * 60;


/* =========================================================
   IMPORT – 3MF / STL / ZIP
   ========================================================= */

const SUPPORTED_IMPORT_EXTENSIONS = [
    ".3mf",
    ".stl",
    ".zip"
];


function getFileExtension(name = "") {

    const cleanName =
        String(name)
            .replace(/\\/g, "/")
            .split("/")
            .pop();

    const dot =
        cleanName.lastIndexOf(".");

    return dot >= 0
        ? cleanName.slice(dot).toLowerCase()
        : "";

}


function getBaseName(name = "") {

    const cleanName =
        String(name)
            .replace(/\\/g, "/")
            .split("/")
            .pop();

    return cleanName.replace(
        /\\.[^.]+$/i,
        ""
    );

}


function getImportMimeType(extension) {

    if (extension === ".stl") {
        return "model/stl";
    }

    return "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";

}


function isSupportedModelFile(name = "") {

    return [
        ".3mf",
        ".stl"
    ].includes(
        getFileExtension(name)
    );

}


function installZipImportStyles() {

    if (document.getElementById("zipImportStyles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "zipImportStyles";
    style.textContent = `
        .zip-import-modal {
            position: fixed;
            inset: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            background: rgba(15,15,18,.44);
            backdrop-filter: blur(8px);
        }
        .zip-import-window {
            width: min(820px, 100%);
            max-height: min(820px, calc(100vh - 36px));
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid var(--border);
            border-radius: 20px;
            background: var(--surface);
            box-shadow: 0 30px 90px rgba(0,0,0,.24);
        }
        .zip-import-header {
            padding: 22px 24px 14px;
            border-bottom: 1px solid var(--border);
        }
        .zip-import-header h2 {
            margin: 0 0 6px;
            font-size: 22px;
        }
        .zip-import-header p {
            margin: 0;
            color: var(--muted);
            font-size: 12px;
            line-height: 1.5;
        }
        .zip-import-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px 24px;
            border-bottom: 1px solid var(--border);
            background: var(--surface-2);
        }
        .zip-import-tool {
            border: 1px solid var(--border);
            border-radius: 9px;
            padding: 8px 11px;
            background: white;
            color: var(--text);
            font-size: 11px;
            cursor: pointer;
        }
        .zip-import-tool:hover {
            background: #f7f7f8;
        }
        .zip-import-list {
            min-height: 0;
            overflow: auto;
            padding: 8px 14px;
        }
        .zip-import-row {
            display: grid;
            grid-template-columns: 22px minmax(0,1fr) auto;
            align-items: center;
            gap: 12px;
            padding: 11px 10px;
            border-radius: 12px;
        }
        .zip-import-row:hover {
            background: var(--surface-2);
        }
        .zip-import-row.is-duplicate {
            background: #fff6f5;
        }
        .zip-import-name {
            overflow-wrap: anywhere;
            color: var(--text);
            font-size: 13px;
            font-weight: 700;
        }
        .zip-import-path {
            margin-top: 3px;
            overflow-wrap: anywhere;
            color: var(--muted-2);
            font-size: 10px;
            line-height: 1.4;
        }
        .zip-import-status {
            max-width: 260px;
            text-align: right;
            color: var(--muted);
            font-size: 10px;
            line-height: 1.4;
        }
        .zip-import-status.duplicate {
            color: #b5473d;
            font-weight: 750;
        }
        .zip-import-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 24px;
            border-top: 1px solid var(--border);
        }
        .zip-import-count {
            min-width: 0;
            color: var(--muted);
            font-size: 11px;
            line-height: 1.45;
        }
        .zip-import-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }
        @media (max-width: 700px) {
            .zip-import-window {
                max-height: calc(100vh - 24px);
                border-radius: 16px;
            }
            .zip-import-header,
            .zip-import-toolbar,
            .zip-import-footer {
                padding-left: 16px;
                padding-right: 16px;
            }
            .zip-import-row {
                grid-template-columns: 22px minmax(0,1fr);
            }
            .zip-import-status {
                grid-column: 2;
                max-width: none;
                text-align: left;
            }
            .zip-import-footer {
                flex-direction: column;
                align-items: stretch;
            }
            .zip-import-actions {
                width: 100%;
            }
            .zip-import-actions > button {
                flex: 1;
            }
        }
    `;
    document.head.appendChild(style);
}


function formatImportSize(bytes = 0) {

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

}


async function inspectZipFile(zipFile) {

    if (typeof JSZip === "undefined") {
        throw new Error(
            "ZIP-Unterstützung ist nicht geladen. Bitte die Seite einmal vollständig neu laden."
        );
    }

    const zip =
        await JSZip.loadAsync(
            await zipFile.arrayBuffer()
        );

    const entries =
        Object.values(zip.files)
            .filter(entry => !entry.dir)
            .filter(entry => isSupportedModelFile(entry.name))
            .filter(entry => !/^(__MACOSX|\.DS_Store)(\/|$)/i.test(entry.name));

    const items = [];
    const seenHashes = new Map();

    for (const entry of entries) {

        const bytes =
            await entry.async("uint8array");

        const hash =
            await createHash(
                bytes.buffer
            );

        const extension =
            getFileExtension(entry.name);

        const path =
            String(entry.name).replace(
                /\\/g,
                "/"
            );

        const name =
            path.split("/").pop() || path;

        const existing =
            models.find(
                model => model.fileHash === hash
            );

        const previous =
            seenHashes.get(hash);

        items.push({
            bytes,
            hash,
            extension,
            name,
            path,
            size: bytes.byteLength,
            selected:
                false,
            duplicateMessage:
                existing
                    ? `Bereits vorhanden: ${existing.name}`
                    : previous
                        ? `Doppelt in dieser ZIP: ${previous.name}`
                        : ""
        });

        if (!seenHashes.has(hash)) {
            seenHashes.set(
                hash,
                items[items.length - 1]
            );
        }

    }

    return items;

}


async function showZipSelectionDialog(items, zipFile) {

    installZipImportStyles();

    const overlay =
        document.createElement("div");

    overlay.className =
        "zip-import-modal";

    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const win =
        document.createElement("div");

    win.className =
        "zip-import-window";

    const header =
        document.createElement("div");

    header.className =
        "zip-import-header";

    header.innerHTML = `
        <h2>Dateien aus ZIP auswählen</h2>
        <p>${escapeHTML(zipFile.name)} · ${items.length} unterstützte Datei${items.length === 1 ? "" : "en"} gefunden. Es werden nur 3MF- und STL-Dateien angezeigt.</p>
    `;

    const toolbar =
        document.createElement("div");

    toolbar.className =
        "zip-import-toolbar";

    const list =
        document.createElement("div");

    list.className =
        "zip-import-list";

    const footer =
        document.createElement("div");

    footer.className =
        "zip-import-footer";

    const count =
        document.createElement("div");

    count.className =
        "zip-import-count";

    const actions =
        document.createElement("div");

    actions.className =
        "zip-import-actions";

    const cancel =
        document.createElement("button");

    cancel.type = "button";
    cancel.className = "secondary-button";
    cancel.textContent = "Abbrechen";

    const importButton =
        document.createElement("button");

    importButton.type = "button";
    importButton.className = "primary-button";

    const updateCount = () => {

        const selected =
            items.filter(item => item.selected).length;

        const duplicateCount =
            items.filter(item => item.duplicateMessage).length;

        count.textContent =
            `${selected} ausgewählt${duplicateCount ? ` · ${duplicateCount} doppelt/bereits vorhanden` : ""}`;

        importButton.textContent =
            selected
                ? `${selected} Datei${selected === 1 ? "" : "en"} importieren`
                : "Importieren";

        importButton.disabled =
            selected === 0;

    };

    const setSelection = predicate => {
        items.forEach(item => {
            item.selected = predicate(item);
            if (item.input) {
                item.input.checked = item.selected;
            }
        });
        updateCount();
    };

    const makeTool = (label, predicate) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "zip-import-tool";
        button.textContent = label;
        button.addEventListener("click", () => setSelection(predicate));
        return button;
    };

    toolbar.append(
        makeTool("Alle", () => true),
        makeTool("Alle 3MF", item => item.extension === ".3mf"),
        makeTool("Alle STL", item => item.extension === ".stl"),
        makeTool("Alle abwählen", () => false)
    );

    items.forEach(item => {

        const row =
            document.createElement("label");

        row.className =
            `zip-import-row${item.duplicateMessage ? " is-duplicate" : ""}`;

        const input =
            document.createElement("input");

        input.type = "checkbox";
        input.checked = item.selected;
        item.input = input;

        input.addEventListener(
            "click",
            event => event.stopPropagation()
        );

        input.addEventListener(
            "change",
            () => {
                item.selected = input.checked;
                updateCount();
            }
        );

        const info =
            document.createElement("div");

        info.className = "zip-import-file";

        info.innerHTML = `
            <div class="zip-import-name">${escapeHTML(item.name)}</div>
            <div class="zip-import-path">${escapeHTML(item.path)} · ${formatImportSize(item.size)}</div>
        `;

        const status =
            document.createElement("div");

        status.className =
            `zip-import-status${item.duplicateMessage ? " duplicate" : ""}`;

        status.textContent =
            item.duplicateMessage ||
            item.extension.toUpperCase().slice(1);

        row.append(
            input,
            info,
            status
        );

        list.appendChild(row);

    });

    actions.append(
        cancel,
        importButton
    );

    footer.append(
        count,
        actions
    );

    win.append(
        header,
        toolbar,
        list,
        footer
    );

    overlay.appendChild(win);
    document.body.appendChild(overlay);

    updateCount();

    return new Promise(resolve => {

        let settled = false;

        const finish = value => {
            if (settled) return;
            settled = true;
            overlay.remove();
            resolve(value);
        };

        cancel.addEventListener(
            "click",
            () => finish([])
        );

        overlay.addEventListener(
            "click",
            event => {
                if (event.target === overlay) {
                    finish([]);
                }
            }
        );

        importButton.addEventListener(
            "click",
            () => finish(
                items.filter(item => item.selected)
            )
        );

    });

}


async function importZipFile(zipFile) {

    showToast(
        `ZIP wird untersucht: "${zipFile.name}"`,
        "info"
    );

    try {

        const items =
            await inspectZipFile(
                zipFile
            );

        if (!items.length) {
            showToast(
                "In der ZIP wurden keine 3MF- oder STL-Dateien gefunden.",
                "error"
            );
            return 0;
        }

        const selected =
            await showZipSelectionDialog(
                items,
                zipFile
            );

        if (!selected.length) {
            return 0;
        }

        let added = 0;

        for (const item of selected) {

            const file =
                new File(
                    [item.bytes],
                    item.name,
                    {
                        type:
                            getImportMimeType(
                                item.extension
                            )
                    }
                );

            if (
                await uploadNewModel(
                    file,
                    { skipDuplicateCheck: true }
                )
            ) {
                added++;
            }

        }

        if (added > 0) {
            await loadModels();
            await attachModelRelations();
            renderEverything();
        }

        showToast(
            `${added} Datei${added === 1 ? "" : "en"} aus "${zipFile.name}" importiert.`
        );

        return added;

    } catch (error) {

        console.error(
            "ZIP-Import:",
            error
        );

        showToast(
            `Die ZIP-Datei konnte nicht verarbeitet werden: ${error?.message || "Unbekannter Fehler"}`,
            "error"
        );

        return 0;

    }

}


/* =========================================================
   UPLOAD EVENTS
   ========================================================= */

/*
 * Der komplette Upload-Bereich öffnet den Explorer.
 * Der Button selbst stoppt das Bubbling, damit nicht
 * doppelt geklickt wird.
 */
dropUploadButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();
        fileInput.click();

    }
);


dropZone.addEventListener(
    "click",
    event => {

        if (
            event.target.closest("button")
        ) {

            return;

        }

        fileInput.click();

    }
);


dropZone.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();
            fileInput.click();

        }

    }
);


dropZone.addEventListener(
    "dragover",
    event => {

        event.preventDefault();
        dropZone.classList.add("dragging");

    }
);


dropZone.addEventListener(
    "dragleave",
    event => {

        if (
            !dropZone.contains(event.relatedTarget)
        ) {

            dropZone.classList.remove("dragging");

        }

    }
);


dropZone.addEventListener(
    "drop",
    event => {

        event.preventDefault();
        dropZone.classList.remove("dragging");

        addFiles(
            Array.from(event.dataTransfer.files)
        );

    }
);


fileInput.addEventListener(
    "change",
    event => {

        const files =
            Array.from(event.target.files);

        if (files.length > 0) {

            addFiles(files);

        }

        fileInput.value = "";

    }
);


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type}`;


    toast.textContent =
        message;


    toastContainer.appendChild(
        toast
    );


    setTimeout(
        () => {
            toast.remove();
        },
        3200
    );

}


/* =========================================================
   AUTH
   ========================================================= */

async function handleAuthCallback() {

    // Supabase verarbeitet den E-Mail-Callback im Browser automatisch.
    // Wir lesen danach nur die vorhandene Session aus.
    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (session?.user) {
        const url = new URL(window.location.href);
        const hasAuthParams =
            url.searchParams.has("code") ||
            url.hash.includes("access_token=") ||
            url.hash.includes("refresh_token=");

        if (hasAuthParams) {
            history.replaceState(
                {},
                document.title,
                AUTH_REDIRECT_URL
            );
        }

        return session.user;
    }

    return null;
}

async function ensureAuth() {

    const callbackUser =
        await handleAuthCallback();

    if (callbackUser) {
        return callbackUser;
    }

    const {
        data: {
            session
        }
    } =
        await supabase.auth.getSession();

    if (session?.user) {
        return session.user;
    }

    return null;
}


/* =========================================================
   AUTH UI
   ========================================================= */

function setAuthStatus(
    message,
    type = "info"
) {

    authStatus.textContent =
        message || "";

    authStatus.className =
        `auth-status ${type}`;

}


function showAuthModal() {

    authModal.classList.remove(
        "hidden"
    );

}


function hideAuthModal() {

    authModal.classList.add(
        "hidden"
    );

    setAuthStatus(
        "",
        "info"
    );

}


async function showAnonymousSetup() {

    authTitle.textContent =
        "Einmalig im Browser einrichten";

    authDescription.textContent =
        "Die Home-Bildschirm-App verwendet für die Anmeldung nur deinen Passkey. Die E-Mail-Einrichtung machst du einmalig in Safari.";

    passkeySignInButton.classList.add(
        "hidden"
    );

    passkeyRegisterButton.classList.add(
        "hidden"
    );

    openEmailSetupButton.classList.remove(
        "hidden"
    );

    openEmailSetupButton.textContent =
        "Einrichtung in Safari öffnen";

    authEmailArea.classList.add(
        "hidden"
    );

    authHelpText.textContent =
        "Öffne die 3D Library in Safari, verknüpfe dort einmalig deine E-Mail und registriere anschließend deinen Passkey. Danach kannst du die Home-Bildschirm-App ausschließlich mit Face ID/Passkey verwenden.";

    setAuthStatus(
        "Für die Home-Bildschirm-App ist keine E-Mail-Anmeldung vorgesehen.",
        "info"
    );

    showAuthModal();

}

async function showSignedOutAuth() {

    authTitle.textContent =
        "Mit Passkey anmelden";

    authDescription.textContent =
        "In der Home-Bildschirm-App meldest du dich mit Face ID, Touch ID oder deinem Passkey an.";

    passkeySignInButton.classList.remove(
        "hidden"
    );

    passkeyRegisterButton.classList.add(
        "hidden"
    );

    openEmailSetupButton.classList.add(
        "hidden"
    );

    authEmailArea.classList.add(
        "hidden"
    );

    setAuthStatus(
        "",
        "info"
    );

    showAuthModal();

}

async function showPasskeyRegistration(user) {

    authTitle.textContent =
        "Passkey einrichten";

    authDescription.textContent =
        "Dein Account ist verbunden. Registriere jetzt einen Passkey, damit du dich auf diesem und weiteren Geräten ohne E-Mail und Passwort anmelden kannst.";

    passkeySignInButton.classList.add(
        "hidden"
    );

    passkeyRegisterButton.classList.remove(
        "hidden"
    );

    openEmailSetupButton.classList.add(
        "hidden"
    );

    authEmailArea.classList.add(
        "hidden"
    );

    setAuthStatus(
        `Account ${user.email ? "bereit" : "bereit"}. Jetzt Passkey registrieren.`,
        "success"
    );

    showAuthModal();

}


async function handlePasskeySignIn() {

    if (
        !window.PublicKeyCredential
    ) {

        setAuthStatus(
            "Dieser Browser unterstützt keine Passkeys. Nutze die einmalige E-Mail-Einrichtung.",
            "error"
        );

        return;

    }


    passkeySignInButton.disabled =
        true;

    setAuthStatus(
        "Passkey wird geprüft...",
        "info"
    );


    try {

        const {
            data,
            error
        } =
            await supabase.auth.signInWithPasskey();


        if (error) {
            throw error;
        }


        if (!data?.user) {
            throw new Error(
                "Supabase hat keinen Benutzer zurückgegeben."
            );
        }


        currentUser =
            data.user;

        hideAuthModal();

        await loadCloudData();

        showToast(
            "Mit Passkey angemeldet."
        );

    } catch (error) {

        console.error(
            "Passkey Anmeldung:",
            error
        );

        setAuthStatus(
            passkeyErrorMessage(error),
            "error"
        );

    } finally {

        passkeySignInButton.disabled =
            false;

    }

}


async function handleSendAuthEmail() {

    const email =
        authEmailInput.value
            .trim()
            .toLowerCase();


    if (!email || !email.includes("@")) {

        setAuthStatus(
            "Bitte eine gültige E-Mail-Adresse eingeben.",
            "error"
        );

        return;

    }


    sendAuthEmailButton.disabled =
        true;

    let keepEmailButtonDisabled =
        false;

    setAuthStatus(
        "E-Mail-Link wird gesendet...",
        "info"
    );


    try {

        if (
            currentUser?.is_anonymous
        ) {

            const {
                error
            } =
                await supabase.auth.updateUser({
                    email
                });


            if (error) {
                throw error;
            }


            setAuthStatus(
                "Fast geschafft. Öffne die Bestätigungs-E-Mail. Danach die Home-Bildschirm-App erneut öffnen und den Passkey registrieren.",
                "success"
            );

            authEmailArea.classList.add(
                "hidden"
            );

            openEmailSetupButton.classList.add(
                "hidden"
            );

            return;

        }


        const redirectUrl =
            AUTH_REDIRECT_URL;


        const {
            error
        } =
            await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: redirectUrl
                }
            });


        if (error) {
            throw error;
        }


        setAuthStatus(
            "E-Mail-Link gesendet. Öffne ihn zum Bestätigen. Danach diese Home-Bildschirm-App erneut öffnen und mit deinem Passkey anmelden.",
            "success"
        );

    } catch (error) {

        console.error(
            "E-Mail Einrichtung:",
            error
        );

        const authMessage =
            authEmailErrorMessage(
                error
            );

        setAuthStatus(
            authMessage,
            "error"
        );

        if (
            authMessage.includes(
                "zu viele E-Mail-Anfragen"
            )
        ) {

            keepEmailButtonDisabled =
                true;

            setTimeout(
                () => {
                    sendAuthEmailButton.disabled =
                        false;
                },
                60000
            );

        }

    } finally {

        if (
            !keepEmailButtonDisabled
        ) {

            sendAuthEmailButton.disabled =
                false;

        }

    }

}


async function registerPasskeyForCurrentUser() {

    if (
        !currentUser ||
        currentUser.is_anonymous
    ) {

        setAuthStatus(
            "Der Account muss zuerst dauerhaft eingerichtet und bestätigt werden.",
            "error"
        );

        return;

    }


    if (
        !window.PublicKeyCredential
    ) {

        setAuthStatus(
            "Dieser Browser unterstützt keine Passkeys.",
            "error"
        );

        return;

    }


    passkeyRegisterButton.disabled =
        true;

    setAuthStatus(
        "Passkey wird eingerichtet...",
        "info"
    );


    try {

        const {
            data,
            error
        } =
            await supabase.auth.registerPasskey();


        if (error) {
            throw error;
        }


        hideAuthModal();

        showToast(
            "Passkey erfolgreich registriert."
        );

        await loadCloudData();

    } catch (error) {

        console.error(
            "Passkey Registrierung:",
            error
        );

        setAuthStatus(
            passkeyErrorMessage(error),
            "error"
        );

    } finally {

        passkeyRegisterButton.disabled =
            false;

    }

}


async function maybeShowPasskeySetup(user) {

    if (!user || user.is_anonymous) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabase.auth.passkey.list();


        if (error) {
            console.warn(
                "Passkey Liste:",
                error
            );
            return;
        }


        if (!data || data.length === 0) {
            await showPasskeyRegistration(user);
        }

    } catch (error) {

        console.warn(
            "Passkey Prüfung:",
            error
        );

    }

}


function passkeyErrorMessage(error) {

    const code =
        error?.code ||
        "";


    if (code === "passkey_disabled") {
        return "Passkeys sind in deinem Supabase-Projekt noch nicht aktiviert.";
    }


    if (code === "webauthn_credential_not_found") {
        return "Für dieses Gerät wurde kein passender Passkey gefunden.";
    }


    if (code === "NotAllowedError") {
        return "Die Passkey-Anmeldung wurde abgebrochen oder vom Browser blockiert.";
    }


    return error?.message ||
        "Die Passkey-Aktion ist fehlgeschlagen.";

}


function authEmailErrorMessage(error) {

    const message =
        error?.message ||
        "";

    const lowerMessage =
        message.toLowerCase();

    const errorCode =
        String(
            error?.code ||
            ""
        ).toLowerCase();


    if (
        lowerMessage.includes(
            "manual linking"
        )
    ) {

        return "Das Verknüpfen des anonymen Accounts ist in Supabase noch nicht aktiviert. Aktiviere dort Manual Linking und versuche es erneut.";

    }


    if (
        errorCode === "over_email_send_rate_limit" ||
        errorCode === "over_request_rate_limit" ||
        lowerMessage.includes(
            "rate limit"
        ) ||
        lowerMessage.includes(
            "too many requests"
        )
    ) {

        return "Supabase hat gerade zu viele E-Mail-Anfragen erkannt. Bitte jetzt nicht weiter auf E-Mail senden drücken. Warte etwas und nutze auf diesem iPhone möglichst den Passkey.";

    }


    return message ||
        "Der E-Mail-Link konnte nicht gesendet werden.";

}


passkeySignInButton.addEventListener(
    "click",
    handlePasskeySignIn
);


passkeyRegisterButton.addEventListener(
    "click",
    registerPasskeyForCurrentUser
);


openEmailSetupButton.addEventListener(
    "click",
    () => {

        // iOS does not reliably route a magic-link back into a
        // Home-Screen web app. The email setup therefore happens
        // deliberately in Safari.
        const browserUrl =
            "https://pietx1.github.io/3d-library/";

        const opened =
            window.open(browserUrl, "_blank");

        if (!opened) {
            window.location.href = browserUrl;
        }

    }
);


sendAuthEmailButton.addEventListener(
    "click",
    handleSendAuthEmail
);


authEmailInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            handleSendAuthEmail();
        }

    }
);


/* =========================================================
   CLOUD DATA LADEN
   ========================================================= */

async function loadCloudData() {

    currentUser =
        await ensureAuth();


    await Promise.all([
        loadTags(),
        loadModels(),
        loadQueue()
    ]);


    await attachModelRelations();


    setCloudStatus();

    renderEverything();

}


/* =========================================================
   STATUS
   ========================================================= */

function setCloudStatus() {

    const status =
        document.querySelector(
            ".sidebar-status"
        );


    if (
        !status
    ) {

        return;

    }


    status.innerHTML = `
        <span class="status-dot"></span>
        Cloud gespeichert
    `;

}


/* =========================================================
   TAGS LADEN
   ========================================================= */

async function loadTags() {

    const {
        data,
        error
    } =
        await supabase
            .from("tags")
            .select(
                "id, name, created_at"
            )
            .order(
                "name",
                {
                    ascending: true
                }
            );


    if (
        error
    ) {

        throwDbError(
            error,
            "Tags konnten nicht geladen werden."
        );

    }


    tags.length =
        0;


    data.forEach(
        tag => {

            tags.push({

                id:
                    tag.id,

                name:
                    tag.name,

                createdAt:
                    tag.created_at

            });

        }
    );

}


/* =========================================================
   MODELLE LADEN
   ========================================================= */

async function loadModels() {

    const {
        data,
        error
    } =
        await supabase
            .from("models")
            .select(`
                id,
                name,
                original_filename,
                file_path,
                preview_path,
                file_hash,
                variable_size,
                created_at,
                updated_at
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (
        error
    ) {

        throwDbError(
            error,
            "Modelle konnten nicht geladen werden."
        );

    }


    models.length =
        0;


    data.forEach(
        row => {

            models.push({

                id:
                    row.id,

                file:
                    null,

                fileHash:
                    row.file_hash,

                originalName:
                    row.original_filename,

                name:
                    row.name,

                filePath:
                    row.file_path,

                previewPath:
                    row.preview_path,

                previewURL:
                    null,

                previewObjectURL:
                    null,

                previewExpiresAt:
                    0,

                tags:
                    [],

                tagIds:
                    [],

                variableSize:
                    Boolean(
                        row.variable_size
                    ),

                sizes:
                    [],

                metadata:
                    {
                        modelFiles: [],
                        objectCount: 0
                    },

                createdAt:
                    row.created_at,

                updatedAt:
                    row.updated_at

            });

        }
    );


    await loadPreviewUrls();

}


/* =========================================================
   PREVIEW URLS
   ========================================================= */

async function loadPreviewUrls() {

    const previewModels =
        models.filter(
            model =>
                Boolean(
                    model.previewPath
                )
        );


    if (
        previewModels.length === 0
    ) {

        return;

    }


    const paths =
        previewModels.map(
            model =>
                model.previewPath
        );


    const expiresAt =
        Date.now() +
        (
            SIGNED_URL_SECONDS -
            60
        ) *
        1000;


    let signedData = null;
    let signedError = null;


    try {

        const result =
            await supabase
                .storage
                .from(
                    PREVIEW_BUCKET
                )
                .createSignedUrls(
                    paths,
                    SIGNED_URL_SECONDS
                );

        signedData =
            result.data || null;

        signedError =
            result.error || null;

    } catch (error) {

        signedError =
            error;

    }


    if (
        signedError
    ) {

        console.warn(
            "Preview-Signed-URLs fehlgeschlagen, versuche direkten Download:",
            signedError
        );

    }


    const urlMap =
        new Map();


    if (
        Array.isArray(
            signedData
        )
    ) {

        signedData.forEach(
            (
                item,
                index
            ) => {

                const path =
                    item?.path ||
                    paths[index];

                if (
                    path &&
                    item?.signedUrl
                ) {

                    urlMap.set(
                        path,
                        item.signedUrl
                    );

                }

            }
        );

    }


    for (
        const model of previewModels
    ) {

        const path =
            model.previewPath;


        if (
            urlMap.has(path)
        ) {

            model.previewURL =
                urlMap.get(path);

            model.previewExpiresAt =
                expiresAt;

            continue;

        }


        /*
         * Fallback für iPhone/Safari:
         * Wenn Supabase keine Signed URL liefert, wird das Bild
         * direkt als Blob geladen und als lokale Object-URL angezeigt.
         */
        try {

            const {
                data: blob,
                error
            } =
                await supabase
                    .storage
                    .from(
                        PREVIEW_BUCKET
                    )
                    .download(
                        path
                    );


            if (
                error
            ) {

                throw error;

            }


            if (
                !blob
            ) {

                throw new Error(
                    "Supabase hat keine Preview-Datei zurückgegeben."
                );

            }


            if (
                model.previewObjectURL &&
                model.previewObjectURL.startsWith(
                    "blob:"
                )
            ) {

                URL.revokeObjectURL(
                    model.previewObjectURL
                );

            }


            model.previewObjectURL =
                URL.createObjectURL(
                    blob
                );

            model.previewURL =
                model.previewObjectURL;

            model.previewExpiresAt =
                0;

        } catch (error) {

            console.warn(
                "Preview konnte nicht geladen werden:",
                path,
                error
            );

            model.previewURL =
                null;

            model.previewExpiresAt =
                0;

        }

    }

}


/* =========================================================
   QUEUE LADEN
   ========================================================= */

async function loadQueue() {

    const {
        data,
        error
    } =
        await supabase
            .from("print_queue")
            .select(`
                id,
                model_id,
                quantity,
                size,
                notes,
                position,
                created_at
            `)
            .order(
                "position",
                {
                    ascending: true
                }
            );


    if (
        error
    ) {

        throwDbError(
            error,
            "Druckwarteschlange konnte nicht geladen werden."
        );

    }


    printQueue.length =
        0;


    data.forEach(
        row => {

            printQueue.push({

                id:
                    row.id,

                modelId:
                    row.model_id,

                model:
                    null,

                quantity:
                    row.quantity,

                size:
                    row.size,

                notes:
                    row.notes || "",

                position:
                    row.position,

                createdAt:
                    row.created_at

            });

        }
    );

}


/* =========================================================
   BEZIEHUNGEN
   ========================================================= */

async function attachModelRelations() {

    if (
        models.length > 0
    ) {

        const {
            data: modelTagsData,
            error: modelTagsError
        } =
            await supabase
                .from("model_tags")
                .select(
                    "model_id, tag_id"
                );


        if (
            modelTagsError
        ) {

            throwDbError(
                modelTagsError,
                "Modell-Tags konnten nicht geladen werden."
            );

        }


        models.forEach(
            model => {

                model.tagIds =
                    modelTagsData
                        .filter(
                            relation =>
                                relation.model_id ===
                                model.id
                        )
                        .map(
                            relation =>
                                relation.tag_id
                        );


                model.tags =
                    model.tagIds
                        .map(
                            tagId => {

                                const tag =
                                    findTagById(
                                        tagId
                                    );

                                return tag
                                    ? tag.name
                                    : null;

                            }
                        )
                        .filter(
                            Boolean
                        );

            }
        );


        const modelIds =
            models.map(
                model =>
                    model.id
            );


        const {
            data: sizesData,
            error: sizesError
        } =
            await supabase
                .from("model_sizes")
                .select(
                    "id, model_id, value, created_at"
                )
                .in(
                    "model_id",
                    modelIds
                )
                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );


        if (
            sizesError
        ) {

            throwDbError(
                sizesError,
                "Modell-Größen konnten nicht geladen werden."
            );

        }


        models.forEach(
            model => {

                model.sizes =
                    sizesData
                        .filter(
                            size =>
                                size.model_id ===
                                model.id
                        )
                        .map(
                            size =>
                                ({
                                    id:
                                        size.id,

                                    value:
                                        size.value

                                })
                        );

            }
        );

    }


    printQueue.forEach(
        entry => {

            entry.model =
                findModelById(
                    entry.modelId
                );

        }
    );

}


/* =========================================================
   STORAGE PATHS
   ========================================================= */

function modelStoragePath(
    modelId
) {

    return `${currentUser.id}/${modelId}.3mf`;

}


function previewStoragePath(
    modelId,
    extension
) {

    return `${currentUser.id}/${modelId}.${extension}`;

}


/* =========================================================
   FILES HINZUFÜGEN
   ========================================================= */

async function addFiles(
    files
) {

    if (!files?.length) {
        return;
    }

    let added = 0;
    const importedHashes = new Set();
    const importedNames = new Map();

    for (const file of files) {

        const extension =
            getFileExtension(file.name);

        if (extension === ".zip") {
            added += await importZipFile(file);
            continue;
        }

        if (!isSupportedModelFile(file.name)) {
            showToast(
                `"${file.name}" wird nicht unterstützt. Bitte 3MF, STL oder ZIP verwenden.`,
                "error"
            );
            continue;
        }

        try {

            const hash =
                await createHash(
                    await file.arrayBuffer()
                );

            const existing =
                models.find(
                    model => model.fileHash === hash
                );

            const sameBatch =
                importedHashes.has(hash);

            if (existing || sameBatch) {

                const detail = existing
                    ? `Bereits vorhanden: ${existing.name}`
                    : `Doppelt in diesem Import: ${importedNames.get(hash) || "gleicher Dateiinhalt"}`;

                const proceed =
                    window.confirm(
                        `"${file.name}" ist doppelt.\n\n${detail}\n\nTrotzdem hinzufügen?`
                    );

                if (!proceed) {
                    continue;
                }

            }

            showToast(
                `"${file.name}" wird hochgeladen...`,
                "info"
            );

            const success =
                await uploadNewModel(
                    file,
                    { skipDuplicateCheck: true }
                );

            if (success) {
                added++;
                importedHashes.add(hash);
                if (!importedNames.has(hash)) {
                    importedNames.set(
                        hash,
                        file.name
                    );
                }
            }

        } catch (error) {

            console.error(
                "Datei-Import:",
                error
            );

            showToast(
                `"${file.name}" konnte nicht importiert werden.`,
                "error"
            );

        }

    }

    if (added > 0) {
        await loadModels();
        await attachModelRelations();
        renderEverything();
        showToast(
            `${added} Datei${added === 1 ? "" : "en"} hinzugefügt.`
        );
    }

}


/* =========================================================
   NEUES MODELL HOCHLADEN
   ========================================================= */

async function uploadNewModel(
    file,
    options = {}
) {

    try {

        if (!currentUser) {
            currentUser = await ensureAuth();
        }

        const extension =
            getFileExtension(
                file.name
            );

        if (!isSupportedModelFile(file.name)) {
            throw new Error(
                "Nur 3MF- und STL-Dateien werden unterstützt."
            );
        }

        const buffer =
            await file.arrayBuffer();

        const hash =
            await createHash(
                buffer
            );

        if (!options.skipDuplicateCheck) {

            const duplicate =
                models.find(
                    model => model.fileHash === hash
                );

            if (duplicate) {

                const proceed =
                    window.confirm(
                        `"${file.name}" ist bereits vorhanden.\n\nModell: ${duplicate.name}\n\nTrotzdem hinzufügen?`
                    );

                if (!proceed) {
                    return false;
                }

            }

        }

        let previewFile = null;

        if (extension === ".3mf") {

            if (typeof JSZip === "undefined") {
                throw new Error(
                    "3MF-Unterstützung ist nicht geladen. Bitte die Seite einmal vollständig neu laden."
                );
            }

            const zip =
                await JSZip.loadAsync(
                    buffer
                );

            previewFile =
                findPreview(
                    zip
                );

        }

        const modelId =
            createId();

        const modelPath =
            modelStoragePath(
                modelId,
                extension
            );

        let previewPath = null;

        const modelUpload =
            await supabase
                .storage
                .from(MODEL_BUCKET)
                .upload(
                    modelPath,
                    file,
                    {
                        upsert: false,
                        contentType:
                            getImportMimeType(
                                extension
                            ),
                        cacheControl:
                            "3600"
                    }
                );

        if (modelUpload.error) {
            throw modelUpload.error;
        }

        if (previewFile) {

            const previewExtension =
                getImageExtension(
                    previewFile.name
                );

            const blob =
                await previewFile.async(
                    "blob"
                );

            previewPath =
                previewStoragePath(
                    modelId,
                    previewExtension
                );

            const previewUpload =
                await supabase
                    .storage
                    .from(PREVIEW_BUCKET)
                    .upload(
                        previewPath,
                        blob,
                        {
                            upsert: false,
                            contentType:
                                getImageMime(
                                    previewExtension
                                ),
                            cacheControl:
                                "86400"
                        }
                    );

            if (previewUpload.error) {
                await cleanupStorageFiles(
                    modelPath,
                    null
                );
                throw previewUpload.error;
            }

        }

        const { error: insertError } =
            await supabase
                .from("models")
                .insert({
                    id: modelId,
                    user_id: currentUser.id,
                    name: getBaseName(file.name),
                    original_filename: file.name,
                    file_path: modelPath,
                    preview_path: previewPath,
                    file_hash: hash,
                    variable_size: false
                });

        if (insertError) {
            await cleanupStorageFiles(
                modelPath,
                previewPath
            );
            throw insertError;
        }

        return true;

    } catch (error) {

        console.error(
            "Modell-Upload:",
            error
        );

        showToast(
            `"${file.name}" konnte nicht gespeichert werden.`,
            "error"
        );

        return false;

    }

}


/* =========================================================
   STORAGE AUFRÄUMEN
   ========================================================= */

async function cleanupStorageFiles(
    modelPath,
    previewPath
) {

    if (
        modelPath
    ) {

        await supabase
            .storage
            .from(
                MODEL_BUCKET
            )
            .remove([
                modelPath
            ]);

    }


    if (
        previewPath
    ) {

        await supabase
            .storage
            .from(
                PREVIEW_BUCKET
            )
            .remove([
                previewPath
            ]);

    }

}


/* =========================================================
   MODELL ERSETZEN
   ========================================================= */

async function replaceModelFile(
    model,
    file
) {

    try {

        const extension =
            getFileExtension(
                file.name
            );

        if (!isSupportedModelFile(file.name)) {
            throw new Error(
                "Nur 3MF- und STL-Dateien werden unterstützt."
            );
        }

        const buffer =
            await file.arrayBuffer();

        const hash =
            await createHash(
                buffer
            );

        const duplicate =
            models.find(
                item =>
                    item.fileHash === hash &&
                    item.id !== model.id
            );

        if (duplicate) {

            const proceed =
                window.confirm(
                    `"${file.name}" entspricht bereits dem Modell "${duplicate.name}". Trotzdem ersetzen?`
                );

            if (!proceed) {
                return false;
            }

        }

        let previewFile = null;

        if (extension === ".3mf") {
            const zip =
                await JSZip.loadAsync(
                    buffer
                );
            previewFile =
                findPreview(
                    zip
                );
        }

        const oldModelPath = model.filePath;
        const oldPreviewPath = model.previewPath;
        const suffix = Date.now();

        const nextModelPath =
            `${currentUser.id}/${model.id}-${suffix}${extension}`;

        let nextPreviewPath = null;

        const modelUpload =
            await supabase
                .storage
                .from(MODEL_BUCKET)
                .upload(
                    nextModelPath,
                    file,
                    {
                        upsert: false,
                        contentType:
                            getImportMimeType(
                                extension
                            ),
                        cacheControl:
                            "3600"
                    }
                );

        if (modelUpload.error) {
            throw modelUpload.error;
        }

        try {

            if (previewFile) {

                const previewExtension =
                    getImageExtension(
                        previewFile.name
                    );

                const blob =
                    await previewFile.async(
                        "blob"
                    );

                nextPreviewPath =
                    `${currentUser.id}/${model.id}-${suffix}.${previewExtension}`;

                const previewUpload =
                    await supabase
                        .storage
                        .from(PREVIEW_BUCKET)
                        .upload(
                            nextPreviewPath,
                            blob,
                            {
                                upsert: false,
                                contentType:
                                    getImageMime(
                                        previewExtension
                                    ),
                                cacheControl:
                                    "86400"
                            }
                        );

                if (previewUpload.error) {
                    throw previewUpload.error;
                }

            }

            const { error } =
                await supabase
                    .from("models")
                    .update({
                        original_filename: file.name,
                        file_path: nextModelPath,
                        preview_path: nextPreviewPath,
                        file_hash: hash,
                        updated_at: new Date().toISOString()
                    })
                    .eq(
                        "id",
                        model.id
                    );

            if (error) {
                throw error;
            }

        } catch (error) {

            await cleanupStorageFiles(
                nextModelPath,
                nextPreviewPath
            );

            throw error;

        }

        if (
            oldModelPath &&
            oldModelPath !== nextModelPath
        ) {

            await supabase
                .storage
                .from(MODEL_BUCKET)
                .remove([
                    oldModelPath
                ]);

        }

        if (
            oldPreviewPath &&
            oldPreviewPath !== nextPreviewPath
        ) {

            await supabase
                .storage
                .from(PREVIEW_BUCKET)
                .remove([
                    oldPreviewPath
                ]);

        }

        model.file = file;
        model.fileHash = hash;
        model.originalName = file.name;
        model.filePath = nextModelPath;
        model.previewPath = nextPreviewPath;

        if (
            model.previewObjectURL &&
            model.previewObjectURL.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                model.previewObjectURL
            );
        }

        model.previewObjectURL = null;
        model.previewURL = null;
        model.previewExpiresAt = 0;

        await loadPreviewUrls();

        return true;

    } catch (error) {

        console.error(
            "Datei ersetzen:",
            error
        );

        showToast(
            `Die Datei konnte nicht ersetzt werden: ${error?.message || "Unbekannter Fehler"}`,
            "error"
        );

        return false;

    }

}


/* =========================================================
   MODELLE RENDER
   ========================================================= */

function renderEverything() {

    renderModels();

    renderQueue();

}


/* =========================================================
   MODELLE FILTERN
   ========================================================= */

function getVisibleModels() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const sorted =
        [...models];


    switch (
        sortSelect.value
    ) {

        case "oldest":

            sorted.sort(
                (a, b) =>
                    new Date(
                        a.createdAt
                    ) -
                    new Date(
                        b.createdAt
                    )
            );

            break;


        case "az":

            sorted.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name,
                        "de"
                    )
            );

            break;


        case "za":

            sorted.sort(
                (a, b) =>
                    b.name.localeCompare(
                        a.name,
                        "de"
                    )
            );

            break;


        case "lastOpened":

            sorted.sort(
                (a, b) =>
                    getLastOpenedTime(b.id) -
                    getLastOpenedTime(a.id)
            );

            break;


        default:

            sorted.sort(
                (a, b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            );

    }


    return sorted.filter(
        model => {

            const searchMatch =
                model.name
                    .toLowerCase()
                    .includes(
                        search
                    ) ||

                model.originalName
                    .toLowerCase()
                    .includes(
                        search
                    );


            const tagMatch =
                activeTag === "all"
                    ? true
                    : activeTag === "none"
                        ? model.tagIds.length === 0
                        : model.tagIds.includes(
                            activeTag
                        );


            return (
                searchMatch &&
                tagMatch
            );

        }
    );

}


/* =========================================================
   MODELLE DARSTELLEN
   ========================================================= */

function renderModels() {

    const visible =
        getVisibleModels();


    modelGrid.innerHTML =
        "";


    modelCount.textContent =
        `${visible.length} Modell${
            visible.length === 1
                ? ""
                : "e"
        }`;


    emptyState.style.display =
        visible.length === 0
            ? "block"
            : "none";


    visible.forEach(
        model => {

            modelGrid.appendChild(
                createModelCard(
                    model
                )
            );

        }
    );


    renderTagFilters();

}


/* =========================================================
   MODEL CARD
   ========================================================= */

function createModelCard(
    model
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "model-card";

    card.dataset.modelId =
        String(model.id);


    const modelExtension =
        getFileExtension(
            model.originalName ||
            model.filePath ||
            ".3mf"
        );

    const is3mf =
        modelExtension === ".3mf";


    const preview =
        model.previewURL

            ? `
                <img
                    src="${model.previewURL}"
                    alt="${escapeHTML(
                        model.name
                    )}"
                >
            `

            : `
                <div class="preview-placeholder">
                    <strong>${is3mf ? "3MF" : "STL"}</strong>
                    <br>
                    Keine Vorschau
                </div>
            `;


    const tagText =
        model.tags.length === 0

            ? "Tags auswählen..."

            : model.tags.length === 1

                ? model.tags[0]

                : `${model.tags.length} Tags ausgewählt`;


    let tagOptions =
        "";


    if (
        tags.length === 0
    ) {

        tagOptions = `
            <div class="no-tags-inline">
                Noch keine Tags erstellt.
            </div>
        `;

    } else {

        tagOptions =
            tags
                .map(
                    tag => {

                        const checked =
                            model.tagIds.includes(
                                tag.id
                            )
                                ? "checked"
                                : "";


                        return `

                            <label class="tag-option">

                                <input
                                    type="checkbox"
                                    value="${escapeAttribute(
                                        tag.id
                                    )}"
                                    ${checked}
                                >

                                <span>
                                    ${escapeHTML(
                                        tag.name
                                    )}
                                </span>

                            </label>

                        `;

                    }
                )
                .join("");

    }


    card.innerHTML = `

        <div
            class="model-selection-control"
            title="Modell für Mehrfachauswahl markieren"
        >

            <input
                class="model-selection-input"
                type="checkbox"
                aria-label="${escapeAttribute(
                    model.name
                )} auswählen"
                ${selectedModelIds.has(model.id) ? "checked" : ""}
            >

        </div>


        <div
            class="model-preview"
            ${is3mf ? 'data-action="plates"' : ''}
        >

            ${preview}

            ${is3mf ? `
                <div class="model-open-hint">
                    Alle Druckplatten öffnen
                </div>
            ` : ""}

        </div>


        <div class="model-content">


            <div class="model-title-row">

                <div
                    class="model-title"
                    title="${escapeAttribute(
                        model.name
                    )}"
                >
                    ${escapeHTML(
                        model.name
                    )}
                </div>


                <label
                    class="variable-size-toggle"
                    title="Größe beim Drucken auswählbar"
                >

                    <input
                        class="variable-size-input"
                        type="checkbox"
                        ${
                            model.variableSize
                                ? "checked"
                                : ""
                        }
                    >

                    <span>
                        Größe
                    </span>

                </label>

            </div>


            <div
                class="model-filename"
                title="${escapeAttribute(
                    model.originalName
                )}"
            >
                ${escapeHTML(
                    model.originalName
                )}
            </div>


            ${getModelChangeInfoHTML(model)}


            <details class="tag-picker">


                <summary>

                    <span class="selected-tag-text">
                        ${escapeHTML(
                            tagText
                        )}
                    </span>

                </summary>


                <div class="tag-picker-menu">

                    ${tagOptions}

                </div>


            </details>


            <div class="model-actions">

                <button
                    class="card-button"
                    type="button"
                    data-action="edit"
                >
                    Bearbeiten
                </button>


                ${is3mf ? `
                    <button
                        class="card-button bambu-button"
                        type="button"
                        data-action="bambu"
                    >
                        Bambu Studio öffnen
                    </button>
                ` : ""}


                <button
                    class="card-button"
                    type="button"
                    data-action="queue"
                >
                    + Drucken
                </button>


                <button
                    class="card-button delete-button"
                    type="button"
                    data-action="delete"
                    title="Modell löschen"
                >
                    ×
                </button>

            </div>


        </div>

    `;


    /*
     * Mehrfachauswahl
     */

    const selectionInput =
        card.querySelector(
            ".model-selection-input"
        );

    if (selectionInput) {

        selectionInput.addEventListener(
            "click",
            event =>
                event.stopPropagation()
        );


        selectionInput.addEventListener(
            "change",
            () => {

                if (selectionInput.checked) {
                    selectedModelIds.add(model.id);
                } else {
                    selectedModelIds.delete(model.id);
                }

                updateMultiSelectUI();

            }
        );

    }


    /*
     * Druckplatten
     */

    const platesButton =
        card.querySelector(
            '[data-action="plates"]'
        );

    if (platesButton) {
        platesButton.addEventListener(
            "click",
            () =>
                openPlatePreviewModal(
                    model
                )
        );
    }


    /*
     * Edit
     */

    card
        .querySelector(
            '[data-action="edit"]'
        )
        .addEventListener(
            "click",
            () =>
                openEditModal(
                    model
                )
        );


    /*
     * Bambu Studio
     */

    const bambuButton =
        card.querySelector(
            '[data-action="bambu"]'
        );

    if (bambuButton) {
        bambuButton.addEventListener(
            "click",
            () =>
                openInBambuStudio(
                    model
                )
        );
    }


    /*
     * Queue
     */

    card
        .querySelector(
            '[data-action="queue"]'
        )
        .addEventListener(
            "click",
            () =>
                openQueueModal(
                    model
                )
        );


    /*
     * Delete
     */

    card
        .querySelector(
            '[data-action="delete"]'
        )
        .addEventListener(
            "click",
            () =>
                deleteModel(
                    model
                )
        );


    /*
     * Variable Size
     */

    const sizeInput =
        card.querySelector(
            ".variable-size-input"
        );


    sizeInput.addEventListener(
        "click",
        event =>
            event.stopPropagation()
    );


    sizeInput.addEventListener(
        "change",
        async () => {

            const previous =
                model.variableSize;

            const nextValue =
                sizeInput.checked;

            if (
                previous &&
                !nextValue
            ) {

                const confirmed =
                    window.confirm(
                        "Größenauswahl wirklich deaktivieren? Die gespeicherten Größen bleiben erhalten, sind beim Drucken aber nicht mehr auswählbar."
                    );

                if (!confirmed) {
                    sizeInput.checked = true;
                    return;
                }

            }

            model.variableSize =
                nextValue;


            try {

                await updateModel(
                    model.id,
                    {
                        variable_size:
                            model.variableSize
                    }
                );


                showToast(
                    model.variableSize
                        ? "Größenauswahl aktiviert."
                        : "Größenauswahl deaktiviert."
                );

            } catch {

                model.variableSize =
                    previous;

                sizeInput.checked =
                    previous;

            }

        }
    );


    /*
     * Tag Checkboxes
     */

    card
        .querySelectorAll(
            ".tag-option input"
        )
        .forEach(
            checkbox => {

                checkbox.addEventListener(
                    "click",
                    event =>
                        event.stopPropagation()
                );


                checkbox.addEventListener(
                    "change",
                    async () => {

                        const nextTagIds =
                            Array
                                .from(
                                    card.querySelectorAll(
                                        ".tag-option input:checked"
                                    )
                                )
                                .map(
                                    input =>
                                        input.value
                                );


                        const previousIds =
                            [
                                ...model.tagIds
                            ];


                        model.tagIds =
                            nextTagIds;


                        model.tags =
                            nextTagIds
                                .map(
                                    id => {

                                        const tag =
                                            findTagById(
                                                id
                                            );

                                        return tag
                                            ? tag.name
                                            : null;

                                    }
                                )
                                .filter(
                                    Boolean
                                );


                        updateCardTagText(
                            card,
                            model
                        );


                        try {

                            await saveModelTags(
                                model
                            );


                        } catch {

                            model.tagIds =
                                previousIds;


                            model.tags =
                                previousIds
                                    .map(
                                        id => {

                                            const tag =
                                                findTagById(
                                                    id
                                                );

                                            return tag
                                                ? tag.name
                                                : null;

                                        }
                                    )
                                    .filter(
                                        Boolean
                                    );


                            updateCardTagText(
                                card,
                                model
                            );

                        }

                    }
                );

            }
        );


    return card;

}


/* =========================================================
   CARD TAG TEXT
   ========================================================= */

function updateCardTagText(
    card,
    model
) {

    const target =
        card.querySelector(
            ".selected-tag-text"
        );


    if (
        !target
    ) {

        return;

    }


    target.textContent =
        model.tags.length === 0

            ? "Tags auswählen..."

            : model.tags.length === 1

                ? model.tags[0]

                : `${model.tags.length} Tags ausgewählt`;

}


/* =========================================================
   MODEL TAGS SPEICHERN
   ========================================================= */

async function saveModelTags(
    model
) {

    const {
        error: deleteError
    } =
        await supabase
            .from("model_tags")
            .delete()
            .eq(
                "model_id",
                model.id
            );


    if (
        deleteError
    ) {

        throw deleteError;

    }


    if (
        model.tagIds.length === 0
    ) {

        return;

    }


    const rows =
        model.tagIds.map(
            tagId => ({

                model_id:
                    model.id,

                tag_id:
                    tagId

            })
        );


    const {
        error: insertError
    } =
        await supabase
            .from("model_tags")
            .insert(
                rows
            );


    if (
        insertError
    ) {

        throw insertError;

    }

}


/* =========================================================
   TAG FILTER
   ========================================================= */

function renderTagFilters() {

    tagFilterList.innerHTML =
        "";


    const allButton =
        document.createElement(
            "button"
        );


    allButton.type =
        "button";


    allButton.className =
        "filter-tag " +
        (
            activeTag === "all"
                ? "active"
                : ""
        );


    allButton.textContent =
        "Alle";


    allButton.addEventListener(
        "click",
        () => {

            activeTag =
                "all";


            renderModels();

        }
    );


    tagFilterList.appendChild(
        allButton
    );


    const noneButton =
        document.createElement(
            "button"
        );


    noneButton.type =
        "button";


    noneButton.className =
        "filter-tag " +
        (
            activeTag === "none"
                ? "active"
                : ""
        );


    noneButton.textContent =
        "Keine";


    noneButton.title =
        "Nur Modelle ohne Tag anzeigen";


    noneButton.addEventListener(
        "click",
        () => {

            activeTag =
                "none";


            renderModels();

        }
    );


    tagFilterList.appendChild(
        noneButton
    );


    populateBulkActionSelect();


    tags.forEach(
        tag => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "filter-tag " +
                (
                    activeTag === tag.id
                        ? "active"
                        : ""
                );


            button.textContent =
                tag.name;


            button.addEventListener(
                "click",
                () => {

                    activeTag =
                        tag.id;


                    renderModels();

                }
            );


            tagFilterList.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   TAG ERSTELLEN
   ========================================================= */

addTagButton.addEventListener(
    "click",
    () => {

        tagInput.value =
            "";


        tagModal.classList.remove(
            "hidden"
        );


        setTimeout(
            () =>
                tagInput.focus(),
            30
        );

    }
);


saveTag.addEventListener(
    "click",
    createTag
);


tagInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            createTag();

        }

    }
);


async function createTag() {

    const value =
        tagInput.value.trim();


    if (!value) {
        return;
    }


    if (!currentUser) {

        try {
            currentUser = await ensureAuth();
        } catch (error) {

            console.error("Tag Auth:", error);

            showToast(
                "Supabase ist noch nicht verbunden.",
                "error"
            );

            return;
        }

    }


    const duplicate =
        tags.some(
            tag =>
                tag.name.toLowerCase() ===
                value.toLowerCase()
        );


    if (
        duplicate
    ) {

        showToast(
            "Dieser Tag existiert bereits.",
            "error"
        );

        return;

    }


    const {
        data,
        error
    } =
        await supabase
            .from("tags")
            .insert({

                user_id:
                    currentUser.id,

                name:
                    value

            })
            .select(
                "id, name, created_at"
            )
            .single();


    if (
        error
    ) {

        showToast(
            "Der Tag konnte nicht erstellt werden.",
            "error"
        );

        console.error(
            error
        );

        return;

    }


    tags.push({

        id:
            data.id,

        name:
            data.name,

        createdAt:
            data.created_at

    });


    tagModal.classList.add(
        "hidden"
    );


    renderEverything();


    showToast(
        `Tag "${value}" erstellt.`
    );

}


/* =========================================================
   TAGS VERWALTEN
   ========================================================= */

manageTagsButton.addEventListener(
    "click",
    () => {

        renderManagedTags();

        manageTagsModal.classList.remove(
            "hidden"
        );

    }
);


function renderManagedTags() {

    managedTagList.innerHTML =
        "";


    noTagsMessage.style.display =
        tags.length === 0
            ? "block"
            : "none";


    tags.forEach(
        (
            tag,
            index
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "managed-tag-row";


            row.innerHTML = `

                <span class="managed-tag-name">
                    ${escapeHTML(
                        tag.name
                    )}
                </span>


                <button
                    type="button"
                    data-action="rename"
                >
                    Umbenennen
                </button>


                <button
                    type="button"
                    class="delete-tag"
                    data-action="delete"
                >
                    Löschen
                </button>

            `;


            row
                .querySelector(
                    '[data-action="rename"]'
                )
                .addEventListener(
                    "click",
                    () =>
                        renameTag(
                            index
                        )
                );


            row
                .querySelector(
                    '[data-action="delete"]'
                )
                .addEventListener(
                    "click",
                    () =>
                        deleteTag(
                            index
                        )
                );


            managedTagList.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   TAG UMBENENNEN
   ========================================================= */

async function renameTag(
    index
) {

    const tag =
        tags[index];


    if (
        !tag
    ) {

        return;

    }


    const result =
        window.prompt(
            "Neuer Tag-Name:",
            tag.name
        );


    if (
        result === null
    ) {

        return;

    }


    const newName =
        result.trim();


    if (
        !newName
    ) {

        return;

    }


    if (
        tags.some(
            (
                item,
                itemIndex
            ) =>
                itemIndex !== index &&
                item.name.toLowerCase() ===
                newName.toLowerCase()
        )
    ) {

        showToast(
            "Dieser Tag existiert bereits.",
            "error"
        );

        return;

    }


    const {
        error
    } =
        await supabase
            .from("tags")
            .update({
                name:
                    newName
            })
            .eq(
                "id",
                tag.id
            );


    if (
        error
    ) {

        showToast(
            "Der Tag konnte nicht umbenannt werden.",
            "error"
        );

        return;

    }


    tag.name =
        newName;


    models.forEach(
        model => {

            model.tags =
                model.tagIds
                    .map(
                        id => {

                            const current =
                                findTagById(
                                    id
                                );

                            return current
                                ? current.name
                                : null;

                        }
                    )
                    .filter(
                        Boolean
                    );

        }
    );


    renderManagedTags();

    renderEverything();


    showToast(
        "Tag umbenannt."
    );

}


/* =========================================================
   TAG LÖSCHEN
   ========================================================= */

async function deleteTag(
    index
) {

    const tag =
        tags[index];


    if (
        !tag
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `"${tag.name}" wirklich löschen?\n\nDer Tag wird von allen Modellen entfernt.`
        );


    if (
        !confirmed
    ) {

        return;

    }


    const {
        error
    } =
        await supabase
            .from("tags")
            .delete()
            .eq(
                "id",
                tag.id
            );


    if (
        error
    ) {

        showToast(
            "Der Tag konnte nicht gelöscht werden.",
            "error"
        );

        return;

    }


    tags.splice(
        index,
        1
    );


    models.forEach(
        model => {

            model.tagIds =
                model.tagIds.filter(
                    id =>
                        id !== tag.id
                );


            model.tags =
                model.tagIds
                    .map(
                        id => {

                            const current =
                                findTagById(
                                    id
                                );

                            return current
                                ? current.name
                                : null;

                        }
                    )
                    .filter(
                        Boolean
                    );

        }
    );


    if (
        activeTag === tag.id
    ) {

        activeTag =
            "all";

    }


    renderManagedTags();

    renderEverything();


    showToast(
        "Tag gelöscht."
    );

}


/* =========================================================
   TAG DROPDOWN SCHLIESSEN
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        document
            .querySelectorAll(
                ".tag-picker[open]"
            )
            .forEach(
                picker => {

                    if (
                        !picker.contains(
                            event.target
                        )
                    ) {

                        picker.removeAttribute(
                            "open"
                        );

                    }

                }
            );

    }
);


/* =========================================================
   MODELL BEARBEITEN
   ========================================================= */

function openEditModal(
    model
) {

    modelForEdit =
        model;


    editNameInput.value =
        model.name;


    replaceFileInput.value =
        "";


    renderEditTags();


    editModelModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            editNameInput.focus();

            editNameInput.select();

        },
        30
    );

}


function renderEditTags() {

    editTagGrid.innerHTML =
        "";


    if (
        tags.length === 0
    ) {

        editTagGrid.innerHTML = `
            <span class="edit-no-tags">
                Noch keine Tags erstellt.
            </span>
        `;

        return;

    }


    tags.forEach(
        tag => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "edit-tag-option";


            if (
                modelForEdit?.tagIds.includes(
                    tag.id
                )
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                tag.name;


            button.addEventListener(
                "click",
                () => {

                    if (
                        modelForEdit.tagIds.includes(
                            tag.id
                        )
                    ) {

                        modelForEdit.tagIds =
                            modelForEdit.tagIds.filter(
                                id =>
                                    id !== tag.id
                            );

                    } else {

                        modelForEdit.tagIds.push(
                            tag.id
                        );

                    }


                    modelForEdit.tags =
                        modelForEdit.tagIds
                            .map(
                                id => {

                                    const current =
                                        findTagById(
                                            id
                                        );

                                    return current
                                        ? current.name
                                        : null;

                                }
                            )
                            .filter(
                                Boolean
                            );


                    renderEditTags();

                }
            );


            editTagGrid.appendChild(
                button
            );

        }
    );

}


saveEditModel.addEventListener(
    "click",
    saveEditedModel
);


async function saveEditedModel() {

    if (
        !modelForEdit
    ) {

        return;

    }


    const name =
        editNameInput.value.trim();


    if (
        !name
    ) {

        showToast(
            "Bitte einen Namen eingeben.",
            "error"
        );

        return;

    }


    const replacement =
        replaceFileInput.files[0];


    try {

        if (
            replacement
        ) {

            const success =
                await replaceModelFile(
                    modelForEdit,
                    replacement
                );


            if (
                !success
            ) {

                return;

            }

        }


        const {
            error
        } =
            await updateModel(
                modelForEdit.id,
                {
                    name,
                    updated_at:
                        new Date().toISOString()
                }
            );


        if (
            error
        ) {

            throw error;

        }


        modelForEdit.name =
            name;


        modelForEdit.updatedAt =
            new Date().toISOString();


        await saveModelTags(
            modelForEdit
        );


        modelForEdit =
            null;


        editModelModal.classList.add(
            "hidden"
        );


        renderEverything();


        showToast(
            "Modell gespeichert."
        );


    } catch (
        error
    ) {

        console.error(
            "Modell speichern:",
            error
        );


        showToast(
            "Das Modell konnte nicht gespeichert werden.",
            "error"
        );

    }

}


/* =========================================================
   MODEL UPDATE
   ========================================================= */

async function updateModel(
    modelId,
    changes
) {

    const result =
        await supabase
            .from("models")
            .update(
                changes
            )
            .eq(
                "id",
                modelId
            )
            .select()
            .single();


    if (
        result.error
    ) {

        showToast(
            "Änderung konnte nicht gespeichert werden.",
            "error"
        );

    }


    return result;

}


/* =========================================================
   MODELL LÖSCHEN
   ========================================================= */

async function deleteModel(
    model
) {

    const confirmed =
        window.confirm(
            `"${model.name}" wirklich löschen?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await supabase
                .from("models")
                .delete()
                .eq(
                    "id",
                    model.id
                );


        if (
            error
        ) {

            throw error;

        }


        await cleanupStorageFiles(
            model.filePath,
            model.previewPath
        );


        for (
            let i =
                printQueue.length - 1;
            i >= 0;
            i--
        ) {

            if (
                printQueue[i].modelId ===
                model.id
            ) {

                printQueue.splice(
                    i,
                    1
                );

            }

        }


        const modelIndex =
            models.indexOf(
                model
            );


        if (
            modelIndex !== -1
        ) {

            models.splice(
                modelIndex,
                1
            );

        }


        renderEverything();


        showToast(
            "Modell gelöscht."
        );


    } catch (
        error
    ) {

        console.error(
            "Modell löschen:",
            error
        );


        showToast(
            "Das Modell konnte nicht gelöscht werden.",
            "error"
        );

    }

}


/* =========================================================
   QUEUE MODAL
   ========================================================= */

function openQueueModal(
    model,
    existingEntry = null
) {

    queueModel =
        model;


    queueEntryForEdit =
        existingEntry;


    queueModalTitle.textContent =
        existingEntry
            ? "Druck bearbeiten"
            : "Druck hinzufügen";


    queueEntryModelName.textContent =
        model.name;


    quantityInput.value =
        existingEntry
            ? existingEntry.quantity
            : 1;


    queueNotesInput.value =
        existingEntry?.notes || "";

    updateQueueNotesCounter();


    unitIsCentimeters =
        existingEntry?.size
            ? /cm$/i.test(
                existingEntry.size
            )
            : true;


    updateUnitButton();


    customSizeInput.value =
        existingEntry?.size
            ? removeCm(
                existingEntry.size
            )
            : "";


    if (
        model.variableSize
    ) {

        queueSizeArea.classList.remove(
            "hidden"
        );


        renderSizePresets(
            model,
            existingEntry?.size || ""
        );

    } else {

        queueSizeArea.classList.add(
            "hidden"
        );


        queueSizePresets.innerHTML =
            "";

    }


    queueEntryModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            quantityInput.focus();

            quantityInput.select();

        },
        30
    );

}


/* =========================================================
   SIZE PRESETS
   ========================================================= */

function renderSizePresets(
    model,
    selectedSize = ""
) {

    queueSizePresets.innerHTML =
        "";


    model.sizes.forEach(
        size => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "queue-size-button";


            button.textContent =
                size.value;


            if (
                size.value === selectedSize
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                () =>
                    selectSize(
                        size.value
                    )
            );


            queueSizePresets.appendChild(
                button
            );

        }
    );

}


function selectSize(
    size
) {

    unitIsCentimeters =
        /cm$/i.test(
            size
        );


    updateUnitButton();


    customSizeInput.value =
        removeCm(
            size
        );


    queueSizePresets
        .querySelectorAll(
            ".queue-size-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.textContent ===
                        size
                );

            }
        );

}


/* =========================================================
   UNIT
   ========================================================= */

unitToggleButton.addEventListener(
    "click",
    () => {

        unitIsCentimeters =
            !unitIsCentimeters;


        updateUnitButton();


        queueSizePresets
            .querySelectorAll(
                ".queue-size-button"
            )
            .forEach(
                button =>
                    button.classList.remove(
                        "active"
                    )
            );

    }
);


function updateUnitButton() {

    unitToggleButton.classList.toggle(
        "active",
        unitIsCentimeters
    );


    unitToggleButton.textContent =
        "cm";

}


/* =========================================================
   SIZE PRESET SPEICHERN
   ========================================================= */

savePresetSizeButton.addEventListener(
    "click",
    saveSizePreset
);


async function saveSizePreset() {

    if (
        !queueModel
    ) {

        return;

    }


    const value =
        buildSizeValue();


    if (
        !value
    ) {

        showToast(
            "Bitte eine Größe eingeben.",
            "error"
        );

        return;

    }


    const duplicate =
        queueModel.sizes.some(
            size =>
                size.value.toLowerCase() ===
                value.toLowerCase()
        );


    if (
        duplicate
    ) {

        selectSize(
            value
        );

        return;

    }


    const {
        data,
        error
    } =
        await supabase
            .from("model_sizes")
            .insert({

                model_id:
                    queueModel.id,

                value

            })
            .select(
                "id, value"
            )
            .single();


    if (
        error
    ) {

        showToast(
            "Die Größe konnte nicht gespeichert werden.",
            "error"
        );

        return;

    }


    queueModel.sizes.push({

        id:
            data.id,

        value:
            data.value

    });


    renderSizePresets(
        queueModel,
        value
    );


    selectSize(
        value
    );


    showToast(
        `Größe "${value}" gespeichert.`
    );

}


/* =========================================================
   BUILD SIZE
   ========================================================= */

function buildSizeValue() {

    const raw =
        removeCm(
            customSizeInput.value
        );


    if (
        !raw
    ) {

        return "";

    }


    return unitIsCentimeters
        ? `${raw} cm`
        : raw;

}


function removeCm(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .replace(
            /\s*cm\s*$/i,
            ""
        )
        .trim();

}


/* =========================================================
   QUEUE ENTRY SPEICHERN
   ========================================================= */

saveQueueEntryButton.addEventListener(
    "click",
    saveQueueEntry
);


quantityInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            saveQueueEntry();

        }

    }
);


customSizeInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            saveQueueEntry();

        }

    }
);


queueNotesInput.addEventListener(
    "input",
    updateQueueNotesCounter
);

queueNotesInput.addEventListener(
    "keydown",
    event => {
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "Enter"
        ) {
            event.preventDefault();
            saveQueueEntry();
        }
    }
);

function updateQueueNotesCounter() {
    if (!queueNotesCounter) {
        return;
    }

    queueNotesCounter.textContent =
        `${queueNotesInput.value.length} / 1000`;
}


async function saveQueueEntry() {

    if (
        !queueModel
    ) {

        return;

    }


    let quantity =
        parseInt(
            quantityInput.value,
            10
        );


    if (
        Number.isNaN(
            quantity
        )
    ) {

        quantity =
            1;

    }


    quantity =
        Math.max(
            1,
            Math.min(
                quantity,
                999
            )
        );


    let size =
        null;

    const notes =
        queueNotesInput.value
            .trim()
            .slice(0, 1000);

    if (
        queueModel.variableSize
    ) {

        size =
            buildSizeValue();


        if (
            !size
        ) {

            showToast(
                "Bitte eine Größe auswählen oder eingeben.",
                "error"
            );

            return;

        }

    }


    try {

        if (
            queueEntryForEdit
        ) {

            const {
                error
            } =
                await supabase
                    .from("print_queue")
                    .update({
                        quantity,
                        size,
                        notes
                    })
                    .eq(
                        "id",
                        queueEntryForEdit.id
                    );


            if (
                error
            ) {

                throw error;

            }


            queueEntryForEdit.quantity =
                quantity;

            queueEntryForEdit.size =
                size;

            queueEntryForEdit.notes =
                notes;


            showToast(
                "Druckeintrag aktualisiert."
            );


        } else {

            /*
             * Gleicher Datensatz + gleiche Größe wird
             * zusammengeführt, statt doppelt angelegt.
             */

            const existing =
                printQueue.find(
                    entry =>
                        entry.modelId === queueModel.id &&
                        (entry.size || null) === (size || null) &&
                        (entry.notes || "") === notes
                );


            if (existing) {

                const newQuantity =
                    Math.min(
                        999,
                        existing.quantity + quantity
                    );


                const {
                    error
                } =
                    await supabase
                        .from("print_queue")
                        .update({
                            quantity:
                                newQuantity
                        })
                        .eq(
                            "id",
                            existing.id
                        );


                if (error) {
                    throw error;
                }


                existing.quantity =
                    newQuantity;


                showToast(
                    "Vorhandenen Druckeintrag aktualisiert."
                );


            } else {

                const nextPosition =
                    printQueue.length;


                const {
                    data,
                    error
                } =
                    await supabase
                        .from("print_queue")
                        .insert({

                            user_id:
                                currentUser.id,

                            model_id:
                                queueModel.id,

                            quantity,

                            size,

                            notes,

                            position:
                                nextPosition

                        })
                        .select(
                            "id, model_id, quantity, size, notes, position, created_at"
                        )
                        .single();


                if (error) {
                    throw error;
                }


                printQueue.push({

                    id:
                        data.id,

                    modelId:
                        data.model_id,

                    model:
                        queueModel,

                    quantity:
                        data.quantity,

                    size:
                        data.size,

                    notes:
                        data.notes || "",

                    position:
                        data.position,

                    createdAt:
                        data.created_at

                });


                showToast(
                    "Zur Druckwarteschlange hinzugefügt."
                );

            }

        }


        closeQueueModal();

        renderQueue();


    } catch (
        error
    ) {

        console.error(
            "Queue speichern:",
            error
        );


        showToast(
            "Der Druck konnte nicht gespeichert werden.",
            "error"
        );

    }

}


/* =========================================================
   QUEUE
   ========================================================= */

function renderQueue() {

    queueBadge.textContent =
        printQueue.length;


    queuePageList.innerHTML =
        "";


    if (
        printQueue.length === 0
    ) {

        queueHeader.style.display =
            "none";


        queueEmpty.style.display =
            "block";


        return;

    }


    queueHeader.style.display =
        "flex";


    queueEmpty.style.display =
        "none";


    const total =
        printQueue.reduce(
            (
                sum,
                entry
            ) =>
                sum +
                entry.quantity,
            0
        );


    queueSummary.textContent =
        `${printQueue.length} Druckeinträge · ${total} Teile insgesamt`;


    printQueue.forEach(
        (
            entry,
            index
        ) => {

            entry.position =
                index;


            queuePageList.appendChild(
                createQueueRow(
                    entry,
                    index
                )
            );

        }
    );

}


/* =========================================================
   QUEUE ROW
   ========================================================= */

function createQueueRow(
    entry,
    index
) {

    const row =
        document.createElement(
            "div"
        );


    row.className =
        "queue-page-item";


    row.draggable =
        true;


    row.dataset.queueId =
        String(
            entry.id
        );


    row.innerHTML = `

        <div class="queue-number">
            ${index + 1}
        </div>


        <div
            class="queue-drag-handle"
            title="Ziehen zum Verschieben"
        >
            ⠿
        </div>


        <div class="queue-page-preview">

            ${
                entry.model?.previewURL

                    ? `
                        <img
                            src="${entry.model.previewURL}"
                            alt=""
                        >
                    `

                    : ""
            }

        </div>


        <div class="queue-page-info">

            <strong>
                ${escapeHTML(
                    entry.model?.name ||
                    "Unbekanntes Modell"
                )}
            </strong>


            <span>

                ${
                    entry.size
                        ? `Größe: ${escapeHTML(
                            entry.size
                        )} · `
                        : ""
                }

                ${escapeHTML(
                    entry.model?.originalName ||
                    ""
                )}

            </span>

            ${
                entry.notes &&
                entry.notes.trim()
                    ? `
                        <div class="queue-notes-preview">
                            <span class="queue-notes-label">Hinweis:</span>
                            <span class="queue-notes-text">${escapeHTML(
                                entry.notes.trim()
                            )}</span>
                        </div>
                    `
                    : ""
            }

        </div>


        <div class="queue-quantity">
            ×${entry.quantity}
        </div>


        <button
            class="queue-edit"
            type="button"
            title="Druck bearbeiten"
        >
            ✎
        </button>


        <button
            class="remove-queue"
            type="button"
            title="Entfernen"
        >
            ×
        </button>

    `;


    const editButton =
        row.querySelector(
            ".queue-edit"
        );


    editButton.addEventListener(
        "pointerdown",
        event =>
            event.stopPropagation()
    );


    editButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (
                entry.model
            ) {

                openQueueModal(
                    entry.model,
                    entry
                );

            }

        }
    );


    const removeButton =
        row.querySelector(
            ".remove-queue"
        );


    removeButton.addEventListener(
        "pointerdown",
        event =>
            event.stopPropagation()
    );


    removeButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const confirmed =
                window.confirm(
                    `"${entry.model?.name || "Druckeintrag"}" wirklich aus der Druckwarteschlange löschen?`
                );

            if (confirmed) {
                removeQueueEntry(
                    entry
                );
            }

        }
    );


    /*
     * Desktop Drag & Drop
     */

    row.addEventListener(
        "dragstart",
        event => {

            row.classList.add(
                "dragging"
            );


            event.dataTransfer.effectAllowed =
                "move";


            event.dataTransfer.setData(
                "text/plain",
                String(
                    entry.id
                )
            );

        }
    );


    row.addEventListener(
        "dragend",
        () => {

            row.classList.remove(
                "dragging"
            );


            document
                .querySelectorAll(
                    ".queue-page-item.drag-over"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "drag-over"
                        )
                );

        }
    );


    row.addEventListener(
        "dragover",
        event => {

            event.preventDefault();


            if (
                row.classList.contains(
                    "dragging"
                )
            ) {

                return;

            }


            row.classList.add(
                "drag-over"
            );

            document
                .querySelectorAll(
                    ".queue-page-item.drag-target"
                )
                .forEach(
                    item =>
                        item.classList.remove(
                            "drag-target"
                        )
                );

            row.classList.add(
                "drag-target"
            );

            event.dataTransfer.dropEffect =
                "move";

        }
    );


    row.addEventListener(
        "dragleave",
        event => {

            if (
                !row.contains(
                    event.relatedTarget
                )
            ) {

                row.classList.remove(
                    "drag-over"
                );

            }

        }
    );


    row.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            event.stopPropagation();


            row.classList.remove(
                "drag-over"
            );

            row.classList.remove(
                "drag-target"
            );


            const draggedId =
                event.dataTransfer.getData(
                    "text/plain"
                );


            if (
                !draggedId
            ) {

                return;

            }


            reorderQueue(
                draggedId,
                entry.id
            );

        }
    );


    return row;

}


/* =========================================================
   QUEUE REORDER
   ========================================================= */

async function reorderQueue(
    draggedId,
    targetId
) {

    const from =
        printQueue.findIndex(
            item =>
                String(
                    item.id
                ) ===
                String(
                    draggedId
                )
        );


    const target =
        printQueue.findIndex(
            item =>
                String(
                    item.id
                ) ===
                String(
                    targetId
                )
        );


    if (
        from === -1 ||
        target === -1 ||
        from === target
    ) {

        return;

    }


    const [
        moved
    ] =
        printQueue.splice(
            from,
            1
        );


    let destination =
        target;


    if (
        from < target
    ) {

        destination =
            target;

    }


    printQueue.splice(
        destination,
        0,
        moved
    );


    printQueue.forEach(
        (
            entry,
            index
        ) => {

            entry.position =
                index;

        }
    );


    renderQueue();


    try {

        await persistQueuePositions();


    } catch (
        error
    ) {

        console.error(
            "Queue reorder:",
            error
        );


        await loadQueue();

        await attachModelRelations();

        renderQueue();


        showToast(
            "Die neue Reihenfolge konnte nicht gespeichert werden.",
            "error"
        );

    }

}


/* =========================================================
   QUEUE POSITIONEN SPEICHERN
   ========================================================= */

async function persistQueuePositions() {

    for (
        const entry of printQueue
    ) {

        const {
            error
        } =
            await supabase
                .from("print_queue")
                .update({
                    position:
                        entry.position
                })
                .eq(
                    "id",
                    entry.id
                );


        if (
            error
        ) {

            throw error;

        }

    }

}


/* =========================================================
   QUEUE EINTRAG LÖSCHEN
   ========================================================= */

async function removeQueueEntry(
    entry
) {

    try {

        const {
            error
        } =
            await supabase
                .from("print_queue")
                .delete()
                .eq(
                    "id",
                    entry.id
                );


        if (
            error
        ) {

            throw error;

        }


        const index =
            printQueue.indexOf(
                entry
            );


        if (
            index !== -1
        ) {

            printQueue.splice(
                index,
                1
            );

        }


        await normalizeQueuePositions();


        renderQueue();


        showToast(
            "Druckeintrag entfernt."
        );


    } catch (
        error
    ) {

        console.error(
            "Queue löschen:",
            error
        );


        showToast(
            "Der Druckeintrag konnte nicht entfernt werden.",
            "error"
        );

    }

}


/* =========================================================
   QUEUE LEEREN
   ========================================================= */

clearQueueButton.addEventListener(
    "click",
    clearQueue
);


async function clearQueue() {

    if (
        printQueue.length === 0
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            "Die komplette Druckwarteschlange leeren?"
        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await supabase
                .from("print_queue")
                .delete()
                .eq(
                    "user_id",
                    currentUser.id
                );


        if (
            error
        ) {

            throw error;

        }


        printQueue.length =
            0;


        renderQueue();


        showToast(
            "Druckwarteschlange geleert."
        );


    } catch (
        error
    ) {

        console.error(
            "Queue leeren:",
            error
        );


        showToast(
            "Die Druckwarteschlange konnte nicht geleert werden.",
            "error"
        );

    }

}


/* =========================================================
   QUEUE POSITION NORMALISIEREN
   ========================================================= */

async function normalizeQueuePositions() {

    printQueue.forEach(
        (
            entry,
            index
        ) => {

            entry.position =
                index;

        }
    );


    await persistQueuePositions();

}



/* =========================================================
   COMPANION PAIRING
   ========================================================= */

function openCompanionModal() {

    companionModal.classList.remove(
        "hidden"
    );

    companionCodeArea.classList.add(
        "hidden"
    );

    companionCode.textContent =
        "–";

    companionExpires.textContent =
        "";

}


function closeCompanionModal() {

    companionModal.classList.add(
        "hidden"
    );

}


async function createPairingCode() {

    if (!currentUser) {

        showToast(
            "Bitte zuerst anmelden.",
            "error"
        );

        return;

    }

    createCompanionPairing.disabled =
        true;

    createCompanionPairing.textContent =
        "Code wird erzeugt...";

    companionCodeArea.classList.add(
        "hidden"
    );

    try {

        const {
            data,
            error
        } =
            await supabase.rpc(
                "create_companion_pairing",
                {
                    p_expires_minutes:
                        10
                }
            );

        if (error) {
            throw error;
        }

        const pairing =
            data?.[0];

        if (!pairing?.code) {
            throw new Error(
                "Supabase hat keinen Pairing-Code zurückgegeben."
            );
        }

        companionCode.textContent =
            pairing.code;

        companionExpires.textContent =
            `Gültig bis ${new Date(
                pairing.expires_at
            ).toLocaleTimeString(
                "de-DE",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )}`;

        companionCodeArea.classList.remove(
            "hidden"
        );

    } catch (error) {

        console.error(
            "Companion Pairing:",
            error
        );

        showToast(
            "Der Pairing-Code konnte nicht erzeugt werden.",
            "error"
        );

    } finally {

        createCompanionPairing.disabled =
            false;

        createCompanionPairing.textContent =
            "Pairing-Code neu erzeugen";

    }

}


async function copyCompanionPairingCode() {

    const code =
        companionCode.textContent.trim();

    if (!code || code === "–") {
        return;
    }

    try {

        await navigator.clipboard.writeText(
            code
        );

        showToast(
            "Pairing-Code kopiert."
        );

    } catch {

        showToast(
            "Der Pairing-Code konnte nicht kopiert werden.",
            "error"
        );

    }

}


companionButton.addEventListener(
    "click",
    openCompanionModal
);


createCompanionPairing.addEventListener(
    "click",
    createPairingCode
);


copyCompanionCode.addEventListener(
    "click",
    copyCompanionPairingCode
);


closeCompanion.addEventListener(
    "click",
    closeCompanionModal
);


/* =========================================================
   BAMBU STUDIO
   ========================================================= */

function openInBambuStudio(
    model
) {

    rememberModelOpened(model.id);
    renderModels();

    const protocolUrl =
        `library3d://open?model=${encodeURIComponent(
            model.id
        )}`;

    /*
     * Das registrierte Windows-Protokoll direkt aus der bestehenden
     * PWA heraus starten. Kein _blank, damit kein zusätzliches
     * sichtbares Browserfenster bzw. Tab erzeugt wird.
     */
    const link =
        document.createElement(
            "a"
        );

    link.href =
        protocolUrl;

    link.style.display =
        "none";

    document.body.appendChild(
        link
    );

    link.click();

    setTimeout(
        () => link.remove(),
        750
    );

}


/* =========================================================
   ALLE DRUCKPLATTEN
   ========================================================= */

async function openPlatePreviewModal(
    model
) {

    platePreviewModal.classList.remove(
        "hidden"
    );

    platePreviewTitle.textContent =
        model.name;

    platePreviewLoading.classList.remove(
        "hidden"
    );

    platePreviewError.classList.add(
        "hidden"
    );

    platePreviewGrid.innerHTML =
        "";

    try {

        let buffer;

        if (model.file) {

            buffer =
                await model.file.arrayBuffer();

        } else {

            const {
                data,
                error
            } =
                await supabase
                    .storage
                    .from(
                        MODEL_BUCKET
                    )
                    .download(
                        model.filePath
                    );

            if (error) {
                throw error;
            }

            buffer =
                await data.arrayBuffer();
        }

        const zip =
            await JSZip.loadAsync(
                buffer
            );

        const plateFiles =
            findPlatePreviewFiles(
                zip
            );

        if (
            plateFiles.length === 0
        ) {
            throw new Error(
                "Keine Druckplatten-Vorschauen in dieser 3MF-Datei gefunden."
            );
        }

        const previews =
            await Promise.all(
                plateFiles.map(
                    async plate => {

                        const blob =
                            await plate.file.async(
                                "blob"
                            );

                        return {
                            number:
                                plate.number,
                            url:
                                URL.createObjectURL(
                                    blob
                                )
                        };

                    }
                )
            );

        platePreviewGrid.innerHTML =
            previews
                .map(
                    plate => `
                        <article class="plate-preview-card">
                            <div class="plate-preview-card-image">
                                <img
                                    src="${escapeAttribute(
                                        plate.url
                                    )}"
                                    alt="Druckplatte ${plate.number}"
                                >
                            </div>

                            <div class="plate-preview-card-label">
                                Druckplatte ${plate.number}
                            </div>
                        </article>
                    `
                )
                .join("");

        platePreviewLoading.classList.add(
            "hidden"
        );

    } catch (error) {

        console.error(
            "Druckplatten-Vorschau:",
            error
        );

        platePreviewLoading.classList.add(
            "hidden"
        );

        platePreviewError.textContent =
            "Die Druckplatten-Vorschauen konnten aus dieser 3MF-Datei nicht geladen werden.";

        platePreviewError.classList.remove(
            "hidden"
        );

    }

}


function findPlatePreviewFiles(
    zip
) {

    const candidates =
        Object.values(
            zip.files
        )
            .filter(
                file =>
                    !file.dir
            )
            .map(
                file => {

                    const match =
                        file.name.match(
                            /(?:^|\/)plate_(\d+)(?:_small)?\.(png|jpe?g|webp)$/i
                        );

                    if (!match) {
                        return null;
                    }

                    return {
                        file,
                        number:
                            Number(
                                match[1]
                            ),
                        isSmall:
                            /_small\./i.test(
                                file.name
                            )
                    };

                }
            )
            .filter(
                Boolean
            );

    const byPlate =
        new Map();

    candidates
        .sort(
            (a, b) =>
                a.number -
                b.number ||
                Number(a.isSmall) -
                Number(b.isSmall)
        )
        .forEach(
            item => {

                const existing =
                    byPlate.get(
                        item.number
                    );

                if (
                    !existing ||
                    (
                        existing.isSmall &&
                        !item.isSmall
                    )
                ) {

                    byPlate.set(
                        item.number,
                        item
                    );

                }

            }
        );

    return Array.from(
        byPlate.values()
    )
        .sort(
            (a, b) =>
                a.number -
                b.number
        );

}


function closePlatePreviewWindow() {

    platePreviewGrid
        .querySelectorAll(
            "img"
        )
        .forEach(
            image => {

                if (
                    image.src.startsWith(
                        "blob:"
                    )
                ) {

                    URL.revokeObjectURL(
                        image.src
                    );

                }

            }
        );

    platePreviewGrid.innerHTML =
        "";

    platePreviewModal.classList.add(
        "hidden"
    );

}


closePlatePreview.addEventListener(
    "click",
    closePlatePreviewWindow
);


/* =========================================================
   NAVIGATION
   ========================================================= */


libraryNav.addEventListener(
    "click",
    showLibrary
);


mobileLibraryNav.addEventListener(
    "click",
    showLibrary
);


queueNav.addEventListener(
    "click",
    showQueue
);


mobileQueueNav.addEventListener(
    "click",
    showQueue
);


function showLibrary() {

    libraryPage.classList.remove(
        "hidden"
    );


    queuePage.classList.add(
        "hidden"
    );


    libraryNav.classList.add(
        "active"
    );


    queueNav.classList.remove(
        "active"
    );


    mobileLibraryNav.classList.add(
        "active"
    );


    mobileQueueNav.classList.remove(
        "active"
    );

}


function showQueue() {

    libraryPage.classList.add(
        "hidden"
    );


    queuePage.classList.remove(
        "hidden"
    );


    libraryNav.classList.remove(
        "active"
    );


    queueNav.classList.add(
        "active"
    );


    mobileLibraryNav.classList.remove(
        "active"
    );


    mobileQueueNav.classList.add(
        "active"
    );


    renderQueue();

}


/* =========================================================
   MODALS
   ========================================================= */

closeTagModal.addEventListener(
    "click",
    () =>
        tagModal.classList.add(
            "hidden"
        )
);


cancelTag.addEventListener(
    "click",
    () =>
        tagModal.classList.add(
            "hidden"
        )
);


closeManageTags.addEventListener(
    "click",
    () =>
        manageTagsModal.classList.add(
            "hidden"
        )
);


closeEditModel.addEventListener(
    "click",
    () =>
        editModelModal.classList.add(
            "hidden"
        )
);


cancelEditModel.addEventListener(
    "click",
    () =>
        editModelModal.classList.add(
            "hidden"
        )
);


/* =========================================================
   QUEUE MODAL CLOSE
   ========================================================= */

closeQueueEntry.addEventListener(
    "click",
    closeQueueModal
);


cancelQueueEntry.addEventListener(
    "click",
    closeQueueModal
);


function closeQueueModal() {

    queueEntryModal.classList.add(
        "hidden"
    );


    queueModel =
        null;


    queueEntryForEdit =
        null;

}


/* =========================================================
   BACKDROPS
   ========================================================= */

document
    .querySelectorAll(
        ".modal-backdrop"
    )
    .forEach(
        backdrop => {

            backdrop.addEventListener(
                "click",
                () => {

                    const type =
                        backdrop.dataset.close;


                    switch (
                        type
                    ) {

                        case "platePreview":

                            closePlatePreviewWindow();

                            break;


                        case "tag":

                            tagModal.classList.add(
                                "hidden"
                            );

                            break;


                        case "manageTags":

                            manageTagsModal.classList.add(
                                "hidden"
                            );

                            break;


                        case "editModel":

                            editModelModal.classList.add(
                                "hidden"
                            );

                            break;


                        case "queueEntry":

                            closeQueueModal();

                            break;

                    }

                }
            );

        }
    );


/* =========================================================
   ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closePlatePreviewWindow();


        tagModal.classList.add(
            "hidden"
        );


        manageTagsModal.classList.add(
            "hidden"
        );


        editModelModal.classList.add(
            "hidden"
        );


        closeQueueModal();

    }
);


/* =========================================================
   SEARCH
   ========================================================= */

searchInput.addEventListener(
    "input",
    renderModels
);


sortSelect.addEventListener(
    "change",
    renderModels
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "/" &&
            document.activeElement.tagName !==
                "INPUT"
        ) {

            event.preventDefault();

            searchInput.focus();

        }

    }
);


/* =========================================================
   HELPERS
   ========================================================= */

function findModelById(
    id
) {

    return models.find(
        model =>
            String(
                model.id
            ) ===
            String(
                id
            )
    ) || null;

}


function findTagById(
    id
) {

    return tags.find(
        tag =>
            String(
                tag.id
            ) ===
            String(
                id
            )
    ) || null;

}


function createId() {

    if (
        crypto?.randomUUID
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now() +
        "-" +
        Math.random()
            .toString(
                16
            )
            .slice(
                2
            )
    );

}


async function createHash(
    buffer
) {

    if (
        crypto?.subtle
    ) {

        const digest =
            await crypto.subtle.digest(
                "SHA-256",
                buffer
            );


        return Array
            .from(
                new Uint8Array(
                    digest
                )
            )
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        )
            )
            .join("");

    }


    return `${buffer.byteLength}-${Date.now()}`;

}


function findPreview(
    zip
) {

    const files =
        Object.values(
            zip.files
        );


    const imageFiles =
        files.filter(
            file => {

                if (
                    file.dir
                ) {

                    return false;

                }


                const name =
                    file.name.toLowerCase();


                return (
                    name.endsWith(
                        ".png"
                    ) ||
                    name.endsWith(
                        ".jpg"
                    ) ||
                    name.endsWith(
                        ".jpeg"
                    ) ||
                    name.endsWith(
                        ".webp"
                    )
                );

            }
        );


    if (
        imageFiles.length === 0
    ) {

        return null;

    }


    const thumbnail =
        imageFiles.find(
            file => {

                const name =
                    file.name.toLowerCase();


                return (
                    name.includes(
                        "thumbnail"
                    ) ||
                    name.includes(
                        "thumb"
                    )
                );

            }
        );


    if (
        thumbnail
    ) {

        return thumbnail;

    }


    const plate =
        imageFiles.find(
            file => {

                const name =
                    file.name.toLowerCase();


                return (
                    name.includes(
                        "plate_"
                    ) ||
                    name.includes(
                        "plate-"
                    )

                );

            }
        );


    if (
        plate
    ) {

        return plate;

    }


    const metadataImage =
        imageFiles.find(
            file =>
                file.name
                    .toLowerCase()
                    .includes(
                        "metadata/"
                    )
        );


    if (
        metadataImage
    ) {

        return metadataImage;

    }


    return imageFiles[0];

}


function getImageExtension(
    filename
) {

    const extension =
        String(
            filename
        )
            .split(
                "."
            )
            .pop()
            .toLowerCase();


    return [
        "png",
        "jpg",
        "jpeg",
        "webp"
    ].includes(
        extension
    )
        ? extension
        : "png";

}


function getImageMime(
    extension
) {

    switch (
        extension
    ) {

        case "jpg":
        case "jpeg":
            return "image/jpeg";

        case "webp":
            return "image/webp";

        default:
            return "image/png";

    }

}


async function readMetadata(
    zip
) {

    const result = {

        modelFiles: [],

        objectCount: 0

    };


    const files =
        Object.values(
            zip.files
        );


    const modelFiles =
        files.filter(
            file =>
                !file.dir &&
                file.name
                    .toLowerCase()
                    .endsWith(
                        ".model"
                    )
        );


    result.modelFiles =
        modelFiles.map(
            file =>
                file.name
        );


    for (
        const file of modelFiles
    ) {

        try {

            const text =
                await file.async(
                    "text"
                );


            const matches =
                text.match(
                    /<object\b/gi
                );


            if (
                matches
            ) {

                result.objectCount +=
                    matches.length;

            }

        } catch {

            /* Metadaten sind optional. */

        }

    }


    return result;

}


function hasVisibleGeometry(
    object
) {

    let found =
        false;


    object.traverse(
        child => {

            if (
                child.isMesh &&
                child.geometry &&
                child.geometry.attributes.position &&
                child.geometry.attributes.position.count > 0
            ) {

                found =
                    true;

            }

        }
    );


    return found;

}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(
            value
        );


    return div.innerHTML;

}


function escapeAttribute(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


function throwDbError(
    error,
    fallbackMessage
) {

    console.error(
        fallbackMessage,
        error
    );


    throw new Error(
        `${fallbackMessage} ${error.message || ""}`
    );

}


/* =========================================================
   ONLINE / OFFLINE STATUS
   ========================================================= */

function setOfflineStatus() {

    const status =
        document.querySelector(
            ".sidebar-status"
        );

    if (!status) {
        return;
    }

    status.classList.remove(
        "status-loading"
    );

    status.innerHTML = `
        <span class="status-dot offline"></span>
        Offline – Änderungen werden nicht synchronisiert
    `;

}


function setLoadingStatus() {

    const status =
        document.querySelector(
            ".sidebar-status"
        );

    if (!status) {
        return;
    }

    status.classList.add(
        "status-loading"
    );

    status.innerHTML = `
        <span class="status-dot loading"></span>
        Cloud wird geladen...
    `;

}


window.addEventListener(
    "offline",
    () => {
        setOfflineStatus();
        showToast(
            "Keine Internetverbindung. Cloud-Funktionen sind vorübergehend nicht verfügbar.",
            "error"
        );
    }
);


window.addEventListener(
    "online",
    () => {

        setCloudStatus();

        showToast(
            "Internetverbindung wiederhergestellt."
        );

    }
);


/* =========================================================
   AUTH SESSION EVENTS
   ========================================================= */

supabase.auth.onAuthStateChange(
    (event, session) => {

        if (!session?.user) {
            currentUser = null;
            return;
        }

        currentUser =
            session.user;
    }
);


/* =========================================================
   V4.2 – THEME / LAST OPENED / MULTISELECT / BACKUP
   ========================================================= */

function readLastOpenedMap() {

    try {

        const raw =
            localStorage.getItem(
                LAST_OPENED_STORAGE_KEY
            );

        const parsed =
            raw
                ? JSON.parse(raw)
                : {};

        return parsed && typeof parsed === "object"
            ? parsed
            : {};

    } catch {

        return {};

    }

}


function getLastOpenedTime(modelId) {

    const map =
        readLastOpenedMap();

    const value =
        Number(
            new Date(
                map[String(modelId)] || 0
            ).getTime()
        );

    return Number.isFinite(value)
        ? value
        : 0;

}


function rememberModelOpened(modelId) {

    try {

        const map =
            readLastOpenedMap();

        map[String(modelId)] =
            new Date().toISOString();

        /* Nur die letzten 250 Einträge behalten. */
        const trimmed =
            Object.entries(map)
                .sort(
                    (a, b) =>
                        new Date(b[1]).getTime() -
                        new Date(a[1]).getTime()
                )
                .slice(0, 250);

        localStorage.setItem(
            LAST_OPENED_STORAGE_KEY,
            JSON.stringify(
                Object.fromEntries(trimmed)
            )
        );

    } catch (error) {

        console.warn(
            "Zuletzt geöffnet konnte nicht gespeichert werden:",
            error
        );

    }

}


function formatRelativeTime(timestamp) {

    const time =
        new Date(timestamp).getTime();

    if (!Number.isFinite(time)) {
        return "";
    }

    const diff =
        Math.max(
            0,
            Date.now() - time
        );

    const minutes =
        Math.round(diff / 60000);

    if (minutes < 1) return "gerade eben";
    if (minutes < 60) return `vor ${minutes} Min.`;

    const hours =
        Math.round(minutes / 60);

    if (hours < 24) return `vor ${hours} Std.`;

    const days =
        Math.round(hours / 24);

    if (days < 7) return `vor ${days} Tag${days === 1 ? "" : "en"}`;

    return new Date(timestamp).toLocaleDateString(
        "de-DE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


function getModelChangeInfoHTML(model) {

    const created =
        new Date(model.createdAt).getTime();

    const updated =
        new Date(model.updatedAt).getTime();

    if (
        !Number.isFinite(created) ||
        !Number.isFinite(updated) ||
        updated - created < 60000
    ) {
        return "";
    }

    return `
        <div
            class="model-change-info"
            title="Zuletzt von der Cloud aktualisiert"
        >
            <span class="model-change-dot"></span>
            Geändert ${escapeHTML(
                formatRelativeTime(model.updatedAt)
            )}
        </div>
    `;

}


function applyTheme(theme) {

    const dark =
        theme === "dark";

    document.body.classList.toggle(
        "dark-mode",
        dark
    );

    document.documentElement.dataset.theme =
        dark
            ? "dark"
            : "light";

    const meta =
        document.querySelector(
            'meta[name="theme-color"]'
        );

    if (meta) {
        meta.setAttribute(
            "content",
            dark
                ? "#111214"
                : "#f5f5f7"
        );
    }

    const button =
        document.getElementById(
            "themeToggleButton"
        );

    if (button) {

        button.querySelector(
            ".v42-action-label"
        ).textContent =
            dark
                ? "Heller Modus"
                : "Dunkler Modus";

        button.querySelector(
            ".v42-action-icon"
        ).textContent =
            dark
                ? "☀"
                : "☾";

        button.setAttribute(
            "aria-label",
            dark
                ? "Hellen Modus einschalten"
                : "Dunklen Modus einschalten"
        );

    }

}


function toggleTheme() {

    const dark =
        !document.body.classList.contains(
            "dark-mode"
        );

    try {
        localStorage.setItem(
            THEME_STORAGE_KEY,
            dark
                ? "dark"
                : "light"
        );
    } catch {}

    applyTheme(
        dark
            ? "dark"
            : "light"
    );

}


function updateMultiSelectUI() {

    document.body.classList.toggle(
        "multi-select-mode",
        multiSelectMode
    );

    const toggle =
        document.getElementById(
            "multiSelectButton"
        );

    if (toggle) {

        toggle.querySelector(
            ".v42-action-label"
        ).textContent =
            toggle.setAttribute(
                "aria-pressed",
                multiSelectMode ? "true" : "false"
            );

        toggle.querySelector(
            ".v42-action-label"
        ).textContent =
            multiSelectMode
                ? "Auswahl beenden"
                : "Mehrere bearbeiten";

    }

    document.querySelectorAll(
        ".model-card"
    ).forEach(
        card => {

            const id =
                card.dataset.modelId;

            card.classList.toggle(
                "is-selected",
                Boolean(
                    id &&
                    selectedModelIds.has(id)
                )
            );

        }
    );

    const bar =
        document.getElementById(
            "bulkSelectionBar"
        );

    if (!bar) return;

    const count =
        selectedModelIds.size;

    bar.classList.toggle(
        "hidden",
        !multiSelectMode
    );

    bar.querySelector(
        ".bulk-selection-count"
    ).textContent =
        `${count} ausgewählt`;

    const applyButton =
        bar.querySelector(
            ".bulk-apply-button"
        );

    const action =
        bar.querySelector(
            ".bulk-action-select"
        );

    applyButton.disabled =
        count === 0 || !action?.value;

}


function clearMultiSelection() {

    selectedModelIds.clear();
    multiSelectMode = false;
    updateMultiSelectUI();

}


async function applyBulkTagAction() {

    if (
        selectedModelIds.size === 0
    ) {
        return;
    }

    const select =
        document.getElementById(
            "bulkActionSelect"
        );

    const action =
        select?.value || "";

    const match =
        /^(add|remove):(.+)$/.exec(action);

    if (!match) {
        return;
    }

    const operation =
        match[1];

    const tagId =
        match[2];

    const selectedModels =
        models.filter(
            model =>
                selectedModelIds.has(
                    String(model.id)
                )
        );

    if (selectedModels.length === 0) {
        return;
    }

    const tag =
        findTagById(tagId);

    if (!tag) {
        return;
    }

    const verb =
        operation === "add"
            ? `Tag „${tag.name}“ zu ${selectedModels.length} Modellen hinzufügen?`
            : `Tag „${tag.name}“ bei ${selectedModels.length} Modellen entfernen?`;

    if (!window.confirm(verb)) {
        return;
    }

    const oldStates =
        selectedModels.map(
            model => ({
                model,
                tagIds: [...model.tagIds],
                tags: [...model.tags]
            })
        );

    try {

        for (const model of selectedModels) {

            const nextIds =
                operation === "add"
                    ? Array.from(
                        new Set(
                            [...model.tagIds, tag.id]
                        )
                    )
                    : model.tagIds.filter(
                        id => id !== tag.id
                    );

            model.tagIds = nextIds;
            model.tags = nextIds
                .map(id => findTagById(id)?.name || null)
                .filter(Boolean);

            await saveModelTags(model);

        }

        const actionText =
            operation === "add"
                ? `Tag „${tag.name}“ hinzugefügt.`
                : `Tag „${tag.name}“ entfernt.`;

        showToast(actionText);
        clearMultiSelection();
        renderEverything();

    } catch (error) {

        oldStates.forEach(
            state => {
                state.model.tagIds = state.tagIds;
                state.model.tags = state.tags;
            }
        );

        console.error(
            "Mehrfach-Tag-Aktion:",
            error
        );

        showToast(
            "Die Änderung konnte nicht für alle ausgewählten Modelle gespeichert werden.",
            "error"
        );

        renderEverything();

    }

}


function setupMultiSelectControls() {

    const filterRight =
        document.querySelector(
            ".filter-right"
        );

    const grid =
        document.getElementById(
            "modelGrid"
        );

    if (!filterRight || !grid) return;

    if (!document.getElementById("multiSelectButton")) {

        const button =
            document.createElement("button");

        button.type = "button";
        button.id = "multiSelectButton";
        button.className = "v42-action-button";
        button.title = "Mehrere Modelle auswählen und gemeinsam Tags ändern";
        button.setAttribute("aria-pressed", "false");
        button.innerHTML = `
            <span class="v42-action-icon">☷</span>
            <span class="v42-action-label">Mehrere bearbeiten</span>
        `;

        button.addEventListener(
            "click",
            () => {

                multiSelectMode =
                    !multiSelectMode;

                if (!multiSelectMode) {
                    selectedModelIds.clear();
                }

                updateMultiSelectUI();

            }
        );

        filterRight.insertBefore(
            button,
            modelCount
        );

    }

    if (!document.getElementById("bulkSelectionBar")) {

        const bar =
            document.createElement("div");

        bar.id = "bulkSelectionBar";
        bar.className = "bulk-selection-bar hidden";
        bar.innerHTML = `
            <div class="bulk-selection-left">
                <strong class="bulk-selection-count">0 ausgewählt</strong>
                <span>Nur bewusst markierte Modelle werden geändert.</span>
            </div>

            <select
                id="bulkActionSelect"
                class="bulk-action-select"
            >
                <option value="">Tag-Aktion auswählen…</option>
            </select>

            <button
                type="button"
                class="primary-button bulk-apply-button"
            >
                Anwenden
            </button>

            <button
                type="button"
                class="secondary-button bulk-cancel-button"
            >
                Abbrechen
            </button>
        `;

        const actionSelect =
            bar.querySelector(
                "#bulkActionSelect"
            );

        const applyButton =
            bar.querySelector(
                ".bulk-apply-button"
            );

        const cancelButton =
            bar.querySelector(
                ".bulk-cancel-button"
            );

        applyButton.addEventListener(
            "click",
            applyBulkTagAction
        );

        cancelButton.addEventListener(
            "click",
            clearMultiSelection
        );

        grid.parentNode.insertBefore(
            bar,
            grid
        );

    }

    populateBulkActionSelect();
    updateMultiSelectUI();

}


function populateBulkActionSelect() {

    const select =
        document.getElementById(
            "bulkActionSelect"
        );

    if (!select) return;

    const current =
        select.value;

    select.innerHTML =
        `<option value="">Tag-Aktion auswählen…</option>`;

    tags.forEach(
        tag => {

            const add =
                document.createElement("option");

            add.value =
                `add:${tag.id}`;

            add.textContent =
                `Tag hinzufügen: ${tag.name}`;

            select.appendChild(add);

        }
    );

    tags.forEach(
        tag => {

            const remove =
                document.createElement("option");

            remove.value =
                `remove:${tag.id}`;

            remove.textContent =
                `Tag entfernen: ${tag.name}`;

            select.appendChild(remove);

        }
    );

    if (
        current &&
        [...select.options].some(
            option => option.value === current
        )
    ) {
        select.value = current;
    }

}


function setupThemeAndBackupControls() {

    const bottom =
        document.querySelector(
            ".sidebar-bottom"
        );

    if (!bottom) return;

    if (!document.getElementById("themeToggleButton")) {

        const themeButton =
            document.createElement("button");

        themeButton.type = "button";
        themeButton.id = "themeToggleButton";
        themeButton.className = "companion-sidebar-button v42-sidebar-action";
        themeButton.innerHTML = `
            <span class="v42-action-icon">☾</span>
            <span class="v42-action-label">Dunkler Modus</span>
        `;

        themeButton.addEventListener(
            "click",
            toggleTheme
        );

        const companion =
            document.getElementById("companionButton");

        bottom.insertBefore(
            themeButton,
            companion || bottom.firstChild
        );

    }

    if (!document.getElementById("backupButton")) {

        const backupButton =
            document.createElement("button");

        backupButton.type = "button";
        backupButton.id = "backupButton";
        backupButton.className = "companion-sidebar-button v42-sidebar-action";
        backupButton.innerHTML = `
            <span class="v42-action-icon">↓</span>
            <span class="v42-action-label">Library sichern</span>
        `;

        backupButton.addEventListener(
            "click",
            createLibraryBackup
        );

        bottom.insertBefore(
            backupButton,
            document.getElementById("themeToggleButton")
        );

    }

}


async function createLibraryBackup() {

    if (!currentUser) {
        showToast(
            "Bitte zuerst anmelden.",
            "error"
        );
        return;
    }

    if (!window.JSZip) {
        showToast(
            "Backup-Unterstützung ist nicht geladen. Bitte App neu laden.",
            "error"
        );
        return;
    }

    const button =
        document.getElementById("backupButton");

    if (button?.disabled) return;

    const confirmed =
        window.confirm(
            `Eine vollständige Sicherung mit ${models.length} Modellen, Tags und Druckwarteschlange erstellen? Große Libraries können einige Zeit und Arbeitsspeicher benötigen.`
        );

    if (!confirmed) return;

    try {

        button.disabled = true;
        button.querySelector(".v42-action-label").textContent = "Backup wird erstellt…";

        const zip =
            new JSZip();

        const metadata = {
            version: "3D Library Backup V1",
            created_at: new Date().toISOString(),
            user_id: currentUser.id,
            models: models.map(
                model => ({
                    id: model.id,
                    name: model.name,
                    original_filename: model.originalName,
                    file_hash: model.fileHash,
                    variable_size: model.variableSize,
                    created_at: model.createdAt,
                    updated_at: model.updatedAt,
                    tag_ids: [...model.tagIds],
                    last_opened_at: readLastOpenedMap()[String(model.id)] || null
                })
            ),
            tags: tags.map(
                tag => ({
                    id: tag.id,
                    name: tag.name,
                    color: tag.color || null
                })
            ),
            print_queue: printQueue.map(
                entry => ({
                    id: entry.id,
                    model_id: entry.modelId,
                    quantity: entry.quantity,
                    position: entry.position,
                    notes: entry.notes || ""
                })
            )
        };

        zip.file(
            "library-backup.json",
            JSON.stringify(metadata, null, 2)
        );

        zip.file(
            "README.txt",
            "3D Library Backup\n\nEnthält die Modell-Dateien sowie Metadaten, Tags und Druckwarteschlange.\nDie Modelle liegen unter models/.\n"
        );

        const modelFolder =
            zip.folder("models");

        let completed = 0;

        for (const model of models) {

            completed++;

            button.querySelector(".v42-action-label").textContent =
                `Backup ${completed}/${models.length}…`;

            if (!model.filePath) continue;

            try {

                const {
                    data,
                    error
                } =
                    await supabase
                        .storage
                        .from(MODEL_BUCKET)
                        .download(model.filePath);

                if (error) throw error;
                if (!data) throw new Error("Keine Datei zurückgegeben.");

                const safeName =
                    sanitizeBackupFilename(
                        model.originalName ||
                        model.name ||
                        `${model.id}.3mf`
                    );

                modelFolder.file(
                    `${model.id}_${safeName}`,
                    data
                );

            } catch (error) {

                console.warn(
                    "Backup: Modell konnte nicht geladen werden:",
                    model,
                    error
                );

                zip.file(
                    `errors/${model.id}.txt`,
                    `Datei konnte beim Backup nicht heruntergeladen werden.\n${error?.message || error}`
                );

            }

        }

        button.querySelector(".v42-action-label").textContent =
            "Backup wird gepackt…";

        const blob =
            await zip.generateAsync(
                {
                    type: "blob",
                    compression: "STORE"
                },
                metadata => {
                    if (metadata?.percent != null) {
                        button.querySelector(".v42-action-label").textContent =
                            `Backup ${Math.round(metadata.percent)} %…`;
                    }
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            `3D-Library-Backup-${new Date().toISOString().slice(0, 10)}.zip`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(
            () => URL.revokeObjectURL(url),
            5000
        );

        showToast(
            "Backup erfolgreich erstellt."
        );

    } catch (error) {

        console.error(
            "Library Backup:",
            error
        );

        showToast(
            `Backup fehlgeschlagen: ${error?.message || "Unbekannter Fehler"}`,
            "error"
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.querySelector(".v42-action-label").textContent =
                "Library sichern";
        }

    }

}


function sanitizeBackupFilename(name) {

    return String(name)
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180) || "model.3mf";

}


function setupV42Features() {

    if (v42UiReady) return;

    v42UiReady = true;

    /* PWA-Sortierung erweitern. */
    if (
        sortSelect &&
        !sortSelect.querySelector(
            'option[value="lastOpened"]'
        )
    ) {

        const option =
            document.createElement("option");

        option.value = "lastOpened";
        option.textContent = "Zuletzt geöffnet";
        sortSelect.appendChild(option);

    }

    setupThemeAndBackupControls();
    setupMultiSelectControls();

    let theme = "light";

    try {
        theme =
            localStorage.getItem(
                THEME_STORAGE_KEY
            ) || "light";
    } catch {}

    applyTheme(theme);

}


/* =========================================================
   STARTUP
   ========================================================= */

async function boot() {

    try {

        setLoadingStatus();

        setAuthStatus(
            "Cloud-Verbindung wird hergestellt...",
            "info"
        );


        const user =
            await ensureAuth();


        if (!user) {

            await showSignedOutAuth();

            return;

        }


        currentUser =
            user;


        await loadCloudData();


        if (user.is_anonymous) {

            await showAnonymousSetup();

        } else {

            hideAuthModal();

            await maybeShowPasskeySetup(
                user
            );

        }


    } catch (error) {

        console.error(
            "Boot:",
            error
        );


        if (!navigator.onLine) {
            setOfflineStatus();
        }

        showToast(
            `Supabase konnte nicht geladen werden: ${error?.message || "Unbekannter Fehler"}`,
            "error"
        );

    }

}



/* =========================================================
   START
   ========================================================= */

setupV42Features();
boot();


/* =========================================================
   TAG-LEISTE
   ========================================================= */

(() => {

    const strip =
        document.getElementById(
            "tagFilterList"
        );

    if (!strip) {
        return;
    }

    /*
     * Keine Pointer-Drag-Logik mehr: Die Filter-Buttons müssen
     * ganz normale Klicks bleiben. Die Leiste kann weiterhin
     * horizontal über Mausrad bzw. die Scrollleiste bewegt werden.
     */
    strip.addEventListener(
        "wheel",
        event => {

            if (
                strip.scrollWidth <=
                strip.clientWidth
            ) {
                return;
            }

            const vertical =
                Math.abs(event.deltaY);

            const horizontal =
                Math.abs(event.deltaX);

            if (
                vertical > horizontal
            ) {

                strip.scrollLeft +=
                    event.deltaY;

                event.preventDefault();

            }

        },
        {
            passive: false
        }
    );

})();
