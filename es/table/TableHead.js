'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableHead = function TableHead(_ref) {
    var style = _ref.style,
        children = _ref.children;


    var containerStyle = _extends({}, TableHead.defaultStyles.container, style);

    children = _react2.default.Children.map(children, function (element) {
        return (0, _react.cloneElement)(element, {
            isHead: true
        });
    });

    return _react2.default.createElement(
        'div',
        { className: 'TableHead', style: containerStyle },
        children
    );
};

TableHead.defaultStyles = {
    container: {
        flex: 'none',
        height: 65
    }
};

TableHead.defaultProps = {
    style: {}
};

exports.default = TableHead;