// Generated by CoffeeScript 1.12.5
(function() {
  angular.module('app', ['ngSanitize']).controller('RootController', [
    '$scope', '$sce', '$http', '$timeout', '$location', 'engine', 'util', function($scope, $sce, $http, $timeout, $location, engine, util) {
      var $input_keyword, check_any_loading, check_url_params;
      $('.pro_trans.ui.accordion').accordion();
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
      $scope.providers = engine.providers;
      $scope.search = function() {
        var keyword, pid, provider, ref, results;
        $scope.data = {};
        $scope.loading = {};
        $scope.error = {};
        $scope.any_loading = false;
        $scope.any_error = false;
        keyword = $scope.keyword;
        $scope.set_page_title(keyword);
        ref = engine.providers;
        results = [];
        for (pid in ref) {
          provider = ref[pid];
          results.push((function(pid, provider) {
            $scope.loading[pid] = true;
            $scope.any_loading = true;
            return provider.executor(keyword).then(function(data) {
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
      $scope.search_key = function(keyword) {
        $scope.keyword = keyword;
        return $scope.search();
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
      check_url_params = function() {
        var k;
        k = $location.search()['k'];
        if (k !== void 0 && k.length > 0) {
          return $scope.search_key(k);
        } else {
          return $input_keyword.focus();
        }
      };
      return check_url_params();
    }
  ]);

}).call(this);

//# sourceMappingURL=app.js.map
