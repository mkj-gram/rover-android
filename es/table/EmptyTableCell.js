'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TableCell = require('./TableCell');

var _TableCell2 = _interopRequireDefault(_TableCell);

var _colors = require('../../styles/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var EmptyTableCell = function EmptyTableCell(_ref) {
    var style = _ref.style,
        rest = _objectWithoutProperties(_ref, ['style']);

    var loadingIndicatorStyle = style.loadingIndicator,
        containerStyle = _objectWithoutProperties(style, ['loadingIndicator']);

    loadingIndicatorStyle = _extends({}, EmptyTableCell.defaultStyles.loadingIndicator, loadingIndicatorStyle);

    return _react2.default.createElement(
        _TableCell2.default,
        _extends({ style: containerStyle }, rest),
        _react2.default.createElement('div', { style: loadingIndicatorStyle })
    );
};

EmptyTableCell.defaultStyles = {
    loadingIndicator: {
        background: _colors.cloud,
        height: 16,
        margin: '22px 0'
    }
};

EmptyTableCell.defaultProps = {
    style: {}
};

exports.default = EmptyTableCell;