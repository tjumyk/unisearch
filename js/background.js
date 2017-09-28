// Generated by CoffeeScript 1.12.5
(function() {
  chrome.contextMenus.create({
    title: 'Search \'%s\' in UniSearch',
    contexts: ["selection"],
    onclick: function(info, tab) {
      var keyword;
      keyword = info.selectionText.trim();
      if (keyword.length === 0) {
        return;
      }
      return chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        return chrome.tabs.sendMessage(tabs[0].id, {
          action: 'context-search',
          keyword: keyword
        });
      });
    }
  });

}).call(this);

//# sourceMappingURL=background.js.map
