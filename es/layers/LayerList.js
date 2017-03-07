'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _typography = require('../../../common/styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var LayerList = function LayerList(_ref) {
    var style = _ref.style,
        children = _ref.children,
        rest = _objectWithoutProperties(_ref, ['style', 'children']);

    style = _extends({
        borderRadius: 5,
        background: 'white'
    }, style);

    var titleStyle = _extends({}, _typography.text, {
        fontSize: 16,
        height: 56,
        lineHeight: '56px',
        paddingLeft: 18
    });

    return _react2.default.createElement(
        'div',
        _extends({ style: style }, rest),
        _react2.default.createElement(
            'div',
            { style: titleStyle },
            'Layers'
        ),
        children
    );
};

exports.default = LayerList;