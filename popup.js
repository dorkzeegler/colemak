// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the current tab
  function getCurrentTab(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      callback(tabs[0]);
    });
  }

  // Cycle to the previously active tab
  function cycleTabs(direction) {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      getCurrentTab(function(currentTab) {
        const currentIndex = tabs.findIndex(tab => tab.id === currentTab.id);
        let newIndex;

        if (direction === 'prev') {
          newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else {
          newIndex = (currentIndex + 1) % tabs.length;
        }

        chrome.tabs.update(tabs[newIndex].id, { active: true });
      });
    });
  }

  // Open the custom page
  function openCustomPage() {
    chrome.tabs.create({ url: chrome.extension.getURL('custom_page.html') });
  }

  // Copy the text from the textarea and cycle to the previously active tab
  function copyAndClearText() {
    const textArea = document.querySelector('#colemakTextArea');
    if (textArea) {
      const text = textArea.value;

      if (text.trim() !== '') {
        navigator.clipboard.writeText(text);
        textArea.value = '';
        const messageElement = document.querySelector('#message');
        if (messageElement) {
          messageElement.textContent = 'Text copied and cleared.';
        }
        cycleTabs('prev');
      } else {
        const messageElement = document.querySelector('#message');
        if (messageElement) {
          messageElement.textContent = 'No text to copy.';
        }
      }
    }
  }

  // Add click event listeners to the buttons
  const prevTabButtons = document.querySelectorAll('#prev-tab');
  if (prevTabButtons.length > 0) {
    prevTabButtons.forEach(button => button.addEventListener('click', () => cycleTabs('prev')));
  }

  const nextTabButtons = document.querySelectorAll('#next-tab');
  if (nextTabButtons.length > 0) {
    nextTabButtons.forEach(button => button.addEventListener('click', () => cycleTabs('next')));
  }

  const openCustomPageButtons = document.querySelectorAll('#open-custom-page');
  if (openCustomPageButtons.length > 0) {
    openCustomPageButtons.forEach(button => button.addEventListener('click', openCustomPage));
  }

  const copyAndClearButtons = document.querySelectorAll('#copyAndClearButton');
  if (copyAndClearButtons.length > 0) {
    copyAndClearButtons.forEach(button => button.addEventListener('click', copyAndClearText));
  }
});
