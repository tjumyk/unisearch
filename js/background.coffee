#chrome.browserAction.onClicked.addListener (tab)->
#  chrome.tabs.create
#    url: chrome.extension.getURL('index.html')

chrome.contextMenus.create
  title: 'Search \'%s\' in UniSearch',
  contexts: ["selection"]
  onclick: (info, tab)->
    keyword = info.selectionText
    if !keyword or keyword.length == 0
      return
    chrome.tabs.query {active: true, currentWindow: true}, (tabs)->
      chrome.tabs.sendMessage tabs[0].id,
        action: 'context-search'
        keyword: keyword
