'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var NavBar = function NavBar(_ref) {
    var style = _ref.style,
        children = _ref.children,
        rest = _objectWithoutProperties(_ref, ['style', 'children']);

    var leftStyle = style.left,
        centerStyle = style.center,
        rightStyle = style.right,
        containerStyle = _objectWithoutProperties(style, ['left', 'center', 'right']);

    containerStyle = _extends({}, NavBar.defaultStyles.container, containerStyle);

    leftStyle = _extends({}, NavBar.defaultStyles.left, leftStyle);

    centerStyle = _extends({}, NavBar.defaultStyles.center, centerStyle);

    rightStyle = _extends({}, NavBar.defaultStyles.right, rightStyle);

    if (!children) {
        children = [];
    }

    return _react2.default.createElement(
        'div',
        _extends({ style: containerStyle }, rest),
        _react2.default.createElement(
            'div',
            { style: leftStyle },
            children[0]
        ),
        _react2.default.createElement(
            'div',
            { style: centerStyle },
            children[1]
        ),
        _react2.default.createElement(
            'div',
            { style: rightStyle },
            children[2]
        )
    );
};

NavBar.defaultProps = {
    style: {}
};

NavBar.defaultStyles = {
    container: {
        alignItems: 'center',
        background: '#EEEEEE',
        display: 'flex',
        flex: 'none',
        height: 60
    },
    left: {
        flex: '1 0 0',
        paddingRight: 20,
        paddingLeft: 40
    },
    center: {
        flex: 'none'
    },
    right: {
        alignItems: 'center',
        display: 'flex',
        flex: '1 0 0',
        justifyContent: 'flex-end',
        paddingRight: 40,
        paddingLeft: 20
    }
};

exports.default = NavBar;