// Generated by CoffeeScript 1.12.5
(function() {
  var service;

  service = {
    log: function(title, color, content) {
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
    }
  };

  if (window.angular) {
    angular.module('app').factory('logger', [
      function() {
        return service;
      }
    ]);
  } else {
    window.logger = service;
  }

}).call(this);

//# sourceMappingURL=logger.js.map
