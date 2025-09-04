// Popup script for Cognitive Mirror Extension

document.addEventListener('DOMContentLoaded', async () => {
  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab) {
    const url = new URL(tab.url);
    document.getElementById('currentSite').textContent = url.hostname;
  }
  
  document.getElementById('status').textContent = 'Active & Monitoring';
  document.getElementById('predictionCount').textContent = '3';
});

function refreshContext() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshContext' });
  });
  
  document.getElementById('status').textContent = 'Refreshing...';
  setTimeout(() => {
    document.getElementById('status').textContent = 'Active & Monitoring';
  }, 1000);
}

function toggleSidebar() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' });
  });
}

function openOptions() {
  chrome.tabs.create({ url: 'https://nabthebest135.github.io/cognitive-os' });
}