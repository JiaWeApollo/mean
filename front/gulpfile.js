var gulp = require('gulp');
connect = require('gulp-connect');
var livereload = require("gulp-livereload");
var smushit = require('gulp-smushit');
console.log(smushit);

gulp.task("watch",function(){

    livereload.listen(35732, function(err) {
        if(err) return console.log(err);
    });

    // app/**/*.*的意思是 app文件夹下的 任何文件夹 的 任何文件
    gulp.watch(['app/**/*.*','css/**/*.*','tpl/**/*.*','img/**/*.*'], function (file) {
        livereload.changed(file.path);
    });
});
gulp.task('connect',function(){
    connect.server({
        // root:'app',//根目录
        port: 8023,//端口号
        livereload:true
    });
});

gulp.task('smushit', function () {
    return gulp.src('img/test/*.{jpg,png}')
        .pipe(smushit())
        .pipe(gulp.dest('smushit-dist'));
});

//运行Gulp时，默认的Task
gulp.task('default',['connect','watch']);
// gulp.task('default',['connect']);


