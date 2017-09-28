service =
  log : (title, color, content)->
    if color == undefined
      color = 'grey'
    s1 = "%c %c #{title} "
    s2 = "background-color: #{color}"
    s3 = 'background-color:#F7F7F7;color:gray;font-weight:bold;'
    if content == undefined
      console.log(s1, s2, s3)
    else
      console.log(s1, s2, s3, content)

if window.angular
  angular.module('app').factory 'logger', [->
    return service
  ]
else
  window.logger = service
