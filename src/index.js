/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { stringifyRequest } from 'loader-utils'

/**
 * 不要在 loader 模块里写绝对路径，因为当项目根路径变了，这些路径会干扰 webpack 计算 hash（把 module 的路径转化为 module 的引用 id）
 * stringifyRequest 方法，它可以把绝对路径转化为相对路径
 */

module.exports = function loader() {}
module.exports.pitch = function pitch(request) {
  // 参数request是文件的路径
  // /Users/workspace/code/node_modules/happypack/loader.js?id=moduleScss!/Users/workspace/code/src/components/IsoScssTable/style.iso.scss

  // stringifyRequest(this, `!!${request}`)
  // "!!../../../node_modules/happypack/loader.js?id=moduleScss!./style.iso.scss"

  if (this.cacheable) {
    this.cacheable()
  }

  // 引入的css，简单的形式是这样的
  /*
  // css = [[moduleId, css, media, sourceMap]]]
  css = [[
    module.id,
    '\".WhXKs {\\n  position: relative;\\n  margin: 0.1rem auto;\\n  width: 3rem;\\n  height: 3rem;\\n  background-color: white;\\n  border-radius: 0.1rem;\\n}\\n\\n.Ieb94 {\\n  position: relative;\\n  width: 100%;\\n  height: 1rem;\\n  margin: 0 auto;\\n  font-size: 0.2rem;\\n  font-weight: bold;\\n  color: black;\\n  text-align: center;\\n  line-height: 1rem;\\n}\"'
    ''
  ]],
  css.locals = {
    "fssrisocsstable": "WhXKs",
    "fssrisocsstabletext": "Ieb94"
  }
  */
  // 这里的css经过node_modules/css-loader/lib/css-base.js的处理
  // 在执行 toString 方法的时候，会输出样式

  // 这里将输出进行了转化
  // 将默认的输出更改为 css.locals，供组件内进行classname的替换
  // 并且提供函数，供外界插入对应的css
  const insertCss = require.resolve('./insertCss.js')
  return `
    var refs = 0;
    var css = require(${stringifyRequest(this, `!!${request}`)});
    var insertCss = require(${stringifyRequest(this, `!${insertCss}`)});
    var content = typeof css === 'string' ? [[module.id, css, '']] : css;

    exports = module.exports = css.locals || {};
    exports._getContent = function() { return content; };
    exports._getCss = function() { return '' + css; };
    exports._insertCss = function(options) { return insertCss(content, options) };

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    // Only activated in browser context
    if (module.hot && typeof window !== 'undefined' && window.document) {
      var removeCss = function() {};
      module.hot.accept(${stringifyRequest(this, `!!${request}`)}, function() {
        css = require(${stringifyRequest(this, `!!${request}`)});
        content = typeof css === 'string' ? [[module.id, css, '']] : css;
        removeCss = insertCss(content, { replace: true });
      });
      module.hot.dispose(function() { removeCss(); });
    }
  `
}
