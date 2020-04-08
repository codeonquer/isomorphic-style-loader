/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// 服务器端初始化
/*
const css = new Set() // CSS for all rendered React components
const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()))
*/

// 客户端初始化
/*
const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  return () => removeCss.forEach(dispose => dispose())
}
*/

// 其实可见，insertCss是一个函数，用来提取对应的css内容
import React from 'react'

const StyleContext = React.createContext({
  insertCss: null,
})

export default StyleContext
