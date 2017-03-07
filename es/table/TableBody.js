'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('../../styles/layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableBody = function TableBody(_ref) {
    var style = _ref.style,
        children = _ref.children;


    var containerStyle = _extends({}, TableBody.defaultStyles.container, style);

    return _react2.default.createElement(
        'div',
        { className: 'TableBody', style: containerStyle },
        children
    );
};

TableBody.defaultStyles = {
    container: _extends({}, _layout.scrollContainer, {
        position: 'relative'
    })
};

TableBody.defaultProps = {
    style: {}
};

exports.default = TableBody;