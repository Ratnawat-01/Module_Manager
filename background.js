// Background script for managing the extension's global tasks

chrome.runtime.onInstalled.addListener(() => {
    console.log('BAT File Module Manager Extension Installed');
});

// Listener for handling tab operations
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openTabs') {
        const urls = message.urls;
        urls.forEach(url => {
            chrome.tabs.create({ url });
        });
        sendResponse({ status: 'Tabs opened successfully' });
    }

    // Handle request to open the edit module window
    if (message.action === 'openEditWindow') {
        chrome.windows.create({
            url: message.editPageUrl,
            type: 'popup',
            width: 600,
            height: 400
        }, (window) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                sendResponse({ status: 'error', error: chrome.runtime.lastError.message });
            } else {
                console.log('Edit window created:', window.id);
                sendResponse({ status: 'success' });
            }
        });
        return true; // Keeps the message channel open for async response
    }
});
