const shell = require('shelljs');

//执行一遍npm run build
shell.exec('yarn run tsc');

//删除demo/node_modules的所有文件
//shell.rm('-rf', 'demo/node_modules');

//进入demo目录
shell.cd('demo');

//删除node_modules/.vite的所有文件
shell.rm('-rf', 'node_modules/.vite');

//删除node_modules/@uni-helper/galanga的所有文件
shell.rm('-rf', 'node_modules/@uni-helper/galanga');

//删除node_modules/.yarn-integrity这个单文件
shell.rm('-rf', 'node_modules/.yarn-integrity');

//安装demo/node_modules
shell.exec('yarn');

//启动demo
shell.exec('yarn run dev');