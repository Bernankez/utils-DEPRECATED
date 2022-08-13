# 迁移至[VueDemo](https://github.com/Bernankez/VueDemo)

***

# utils

建这个仓库起因是想记录一下平常经常用到的方法并提取成utils工具函数。不想搞得太复杂所以选择搭建纯Node + TypeScript环境。记录一下搭建过程及遇到的坑。

***

1. 在本地新建utils目录，在utils目录下运行npm init初始化项目，我初始化的 package.json如下：

   ```json
   {
       "name": "utils",
       "version": "0.0.1",
       "main": "main.ts",
       "scripts": {},
       "author": "cole",
       "license": "MIT"
   }
   ```

2. 按需添加prettier配置```.prettierrc```，```.gitignore```，```README```等。网上很多人说使用tsc要全局安装typescript，实际上不用全局安装（我也不喜欢全局安装），node会优先查找你项目下的包命令。我这里选用ts-node作为typescript的编译加运行环境，nodemon监测文件改动，实现开发时的实时编译效果。build时使用tsc。具体可参考[Node.js QuickStart](https://basarat.gitbook.io/typescript/nodejs)。此时我的package.json多了以下内容：

   ```json
   "scripts": {
       "dev:mac": "npm run build:mac",
       "dev:windows": "npm run build:windows",
       "build": "tsc -p .",
       "build:mac": "nodemon --watch './**/*.ts' --exec \"ts-node\" ./main.ts",
       "build:windows": "nodemon --watch ./**/*.ts --exec \"ts-node\" ./main.ts",
   },
   "devDependencies": {
       "@types/node": "^16.11.7",
       "nodemon": "^2.0.15",
       "ts-node": "^10.4.0",
       "typescript": "^4.4.4"
   }
   ```

   同时添加tsconfig.json文件：

   ```json
   {
       "compilerOptions": {
           "target": "esnext",
           "useDefineForClassFields": true,
           "module": "esnext",
           "moduleResolution": "node",
           "strict": true,
           "jsx": "preserve",
           "sourceMap": true,
           "noImplicitAny": false,
           "resolveJsonModule": true,
           "esModuleInterop": true,
           "lib": ["esnext", "dom"],
           "baseUrl": "./",
           "paths": {
               "@/*": ["*"]
           }
       },
       "include": ["./**/*.ts", "./**/*.d.ts", "./**/*.tsx"]
   }
   ```

   baseUrl和paths需要根据目录结构按需配置，我这里的入口文件是根目录下的main.ts。

3. 这时```npm start```就已经可以运行main.ts了，但是如果我们在main.ts中使用import，即es module语法，会报```Cannot use import statement outside a module```错。根据[搭建一套支持TS的Node运行环境](https://www.jianshu.com/p/0d106171c1e9)这篇文章，修改tsconfig中的如下配置：

   ```json
   "compilerOptions": {
       "module": "CommonJs",
       "types": ["node"],
   }
   ```

4. 最后，当我们在main.ts中使用别名时：```import Paging from '@/index'```，会报错```Cannot find module '@/index'```，因为ts-node无法识别tsconfig中配置的baseUrl以及paths。根据[ts-node 的那些坑](https://zhuanlan.zhihu.com/p/270592378)，[tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths)这两篇文章，安装tsconfig-paths包，并修改相应scripts，修改地方如下：

   ```json
   "scripts": {
       "build:mac": "nodemon --watch './**/*.ts' --exec \"ts-node -r tsconfig-paths/register\" main.ts",
       "build:windows": "nodemon --watch ./**/*.ts --exec \"ts-node -r tsconfig-paths/register\" main.ts"
   },
   "devDependencies": {
       "tsconfig-paths": "^3.11.0",
   }
   ```

5. 此时运行`npm run dev:mac`或`npm run dev:windows`已经可以监测改动并实时编译。

***

   之后可能会为每个功能类单独写demo页面展示效果，不过目前还没打算动手。

