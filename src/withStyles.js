/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react'

// https://www.npmjs.com/package/hoist-non-react-statics
// Copies non-react specific statics from a child component to a parent component
// Similar to Object.assign, but with React static keywords blacklisted from being overridden
import hoistStatics from 'hoist-non-react-statics'

import StyleContext from './StyleContext'

function withStyles(...styles) {
  return function wrapWithStyles(ComposedComponent) {
    class WithStyles extends React.PureComponent {
      constructor(props, context) {
        super(props, context)
        // 调用context上的insertCss方法
        // 服务器端获取css
        // 客户端插入style标签
        this.removeCss = context.insertCss(...styles)
      }

      componentWillUnmount() {
        if (this.removeCss) {
          setTimeout(this.removeCss, 0)
        }
      }

      render() {
        return <ComposedComponent {...this.props} />
      }
    }

    const displayName = ComposedComponent.displayName || ComposedComponent.name || 'Component'

    WithStyles.displayName = `WithStyles(${displayName})`
    WithStyles.contextType = StyleContext
    WithStyles.ComposedComponent = ComposedComponent

    return hoistStatics(WithStyles, ComposedComponent)
  }
}

export default withStyles
