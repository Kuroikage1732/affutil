# affutil.js
~~一个照抄 [feightwywx/arcfutil](https://github.com/feightwywx/arcfutil) aff模块 的 Node.js模块 in Typescript~~

* 可以进行aff格式字符串与Javascript对象之间的相互转换
* 为Note对象提供了有限的方法

**恐狼是神，快去用arcfutil**

## 用法
### 导入：
#### In Node.js:
```javascript
// CommonJS
var aff = require("affutil");

// ES6 or later
import aff from 'affutil';
```

#### In a browser:
```html
<script src="affutil.js"></script>

<script>
    var aff = affutil;
</script>
```

### 示例
```javascript
var affstr = `
AudioOffset:5
-
timing(0,210.00,4.00);
hold(0,500,1);
(0,4);
(285,2);
arc(571,1071,1.00,1.00,s,1.00,1.00,1,none,false);
`
var affobj = aff.parse(affstr);
console.log(affobj);
```
详细示例请移步 [sample.js](./sample.js)

## 感谢
*感谢恐狼同意将本项目公开*

本项目所使用的开源项目
* [Node.js](https://nodejs.org/)
* [/feightwywx/arcfutil](https://github.com/feightwywx/arcfutil)
* [Lodash](https://github.com/lodash/lodash)
* [easings.net](https://easings.net/)
* [WebKit](https://webkit.org/)