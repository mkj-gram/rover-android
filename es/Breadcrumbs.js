'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Anchor = require('./Anchor');

var _Anchor2 = _interopRequireDefault(_Anchor);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _typography = require('../styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Breadcrumbs = function Breadcrumbs(_ref) {
    var primaryColor = _ref.primaryColor,
        items = _ref.items,
        style = _ref.style;

    var anchorStyle = style.anchor,
        spanStyle = style.span,
        iconStyle = style.icon,
        containerStyle = _objectWithoutProperties(style, ['anchor', 'span', 'icon']);

    containerStyle = _extends({}, Breadcrumbs.deafultStyles.container, containerStyle);

    anchorStyle = _extends({}, Breadcrumbs.deafultStyles.anchor, anchorStyle);

    spanStyle = _extends({}, Breadcrumbs.deafultStyles.span, spanStyle);

    iconStyle = _extends({}, Breadcrumbs.deafultStyles.icon, iconStyle);

    var children = [];

    var isLast = function isLast(i) {
        return i === items.length - 1;
    };

    items.forEach(function (item, index) {
        if (item.to) {
            children.push(_react2.default.createElement(
                _Anchor2.default,
                { key: 'anchor-' + index, to: item.to, primaryColor: primaryColor, style: anchorStyle },
                item.name
            ));
        } else {
            children.push(_react2.default.createElement(
                'span',
                { key: 'span-' + index, style: spanStyle },
                item.name
            ));
        }

        if (!isLast(index)) {
            children.push(_react2.default.createElement(_Icon2.default, { key: 'icon-' + index, type: 'chevron-right', style: iconStyle }));
        }
    });

    return _react2.default.createElement(
        'div',
        { style: containerStyle },
        children
    );
};

Breadcrumbs.defaultProps = {
    items: [],
    style: {}
};

Breadcrumbs.deafultStyles = {
    container: _extends({}, _typography.text, {
        alignItems: 'center',
        display: 'flex',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    }),
    anchor: {
        flex: '0 0 auto'
    },
    span: _extends({}, _typography.truncate, {
        flex: '0 1 auto'
    }),
    icon: {
        flex: 'none',
        margin: '0 4px'
    }
};

exports.default = Breadcrumbs;