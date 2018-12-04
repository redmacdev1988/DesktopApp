var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');
 
gulp.task('default', function() {
    nodemon({
        script: 'index',  //what to run
        ext: 'js',  //what to watch for
        env: {
            PORT: 3000
        },
        ignore: ['./node_modules/**']
    })
    .on('restart', function() {
        console.log('restarting');
    });
});