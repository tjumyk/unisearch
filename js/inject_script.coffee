debug=true

$=window.jQuery
$.noConflict()

if debug
  console.log("Using jQuery #{$.fn.jquery}")

$(document).on 'dblclick', (e)->
  if debug
    console.log(window.getSelection())
