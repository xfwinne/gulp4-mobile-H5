const gulp = require("gulp");		
const clean = require("gulp-clean"); // 清理目录		
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
        css: "src/style/",
        cssLib: "src/style/libs/*.css",
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
        .pipe(gulp.dest(dist + "/static")); // 拷贝
}
const compileHtml = gulp.series(compileHtmlTemp, function () {
    return del([dist + "/static/" + "public"]);
});

// font
function font () {
    return gulp.src(Paths.src.font + "**/*")
        .pipe(gulp.dest(dist + "/font"));
}
	
// css	
function lintcss () {
    return gulp.src(Paths.src.css + "**/*.scss")
        .pipe(cache(stylelint({
            reporters: [{
                formatter: "string",
                console: true
            }]
        })));
}

const prefixerCss =  gulp.series(lintcss, function () {
    return gulp.src(Paths.src.css + "style.scss")
        .pipe(sass({
            outputStyle: "compressed"
        }).on("error", sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(dist + "/css")); //当前对应css文件	
});

function libsCssMin () {
    return gulp.src(Paths.src.cssLib)
        .pipe(concat("core.css"))
        .pipe(cleanCSS())
        .pipe(rename({suffix: ".min"})) //rename压缩后的文件名
        .pipe(gulp.dest(dist + "/css")); //当前对应css文件	
} 
	
// js	
function libsScriptConcat () {
    return gulp.src(Paths.src.scriptLib)
        .pipe(concat("core.js"))
        .pipe(uglify())
        .pipe(rename({suffix: ".min"})) //rename压缩后的文件名 
        .pipe(gulp.dest(dist + "/js")); // 拷贝
}
const libsScriptMin = gulp.parallel(libsScriptConcat, function () {
    return gulp.src(Paths.src.script + "jquery.js")
        .pipe(rename({suffix: ".min"})) //rename压缩后的文件名 
        .pipe(gulp.dest(dist + "/js")); // 拷贝
});

function jseslint () {
    return gulp.src(Paths.src.script + "es6/*.js")
        .pipe(cache(eslint()))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

const scriptbabel = gulp.series(jseslint, function () {
    return gulp.src(Paths.src.script + "es6/*.js")
        .pipe(babel({
            presets: ["@babel/preset-env"]
            // presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dist + "/js")); // 拷贝
});		
 
	
// image	
function imageMin () {
    return gulp.src(Paths.src.images + "**/*")
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
 
	
module.exports = {	
    compileHtml,	
    font,
    prefixerCss,	
    libsCssMin,	
    scriptbabel,	
    libsScriptMin,
    imageMin,	
    cleanDir
};	