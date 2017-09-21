// Generated by CoffeeScript 1.12.5
(function() {
  chrome.browserAction.onClicked.addListener(function(tab) {
    return chrome.tabs.create({
      url: chrome.extension.getURL('index.html')
    });
  });

  chrome.contextMenus.create({
    title: 'Search \'%s\' in UniSearch',
    contexts: ["selection"],
    onclick: function(info, tab) {
      return chrome.tabs.create({
        url: chrome.extension.getURL("index.html#?k=" + (encodeURIComponent(info.selectionText)))
      });
    }
  });

}).call(this);

//# sourceMappingURL=background.js.map
