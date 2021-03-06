angular.module 'app', ['ngSanitize']

.controller 'RootController', ['$scope', '$sce', '$http', '$timeout', '$location', 'engine', 'cache', 'util', 'logger', ($scope, $sce, $http, $timeout, $location, engine, cache, util, logger)->
  $input_keyword = $('#input_keyword')

  $scope.app =
    name: 'UniSearch'
    title: 'UniSearch'
    copyright: $sce.trustAsHtml('Created by <a href="https://github.com/tjumyk" target="_blank">Kelvin Miao</a>')
    debug_mode: !!cache.get('app.debug_mode')

  $scope.set_page_title = (text)->
    $scope.app.page_title = "#{text} · #{$scope.app.title}"

  $scope.$watch 'app.debug_mode', (val)->
    cache.set('app.debug_mode', val)

  $scope.data = {}
  $scope.loading = {}
  $scope.error = {}
  $scope.search_task = {}

  $scope.providers = engine.providers
  $scope.require_https = false

  do_search = (task)->
    if !task.keyword
      return

    logger.log('Search', '#2196F3', task)
    $scope.data = {}
    $scope.loading = {}
    $scope.error = {}
    $scope.any_loading = false
    $scope.any_error = false

    $scope.keyword = task.keyword
    $scope.set_page_title(task.keyword)

    $location.search('k', task.keyword)

    for pid, provider of engine.providers
      do (pid, provider)->
        # request cache
        if !$scope.app.debug_mode
          cache_id = "data.#{task.keyword}.#{pid}"
          cache_data = cache.get(cache_id)
          if !!cache_data
            $scope.data[pid] = cache_data
            return

        # check same-origin policy
        # TODO use background page to load data to avoid this issue
        if $scope.require_https and not provider.httpsOnly
          return

        # request provider
        $scope.loading[pid] = true
        $scope.any_loading = true
        provider.executor(task).then (data)->
          $scope.loading[pid] = false
          check_any_loading()
          $scope.data[pid] = data
          if cache_id
            cache.set(cache_id, data)
        , (error)->
          $scope.loading[pid] = false
          check_any_loading()
          $scope.error[pid] = error
          $scope.any_error = true

  $scope.$watch 'search_task', (task)->
    do_search(task)
  , true

  $scope.reset = ->
    $scope.data = {}
    $scope.loading = {}
    $scope.error = {}
    $scope.search_task = {}
    $location.search('k', null)

  $scope.search = ->
    $scope.search_task =
      keyword: $scope.keyword

  $scope.trust_html = (html)->
    return $sce.trustAsHtml(html)

  $scope.play_audio = (audios)->
    return if !audios or audios.length == 0
    sound = new Howl
      src: audios
    sound.play()

  check_any_loading = ->
    any_loading = false
    for k,v of $scope.loading
      if v == true
        any_loading = true
        break
    $scope.any_loading = any_loading

  $scope.$on '$locationChangeSuccess', ->
    k = $location.search().k
    if !!k
      $scope.search_task.keyword = k
    else
      $scope.reset()
      if window.parent == window
        setTimeout ->
          $input_keyword.focus()
        , 100

  window.onmessage = (e)->
    msg = e.data
    logger.log('Message↓', '#4CAF50', msg)
    if msg.action == 'focus-input'
      $input_keyword.focus()
      $input_keyword[0].select()
    else if msg.action == 'context-search'
      keyword = msg.keyword
      $timeout ->
        $scope.search_task.keyword = keyword
    else if msg.action == 'response-parent-info'
      $scope.require_https = msg.require_https

  $(window).on 'keydown', (e)->
    if e.keyCode == 27 or e.keyCode == 192
      if window.parent != window
        e.preventDefault()
        e.stopPropagation()
        $('input').blur()
        window.parent.postMessage({'action': 'hide-iframe'}, '*')

  window.parent.postMessage({'action': 'request-parent-info'}, '*')
]

.directive 'renderer', [->
  restrict: 'A'
  scope: true
  link: (scope, element, attrs)->
    scope.$watch 'data.' + scope.pid, (d)->
      scope.d = d
]
