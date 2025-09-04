// Background script for Cognitive Mirror Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('🪞 Cognitive Mirror Extension installed');
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('🪞 Tab updated:', tab.url);
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'contextChanged') {
    console.log('🪞 Context changed:', request.context);
  }
});