'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _typography = require('../../styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TableCell = function TableCell(_ref) {
    var isFirst = _ref.isFirst,
        isLast = _ref.isLast,
        isHead = _ref.isHead,
        style = _ref.style,
        children = _ref.children;

    var firstStyle = style.first,
        lastStyle = style.last,
        headStyle = style.head,
        containerStyle = _objectWithoutProperties(style, ['first', 'last', 'head']);

    containerStyle = _extends({}, TableCell.defaultStyles.container, containerStyle);

    firstStyle = _extends({}, TableCell.defaultStyles.first, firstStyle);

    lastStyle = _extends({}, TableCell.defaultStyles.last, lastStyle);

    headStyle = _extends({}, TableCell.defaultStyles.head, headStyle);

    if (isFirst) {
        containerStyle = _extends({}, containerStyle, firstStyle);
    }

    if (isLast) {
        containerStyle = _extends({}, containerStyle, lastStyle);
    }

    if (isHead) {
        containerStyle = _extends({}, containerStyle, headStyle);
    }

    return _react2.default.createElement(
        'div',
        { className: 'TableCell', style: containerStyle },
        children
    );
};

TableCell.defaultStyles = {
    container: _extends({}, _typography.text, _typography.truncate, {
        lineHeight: '60px',
        padding: '0 10px'
    }),
    first: {
        paddingLeft: 60
    },
    last: {
        paddingRight: 60
    },
    head: {
        lineHeight: '50px'
    }
};

TableCell.defaultProps = {
    isFirst: false,
    isLast: false,
    isHead: false,
    style: {}
};

exports.default = TableCell;