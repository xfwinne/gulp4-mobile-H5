### 前言
该架构只适合js代码较少的简单前端移动端模版的快速构建。

js代码支持es6写法，但是不支持es6的import和export模块化。

项目中的所有测试代码都可以删，目录建议不删，可自行判断需要留下哪些和替换哪些。

## 1.1 架构形式

主要采用 `gulp4 + jq + gulp-html-tpl模板` 技术进行开发 

## 1.2 环境搭建

- npm install  &emsp;&emsp;&emsp;  // 安装 `node_modules` , 载入相关依赖；

- npm run dev  &emsp;&emsp;  // 运行本地环境（同时生成dist目录）；

- npm run build	 &emsp;&emsp;  // 打包上线代码（生成dist目录）；

- npm run cssfix	 &emsp;&emsp;  // 自动修复scss；

- npm run scriptfix	 &emsp;&emsp;  // 自动修复js。但是测试没效果，暂时不用；

## 1.3 文件概述

- 文件情况（build目录是gulp配置文件分类）：

  - `config.js`：公共配置文件

  - `gulp.dev.js`：开发环境的gulp配置

  - `gulp.pros.js`：生产环境的gulp配置

- 文件情况（src目录--开发目录）：

	- `src/font/`: 字体图标
			
	- `src/images/`: 静态图片，建议还是先进行压缩后再放这里，压缩地址推荐：https://tinypng.com/

	- `src/script/`: js文件

			es6/：在此目录编写js代码，每个js文件都会被单独打包编译到dist/js/*.js中
			libs/：js的第三方插件库
			jquery.js: jq库
			
	- `src/style/`: css样式，sass语法

			common/：公共样式
			libs/：第三方css插件库
			module/：每个页面独有的模块样式
			style.scss：所以自己写的scss文件都在这里引入，将会被打包成一个style.css文件

	- `src/views/`: 页面html

			public/：     // 公共组件
			index.html:   // 首页
			// 其他文件夹都是自己建立的页面的html文件

	- `.editorconfig`: 编辑器规范配置文件
	- `.eslintrc`: js代码规范的配置文件
	- `.stylelintrc`: css样式规范规则配置（详细规则可看下面的`1.5 .stylelintrc文件规则说明`）
	- `gulpfile.js`:  gulp配置入口文件配置
	- `package.json`:  依赖包版本

## 1.4 代码规范

-  `目录及文件命名`：

	均使用小写字母，多个单词用中划线分隔

-  `代码书写规范` ： 

	js变量名使用驼峰式；
	css类名使用小写字母，多个单词使用中划线分隔；
	代码书写遵守eslint规范，详情看配置文件；

### 1.5 .stylelintrc文件规则说明

---

由于`.stylelintrc`文件不能注释，所以说明文件放在这里

```
"rules": {
	"color-no-invalid-hex": true, // 禁止无效的hex色值
	"function-calc-no-invalid": true, // 检测calc方法无效值
	"function-calc-no-unspaced-operator": true, // calc方法的值之间需要有有效的间距
	"function-linear-gradient-no-nonstandard-direction": true, // 检验渐变函数方向写法正确性
	"declaration-block-no-duplicate-properties": true, // 一个区块内不允许使用相同的属性
	"block-no-empty": true, // 禁止空样式
	"comment-no-empty": true, // 禁止空注释
	"no-duplicate-at-import-rules": true, // 禁止重复引用
	"no-duplicate-selectors": true, // 禁止重复选择器
	"no-extra-semicolons": true, // 禁止错误的分号
	"function-url-no-scheme-relative": true, // url引用的时候禁止无效的scheme值
	"shorthand-property-no-redundant-values": true, // 简写的时候不允许有冗余值
	"declaration-block-no-redundant-longhand-properties": true, // 能简写的属性需要简写
	"no-unknown-animations": true, // 引用未定义的animate
	"color-hex-case": 'lower', // 色值需要用小写
	"color-hex-length": 'short', // 色值需要用简写
	"function-comma-space-after": 'always', // 函数中逗号之后必须要有空格
	"function-comma-space-before": 'never', // 函数中逗号之前不要有空格
	"function-parentheses-space-inside": 'never', // 函数中，左括号右侧没有空格，右括号左侧没有空格
	"function-whitespace-after": 'always', // 函数之间需要空格
	"number-leading-zero": 'never', // 0.的小数不需要0
	"value-list-comma-space-after": 'always', // 只想允许单行值列表。并且您要在逗号前不加空格，在逗号后加一个空格
	"value-list-comma-space-before": 'never', // 只想允许单行值列表。并且您要在逗号前不加空格，在逗号后加一个空格
	"declaration-colon-space-after": 'always', // 值中冒号右边需要空格
	"declaration-colon-space-before": 'never', // 值中冒号左边需要空格
	"selector-attribute-brackets-space-inside": 'never', // 属性选择器中括号内没有空格
	"selector-pseudo-class-parentheses-space-inside": 'never', // 伪类选择器括号内没有空格
	"selector-list-comma-newline-after": 'always', // 多选择器逗号后需要有换行
	"media-feature-colon-space-after": 'always', // media选择冒号后需要空格
	"media-feature-colon-space-before": 'never', // media选择冒号前不需要空格
	"media-feature-parentheses-space-inside": 'never', // media选择左括号右侧无空格，右括号左侧无空格
	"media-feature-range-operator-space-after": 'always', // media判断符号右侧需要空格
	"media-feature-range-operator-space-before": 'always', // media判断符号左侧需要空格
	"indentation": 4 // 缩进要4个空格
}
```

## 1.6 gulp配置实现功能点
  
  1、可使用`gulp-html-tpl模板`写html公共部分
  
  2、支持es6大部分语法，暂不支持import和export
  
  3、配置eslint规则，自动检测js代码是否符合规范
  
  4、使用stylelint对css/scss代码进行规范管理
  
  5、gulp配置分开发环境和生产环境配置分离，易于理解
  





