//gulp构建
var gulp = require("gulp");
//编译less
var less = require("gulp-less");
//文件合并
var concat = require("gulp-concat");
//mock数据
var Mock = require("mockjs");
//浏览器自动刷新
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
//读取json数据插件
var dataPlug = require("gulp-data");
//处理md文件（...）
var marked = require("gulp-marked");

//build
gulp.task("build", ['css', 'js', 'html'], function () {
    console.log("=====build完成=====");
});

//编译less
gulp.task("css", function () {
    gulp.src("./src/less/style.less")
        .pipe(less())
        .pipe(gulp.dest("./dist/css/"));
    gulp.src("./bower_components/bootstrap/dist/css/bootstrap.min.css")
        .pipe(concat("vendor.css"))
        .pipe(gulp.dest("./dist/css/"));
});

//合并js
gulp.task("js", function () {
    gulp.src(["./src/js/*.js","./src/js/*/*.js","./src/js/*/*/*.js"])
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./dist/js/"));
    //第三方js
    gulp.src([
        "./bower_components/angular/angular.min.js",
        "./bower_components/angular-ui-router/release/angular-ui-router.min.js",
        "./bower_components/angular-bootstrap/ui-bootstrap.min.js",
        "./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"
    ])
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest("./dist/js/"));
});

//复制html
gulp.task("html", function () {
    gulp.src("./src/index.html")
        .pipe(gulp.dest("./dist/"));
    gulp.src(["./src/view/**"])
        .pipe(gulp.dest("./dist/view/"));
});

gulp.task("marked", function () {
    gulp.src("readme.md")
        .pipe(marked(
            {
                renderer: function (text, level) {
                    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

                    return '<h' + level + '><a name="' +
                        escapedText +
                        '" class="anchor" href="#' +
                        escapedText +
                        '"><span class="header-link"></span></a>' +
                        text + '</h' + level + '>';
                }
            }
        ))
        .pipe(gulp.dest("./dist"));
});


var Return = function (data, code, msg) {
    return {
        info: data || null,
        code: code || 200,
        msg: msg || "请求成功"
    }
};

gulp.task("sync-init", function () {
    //浏览器自动刷新初始化
    browserSync.init({
        server: {
            baseDir: './',
            index: 'dist/index.html',
            middleware: function (req, res, next) {
                var ajaxUrl = /.do$|.no$/;
                if (ajaxUrl.test(req.originalUrl)) {
                    new Promise(function (res) {
                        gulp.src("./mock/data.json")
                            .pipe(dataPlug(function (file) {
                                res(JSON.parse(String(file.contents))[req.originalUrl.replace("/", "")]);
                            }));
                    }).then(function (tpl) {
                        var data = Return(Mock.mock(tpl));
                        console.log("RequestMapping:" + req.originalUrl);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                    });
                } else {
                    next();
                }
            }
        },
        open: true,
        port: 3100
    });
});

gulp.task("watch", ["build", "sync-init"], function () {
    gulp.watch("./mock/**").on("change", reload);
    gulp.watch("./src/**", ["build"]).on("change", reload);
});

gulp.task("hello", function () {
    console.log("hello angular");
});