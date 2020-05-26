const gulp = require("gulp");	
const plumber = require("gulp-plumber");
const proxy = require("http-proxy-middleware");				
const clean = require("gulp-clean");          	
const htmltpl = require("gulp-html-tpl");
const del = require("del");
const artTemplate = require("art-template");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const cache = require("gulp-cache");
const pngquant = require("imagemin-pngquant");
const connect = require("gulp-connect");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const babel = require("gulp-babel");
const eslint = require("gulp-eslint");
const stylelint = require("gulp-stylelint");
const htmlmin = require("gulp-htmlmin");

// 配置文件	
const { dist } = require("./config");	
const Paths = {
    src: {
        script: "src/script/",
        scriptLib: "src/script/libs/*.js",
        cssLib: "src/style/libs/*.css",
        css: "src/style/",
        views: "src/views/**/*",
        font: "src/font/",
        images: "src/images/"
        // data: "src/data/"
    }
}; 
	
// html	
function compileHtmlTemp () {
    return gulp.src(Paths.src.views)
        .pipe(htmltpl({
            tag: "template",
            engine: function (template, data) {
                return artTemplate.compile(template)(data);
            },
            beautify: {
                indent_size: 4,
                indent_char: " ",
                indent_with_tabs: false,
                eol: "\n"
            }
        }))
        .pipe(htmlmin({
            removeComments: true //清除HTML注释
        }))
        .pipe(gulp.dest(dist + "/static")) // 拷贝
        .pipe(connect.reload());
}
const compileHtml = gulp.series(compileHtmlTemp, function () {
    return del([dist + "/static/" + "public"]); // 删掉dist + "/static/" + "public"目录中的文件
});

// 移动views目录到打包的dev环境（方便后台如果需要也能使用公共模板修改）
function moveViews () {
    return gulp.src(Paths.src.views)
        .pipe(gulp.dest(dist + "/views"))
        .pipe(connect.reload());
}

 
// font
function font () {
    return gulp.src(Paths.src.font + "**/*")
        .pipe(gulp.dest(dist + "/font"))
        .pipe(connect.reload());
}
	
// css	
function lintcss () { // 对所有的scss文件进行stylelint校验
    return gulp.src(Paths.src.css + "**/*.scss")
        .pipe(cache(stylelint({
            reporters: [{
                formatter: "string",
                console: true
            }]
            // fix: true
        })));
}

const prefixerCss = gulp.series(lintcss, function () {
    return gulp.src(Paths.src.css + "style.scss")
        .pipe(plumber()) //防止编译出错时停止服务，而是直接给我们抛出错误
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest(dist + "/css")) //当前对应css文件	
        .pipe(connect.reload()); // winne添加的
});

function libsCssMin () { // 把Paths.src.cssLib这第三方css库都合并到core.min.css中
    return gulp.src(Paths.src.cssLib)
        .pipe(concat("core.css"))
        .pipe(cleanCSS())
        .pipe(rename({suffix: ".min"})) //rename压缩后的文件名
        .pipe(gulp.dest(dist + "/css")); //当前对应css文件	
}
 
	
// js	
function libsScriptConcat () { // 把Paths.src.scriptLib中的第三方库代码合并到core.min.js中
    return gulp.src(Paths.src.scriptLib)
        .pipe(concat("core.js"))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"})) //rename压缩后的文件名 
        .pipe(gulp.dest(dist + "/js")); // 拷贝
}

const libsScriptMin = gulp.parallel(libsScriptConcat, function () { // 把Paths.src.script + "jquery.js"中的jq库移动到目的打包文件
    return gulp.src(Paths.src.script + "jquery.js")
        .pipe(rename({suffix: ".min"})) //rename压缩后的文件名 
        .pipe(gulp.dest(dist + "/js")) // 拷贝
        .pipe(connect.reload()); //更新	
});

function jseslint () { // 对自己写的代码进行eslint校验
    return gulp.src(Paths.src.script + "es6/*.js")
        .pipe(cache(eslint()))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

const scriptbabel = gulp.series(jseslint, function () { // 对es6代码进行编译
    return gulp.src(Paths.src.script + "es6/*.js")
        .pipe(plumber()) //防止编译出错时停止服务，而是直接给我们抛出错误
        .pipe(babel({
            presets: ["@babel/preset-env"]
            // presets: ['@babel/env']
        }))
        .pipe(gulp.dest(dist + "/js")) // 拷贝
        .pipe(connect.reload()); //更新	
});	
 
	
// image
function imageMin () {
    return gulp.src(Paths.src.images + "**/*")
        .pipe(plumber()) //防止编译出错时停止服务，而是直接给我们抛出错误
        .pipe(cache(imagemin({
            progressive: true,
            use: [pngquant()]
        })))
        .pipe(gulp.dest(dist + "/images"));	
}	
 
	
// clean dir	
function cleanDir () {
    return gulp.src(dist, {allowEmpty: true})
        .pipe(clean());
}
 
	
// 本地服务器函数	
function connectServer () {
    const randomPort = parseInt(Math.random() * 1000 + 1000);
    connect.server({
        root: dist, //根目录	
        livereload: true,
        port: randomPort,
        // ip:'192.168.11.62',//默认localhost:8080	
        // port:9909, //端口	
        middleware: function (connect, opt) {	// 配置代理（根据需求改）
            return [proxy("/api", {	
                target: "http://localhost:8080",	
                changeOrigin: true	
            }),	
            proxy("/otherServer", {	
                target: "http://IP:Port",	
                changeOrigin: true	
            })];	
        }
    });
}
const watchTask = gulp.parallel(connectServer, function () {
    gulp.watch(Paths.src.views, compileHtml);
    gulp.watch(Paths.src.views, moveViews);
    gulp.watch(Paths.src.font + "**/*", font);
    gulp.watch(Paths.src.css + "**/*.scss", gulp.parallel(prefixerCss, libsCssMin));
    gulp.task(Paths.src.images + "**/*", imageMin);  
    gulp.watch(Paths.src.script + "**/*",  gulp.parallel(scriptbabel, libsScriptMin));
});
 
	
module.exports = {	
    compileHtml,	
    moveViews,
    font,
    prefixerCss,	
    libsCssMin,	
    scriptbabel,	
    libsScriptMin,
    imageMin,	
    cleanDir,	
    connectServer,
    watchTask	
};