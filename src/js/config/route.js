angular.module("app.router", ["ui.router"])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("index");
        $stateProvider.state("main", {
            url: "/index",
            templateUrl: "view/main.html"
        }).state("main.module1", {
            url: "/module1/:page",
            templateUrl: function (e) {
                return "view/module1/" + e.page + ".html";
            }
        }).state("main.module2", {
            url: "/module2/:page",
            templateUrl: function (e) {
                return "view/module2/" + e.page + ".html";
            }
        })
    });
