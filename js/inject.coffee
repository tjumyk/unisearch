$container = $('<div class="unisearch-panel hidden"></div>')
root_url = chrome.extension.getURL('/')
root_url = root_url.substring(0, root_url.length - 1)
panel_url = root_url + '/index.html'
$iframe = $("<iframe src='#{panel_url}'>")
$iframe.appendTo($container)
$container.appendTo(document.body)
logger = window.logger

log = (title, color, content)->
  if color == undefined
    color = 'grey'
  s1 = "%c %c #{title} "
  s2 = "background-color: #{color}"
  s3 = 'background-color:#F7F7F7;color:gray;font-weight:bold;'
  if content == undefined
    console.log(s1, s2, s3)
  else
    console.log(s1, s2, s3, content)

send_message_to_panel = (msg)->
  $iframe[0].contentWindow.postMessage(msg, '*')

$(document).on 'keydown', (e)->
  if e.keyCode == 192 and not e.shiftKey and not e.ctrlKey and not e.metaKey
    e.preventDefault()
    e.stopPropagation()
    $container.toggleClass('hidden')
    if not $container.hasClass('hidden')
      send_message_to_panel({'action': 'focus-input'})

window.onmessage = (e)->
  if e.origin != root_url
    return
  msg = e.data
  logger.log('Message↑', '#4CAF50', msg)
  if msg.action == 'hide-iframe'
    $container.addClass('hidden')
    window.focus()
  else if msg.action == 'request-parent-info'
    send_message_to_panel
      action: 'response-parent-info'
      require_https: window.location.protocol == 'https:'

request_context_search = (keyword)->
  $container.removeClass('hidden')
  send_message_to_panel
    action: 'context-search'
    keyword: keyword

$(document).on 'dblclick', (e)->
  keyword = window.getSelection().toString().trim()
  if keyword.length == 0
    return
  request_context_search(keyword)

chrome.extension.onMessage.addListener (msg, sender, sendResponse)->
  logger.log('ChromeMessage', '#9C27B0', msg)
  if msg.action == 'context-search'
    keyword = msg.keyword
    request_context_search(keyword)
