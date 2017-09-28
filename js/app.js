// Generated by CoffeeScript 1.12.5
(function() {
  angular.module('app', ['ngSanitize']).controller('RootController', [
    '$scope', '$sce', '$http', '$timeout', '$location', 'engine', 'util', function($scope, $sce, $http, $timeout, $location, engine, util) {
      var $input_keyword, check_any_loading, do_search, log;
      log = function(title, color, content) {
        var s1, s2, s3;
        if (color === void 0) {
          color = 'grey';
        }
        s1 = "%c %c " + title + " ";
        s2 = "background-color: " + color;
        s3 = 'background-color:#F7F7F7;color:gray;font-weight:bold;';
        if (content === void 0) {
          return console.log(s1, s2, s3);
        } else {
          return console.log(s1, s2, s3, content);
        }
      };
      $input_keyword = $('#input_keyword');
      $scope.app = {
        name: 'UniSearch',
        title: 'UniSearch',
        copyright: $sce.trustAsHtml('Created by <a href="https://github.com/tjumyk" target="_blank">Kelvin Miao</a>')
      };
      $scope.set_page_title = function(text) {
        return $scope.app.page_title = text + " · " + $scope.app.title;
      };
      $scope.data = {};
      $scope.loading = {};
      $scope.error = {};
      $scope.search_task = {};
      $scope.providers = engine.providers;
      do_search = function(task) {
        var pid, provider, ref, results;
        if (!task.keyword) {
          return;
        }
        log('Search', '#2196F3', task);
        $scope.data = {};
        $scope.loading = {};
        $scope.error = {};
        $scope.any_loading = false;
        $scope.any_error = false;
        $scope.keyword = task.keyword;
        $scope.set_page_title(task.keyword);
        $location.search('k', task.keyword);
        ref = engine.providers;
        results = [];
        for (pid in ref) {
          provider = ref[pid];
          results.push((function(pid, provider) {
            $scope.loading[pid] = true;
            $scope.any_loading = true;
            return provider.executor(task).then(function(data) {
              $scope.loading[pid] = false;
              check_any_loading();
              return $scope.data[pid] = data;
            }, function(error) {
              $scope.loading[pid] = false;
              check_any_loading();
              $scope.error[pid] = error;
              return $scope.any_error = true;
            });
          })(pid, provider));
        }
        return results;
      };
      $scope.$watch('search_task', function(task) {
        return do_search(task);
      }, true);
      $scope.reset = function() {
        $scope.data = {};
        $scope.loading = {};
        $scope.error = {};
        $scope.search_task = {};
        return $location.search('k', null);
      };
      $scope.search = function() {
        return $scope.search_task = {
          keyword: $scope.keyword
        };
      };
      $scope.trust_html = function(html) {
        return $sce.trustAsHtml(html);
      };
      check_any_loading = function() {
        var any_loading, k, ref, v;
        any_loading = false;
        ref = $scope.loading;
        for (k in ref) {
          v = ref[k];
          if (v === true) {
            any_loading = true;
            break;
          }
        }
        return $scope.any_loading = any_loading;
      };
      $scope.$on('$locationChangeSuccess', function() {
        var k;
        k = $location.search().k;
        if (!!k) {
          return $scope.search_task.keyword = k;
        } else {
          $scope.reset();
          if (window.parent === window) {
            return setTimeout(function() {
              return $input_keyword.focus();
            }, 100);
          }
        }
      });
      window.onmessage = function(e) {
        var keyword, msg;
        msg = e.data;
        log('Message↓', '#4CAF50', msg);
        if (msg.action === 'focus-input') {
          $input_keyword.focus();
          return $input_keyword[0].select();
        } else if (msg.action === 'context-search') {
          keyword = msg.keyword;
          return $timeout(function() {
            return $scope.search_task.keyword = keyword;
          });
        }
      };
      return $(window).on('keydown', function(e) {
        if (e.keyCode === 27 || e.keyCode === 192) {
          if (window.parent !== window) {
            e.preventDefault();
            e.stopPropagation();
            $('input').blur();
            return window.parent.postMessage({
              'action': 'hide-iframe'
            }, '*');
          }
        }
      });
    }
  ]).directive('renderer', [
    function() {
      return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {
          return scope.$watch('data.' + scope.pid, function(d) {
            return scope.d = d;
          });
        }
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=app.js.map
