has_jquery = ->
  $=window.jQuery
  if $ and $.fn and $.fn.jquery
    return true
  return false

inject_script = (script, onload)->
  s = document.createElement('script')
  s.src = chrome.extension.getURL(script)
  (document.head or document.documentElement).appendChild(s)
  s.onload = ->
    if onload
      onload()
    s.parentNode.removeChild(s)

#if not has_jquery()
#  inject_script 'vendor/jquery/jquery.min.js', ->
#    inject_script 'js/inject_script.js'
#else
#  inject_script 'js/inject_script.js'
