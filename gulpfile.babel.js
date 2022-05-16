import gulp from "gulp";
import deploy from "./src/configs/tasks/deploy.js";

gulp.task('deploy', deploy.deploySync);
gulp.task('deploy:create', deploy.deployCreate);

export default deploy.deployCreate;
