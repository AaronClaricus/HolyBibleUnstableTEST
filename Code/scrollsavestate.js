// ==============================
// Listen to scroll position
// ==============================

const iframe = document.getElementById("frameB");

iframe.addEventListener("load", () => {

    const iframeWindow =
        iframe.contentWindow;

    iframeWindow.addEventListener(
        "scroll",
        () => {

            console.log(
                "SCROLL:",
                iframeWindow.scrollY
            );

        }
    );

});

// ==============================
// SCROLL POSITION STORAGE
// ==============================
const scrollPositions = {};
// ==============================
// SAVE SCROLL POSITION
// ==============================
function saveScrollPosition(frameId) {
    const iframe =
        document.getElementById(frameId);
    if (!iframe || !iframe.contentWindow)
        return;
    scrollPositions[frameId] =
        iframe.contentWindow.scrollY;
}
// ==============================
// RESTORE SCROLL POSITION
// ==============================
function restoreScrollPosition(frameId) {
    const iframe =
        document.getElementById(frameId);
    if (!iframe || !iframe.contentWindow)
        return;
    const y =
        scrollPositions[frameId] || 0;
    iframe.contentWindow.scrollTo(
        0,
        y
    );
}
// ==============================
// IFRAME LOAD
// ==============================
function attachIframeLoadHandler(
    iframe,
    frameId,
    file
) {
    iframe.addEventListener(
        "load",
        () => {
            updateIframeTitle(
                frameId,
                file
            );
            // RESTORE SAVED POSITION
            restoreScrollPosition(
                frameId
            );
            // TRACK SCROLLING
            iframe.contentWindow.addEventListener(
                "scroll",
                () => {
                    scrollPositions[frameId] =
                        iframe.contentWindow.scrollY;
                }
            );
        },
        { once: true }
    );
}
// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(
    frameId,
    file
) {
    const iframe =
        document.getElementById(frameId);
    if (!iframe) return;
    // SAVE CURRENT POSITION
    saveScrollPosition(frameId);
    try {
        await initTemplate();
        const text =
            await fetchTextFile(file);
        const scheme =
            getHighlightScheme(
                highlightSchemes
            );
        attachIframeLoadHandler(
            iframe,
            frameId,
            file
        );
        setIframeContent(
            iframe,
            text,
            scheme
        );
    } catch (err) {
        handleIframeError(
            err,
            iframe
        );
    }
}
