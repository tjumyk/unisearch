angular.module 'app', ['ngSanitize']

.controller 'RootController', ['$scope', '$sce', '$http', '$timeout', '$location', 'engine', 'util', ($scope, $sce, $http, $timeout, $location, engine, util)->
  $('.pro_trans.ui.accordion').accordion()

  $scope.app =
    name: 'UniSearch'
    title: 'UniSearch'
    copyright: $sce.trustAsHtml('Created by <a href="https://github.com/tjumyk" target="_blank">Kelvin Miao</a>')

  $scope.set_page_title = (text)->
    $scope.app.page_title = "#{text} · #{$scope.app.title}"

  $scope.data = {}
  $scope.loading = {}
  $scope.error = {}

  $scope.providers = engine.providers

  $scope.search = ->
    $scope.data = {}
    $scope.loading = {}
    $scope.error = {}
    $scope.any_loading = false
    $scope.any_error = false

    keyword = $scope.keyword
    $scope.set_page_title(keyword)

    for pid, provider of engine.providers
      do (pid, provider)->
        $scope.loading[pid] = true
        $scope.any_loading = true
        provider.executor(keyword).then (data)->
          $scope.loading[pid] = false
          check_any_loading()
          $scope.data[pid] = data
        , (error)->
          $scope.loading[pid] = false
          check_any_loading()
          $scope.error[pid] = error
          $scope.any_error = true

  $scope.search_key = (keyword)->
    $scope.keyword = keyword
    $scope.search()

  $scope.trust_html = (html)->
    return $sce.trustAsHtml(html)

  check_any_loading = ->
    any_loading = false
    for k,v of $scope.loading
      if v == true
        any_loading = true
        break
    $scope.any_loading = any_loading

  check_url_params = ->
    k = $location.search()['k']
    if k != undefined and k.length > 0
      $scope.search_key(k)

  check_url_params()
]
