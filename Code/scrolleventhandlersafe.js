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
