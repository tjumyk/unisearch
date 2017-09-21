chrome.browserAction.onClicked.addListener (tab)->
  chrome.tabs.create
    url: chrome.extension.getURL('index.html')

chrome.contextMenus.create
  title: 'Search \'%s\' in UniSearch',
  contexts: ["selection"]
  onclick: (info, tab)->
    chrome.tabs.create
      url: chrome.extension.getURL("index.html#?k=#{encodeURIComponent(info.selectionText)}")
