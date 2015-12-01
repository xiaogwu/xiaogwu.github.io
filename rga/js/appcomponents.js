!function(){function e(e,o,t,r){o.html5Mode(!1),e.when("/",{templateUrl:"views/home.html",controller:"MainController",controllerAs:"main"}).otherwise({redirectTo:"/"}),t.interceptors.push("authInterceptor")}function o(e,o,t,r){return{request:function(e){return e.headers=e.headers||{},e},responseError:function(e){return 404===e.status?(r.path("/"),o.reject(e)):o.reject(e)}}}function t(e,o){}angular.module("mst3k",["ngRoute"]).config(e),e.$inject=["$routeProvider","$locationProvider","$httpProvider","$compileProvider"],angular.module("mst3k").factory("authInterceptor",o),o.$inject=["$rootScope","$q","LocalStorage","$location"],angular.module("mst3k").run(t),t.$inject=["$rootScope","$location"]}(),function(){angular.module("mst3k").constant("CONSTANTS",{API_URL:"http://www.yourAPIurl.com/"})}(),function(){"use strict";function e(e,o){function t(o,t){return i||console.log("localStorage not supported, make sure you have the $cookies supported."),null===window.localStorage.getItem(o)?e.localStorage&&e.localStorage.setItem(o,angular.toJson(t)):void console.warn("localStorage with the name "+o+" already exists. Please pick another name.")}function r(o){return i||console.log("localStorage not supported, make sure you have the $cookies supported."),e.localStorage&&angular.fromJson(e.localStorage.getItem(o))}function n(o,t){return i||console.log("localStorage not supported, make sure you have the $cookies supported."),e.localStorage&&e.localStorage.setItem(o,angular.toJson(t))}function a(o){return i||console.log("localStorage not supported, make sure you have the $cookies supported."),e.localStorage&&e.localStorage.removeItem(o)}function l(){return i||console.log("localStorage not supported, make sure you have the $cookies supported."),e.localStorage&&e.localStorage.clear()}function c(){return e.localStorage}var u="undefined"==typeof window.localStorage?void 0:window.localStorage,i=!(void 0===typeof u||void 0===typeof window.JSON);return angular.element(e).on("storage",function(e,t){e.key===t&&o.$apply()}),{set:t,get:r,update:n,remove:a,removeAll:l,list:c}}angular.module("mst3k").factory("LocalStorage",["$window","$rootScope",e])}(),function(){"use strict";function e(e,o,t){function r(r,n,a,l){var c=o.defer();return e({method:r,url:t.API_URL+n,params:a,data:l}).then(function(e){e.config||console.log("Server error occured."),c.resolve(e)},function(e){c.reject(e)}),c.promise}var n={query:r};return n}angular.module("mst3k").factory("QueryService",["$http","$q","CONSTANTS",e])}(),function(){"use strict";function e(){var e={restrict:"E",templateUrl:"components/directives/main-nav/main-nav.html"};return e}angular.module("mst3k").directive("mainNav",e)}(),function(){"use strict";function e(){var e={restrict:"E",templateUrl:"components/directives/main-footer/main-footer.html"};return e}angular.module("mst3k").directive("mainFooter",e)}(),function(){"use strict";function e(e,o){var t={restrict:"E",scope:{placeholder:"@",code:"@",overlay:"@",isModal:"=modal"},replace:!1,templateUrl:"components/directives/youtube-video/youtube-video.html",link:function(t,r,n){t.placeholderImageSrc="images/"+n.placeholder,t.youtubeUrl=e.trustAsResourceUrl("https://www.youtube.com/embed/"+n.code+"?showinfo=0&modestbranding=0&au"),t.overlayImageSrc="images/"+n.overlay,t.center=function(){var e=document.querySelector(".modal-open .modal-inner"),o=Math.max(window.innerHeight-e.offsetHeight,0)/2;e.style.top=0===o?"0":o+"px"},t.toggleVideo=function(e){t.showVideo=!t.showVideo,t.isModal&&t.showVideo?(o.find("body").addClass("body-modal-open"),r.addClass("modal-open"),t.center(document.querySelector(".modal-open .modal-inner"))):(o.find("body").removeClass("body-modal-open"),r.removeClass("modal-open"))}}};return t}angular.module("mst3k").directive("youtubeVideo",["$sce","$document",e])}();