window.addEventListener("load", () => {
    console.log("SCRIPT LOADED");
    // ==============================
    // FILE LINK HANDLERS
    // ==============================
    document.querySelectorAll(".file-link").forEach(link => {
        link.addEventListener("click", () => {
            loadTextFile(
                link.dataset.frame,
                link.dataset.file
            );
        });
    });
});
// ==============================
// DEFAULT LOADS
// ==============================
loadTextFile(
    "frameB",
    "./General Sources/Introduction"
);
loadTextFile(
    "frameC",
    "./Gospel/John"
);
loadTextFile(
    "frameD",
    "./General Sources/Resources"
);
// ==============================
// SCROLL POSITION STORAGE
// Stores scroll positions per:
// iframe -> file
// ==============================
const scrollPositions = {};
// ==============================
// CURRENT FILE TRACKER
// Keeps track of what each
// iframe currently has loaded
// ==============================
const currentFiles = {};
// ==============================
// SAVE SCROLL POSITION
// ==============================
function saveScrollPosition(
    frameId,
    file
) {
    const iframe =
        document.getElementById(frameId);
    if (!iframe || !iframe.contentWindow)
        return;
    // Create frame storage if missing
    if (!scrollPositions[frameId]) {
        scrollPositions[frameId] = {};
    }
    // Save position for THIS FILE
    scrollPositions[frameId][file] =
        iframe.contentWindow.scrollY;
}
// ==============================
// RESTORE SCROLL POSITION
// ==============================
function restoreScrollPosition(
    frameId,
    file
) {
    const iframe =
        document.getElementById(frameId);
    if (!iframe || !iframe.contentWindow)
        return;
    const y =
        scrollPositions[frameId]?.[file] || 0;
    iframe.contentWindow.scrollTo(
        0,
        y
    );
}
// ==============================
// STORE ACTIVE SCROLL HANDLERS
// ==============================
const iframeScrollHandlers = {};
// ==============================
// IFRAME LOAD HANDLER
// ==============================
function attachIframeLoadHandler(
    iframe,
    frameId,
    file
) {

    iframe.addEventListener(
        "load",
        () => {
            // Update title
            updateIframeTitle(
                frameId,
                file
            );
            // Track current file
            currentFiles[frameId] = file;
            // Restore saved position
            restoreScrollPosition(
                frameId,
                file
            );
            const iframeWindow =
                iframe.contentWindow;
            // ==============================
            // REMOVE OLD SCROLL LISTENER
            // ==============================
            if (iframeScrollHandlers[frameId]) {
                iframeWindow.removeEventListener(
                    "scroll",
                    iframeScrollHandlers[frameId]
                );
            }
            // ==============================
            // CREATE NEW SCROLL HANDLER
            // ==============================
            const scrollHandler = () => {
                // Create storage if needed
                if (!scrollPositions[frameId]) {
                    scrollPositions[frameId] = {};
                }
                // Save current file position
                scrollPositions[frameId][file] =
                    iframeWindow.scrollY;
                console.log(
                    frameId,
                    file,
                    iframeWindow.scrollY
                );
            };
            // Save handler reference
            iframeScrollHandlers[frameId] =
                scrollHandler;
            // Add listener
            iframeWindow.addEventListener(
                "scroll",
                scrollHandler
            );
        },
        { once: true }
    );
}
// ==============================
// HIGHLIGHT SCHEME
// ==============================
function getHighlightScheme(highlightSchemes) {
    const selected =
        document.getElementById("highlightSelector")?.value;
    const scheme =
        (highlightSchemes && highlightSchemes[selected]) || {
            bg: "#000",
            text: "#fff"
        };
    return scheme;
}
// ==============================
// fetch text file
// ==============================
async function fetchTextFile(file) {
    const response = await fetch(file);
    return await response.text();
}
// ==============================
// LOAD CONTENT
// ==============================
function setIframeContent(iframe, text, scheme) {
    iframe.srcdoc = buildTextHTML(text, scheme);
}
// ==============================
// Handle Iframe Error
// ==============================
function handleIframeError(err, iframe) {
    console.error(err);
    iframe.srcdoc = buildTextHTML(
        "ERROR",
        {
            bg: "#400",
            text: "#fff"
        }
    );
}
// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(
    frameId,
    file
) {
    const iframe = document.getElementById(frameId);
    if (!iframe) return;
    // Save previous file scroll position
    const previousFile =
        currentFiles[frameId];
    if (previousFile) {
        saveScrollPosition(
            frameId,
            previousFile
        );
    }
    // End merge block
    try {
        await initTemplate();
		const text = await fetchTextFile(file);
		const scheme = getHighlightScheme(highlightSchemes);
		attachIframeLoadHandler(iframe, frameId, file);
		setIframeContent(iframe, text, scheme);
    } catch (err) {
    handleIframeError(err, iframe);
	}
}
