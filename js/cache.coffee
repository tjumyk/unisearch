# TODO: data compression
# TODO: storage quota
# TODO: data timestamp and TTL
# TODO: use WebSQL if more efficient

angular.module('app').factory 'cache', [->
  services =
    set : (key, value)->
      data = JSON.stringify(value)
      window.localStorage.setItem(key, data)
    get : (key)->
      data = window.localStorage.getItem(key)
      return JSON.parse(data)

  return services
]
