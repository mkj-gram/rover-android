'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _colors = require('../../styles/colors');

var _typography = require('../../styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Select = function Select(_ref) {
    var isDisabled = _ref.isDisabled,
        style = _ref.style,
        children = _ref.children,
        rest = _objectWithoutProperties(_ref, ['isDisabled', 'style', 'children']);

    style = _extends({
        backgroundColor: 'transparent',
        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSI2cHgiIHZpZXdCb3g9IjEgNCAxMSA2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPiA8cG9seWdvbiBzdHJva2U9Im5vbmUiIGZpbGw9IiNCQ0JDQkMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgcG9pbnRzPSIxMSA0IDEgNCA2IDkgMTEgNCAxMSA0IDExIDQiPjwvcG9seWdvbj48L3N2Zz4=")',
        backgroundPosition: 'right 2px center',
        backgroundRepeat: 'no-repeat',
        borderColor: _colors.titanium,
        borderRadius: 0,
        borderStyle: 'solid',
        borderWidth: '0 0 1px 0',
        color: _colors.graphite,
        display: 'block',
        fontFamily: '"Source Sans Pro", serif',
        fontSize: 16,
        fontWeight: 400,
        outline: 'none',
        padding: '3px 24px 3px 0',
        width: '100%',
        WebkitAppearance: 'none',
        MozAppearance: 'none'
    }, style);

    if (isDisabled) {
        style.opacity = 0.5;
    }

    return _react2.default.createElement(
        'select',
        _extends({ disabled: isDisabled, style: style }, rest),
        children
    );
};

Select.propTypes = {
    style: _react.PropTypes.object
};

Select.defaultProps = {};

exports.default = Select;