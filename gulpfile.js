const gulp = require("gulp");	
 
	
// 根据环境引入不同的配置文件	
let buildConfig;	

if (process.env.NODE_ENV === "dev") {	
    buildConfig = require("./build/gulp.dev");		
    gulp.task("server", buildConfig.watchTask);  // 本地服务  	
} else {	
    buildConfig = require("./build/gulp.prod");		      	
}	
 
gulp.task("clean", buildConfig.cleanDir);    // 清理目录 	
gulp.task("html", buildConfig.compileHtml); // 打包html	
gulp.task("views", buildConfig.moveViews); // 移动views到打包的dev环境中，方便后台也是用公共模板修改	
gulp.task("font", buildConfig.font); // 打包font
gulp.task("jsBabel", buildConfig.scriptbabel); // 打包js	
gulp.task("jsLibsMin", buildConfig.libsScriptMin);  // 打包js	
gulp.task("prefixerCss", buildConfig.prefixerCss);  // 打包css	
gulp.task("libsCssMin", buildConfig.libsCssMin);   // 打包css	
gulp.task("images", buildConfig.imageMin);   // 打包image	
	
 
	
	
if (process.env.NODE_ENV === "dev") { // dev
    // dev命令 这里需要移动views目录
    gulp.task("sources", gulp.series("html", "views", gulp.parallel("font", "jsBabel", "jsLibsMin", "prefixerCss", "libsCssMin", "images")));
    // 都需要清除上次打包的目录内容
    gulp.task("dev", gulp.series("clean", "sources", "server"));	
} else { // build	
    gulp.task("sources", gulp.series("html", gulp.parallel("font", "jsBabel", "jsLibsMin", "prefixerCss", "libsCssMin", "images")));
    gulp.task("build", gulp.series("clean", "sources"));	
}