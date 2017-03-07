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

var Checkbox = function Checkbox(_ref) {
    var isChecked = _ref.isChecked,
        isDisabled = _ref.isDisabled,
        label = _ref.label,
        primaryColor = _ref.primaryColor,
        style = _ref.style,
        checkedStyle = _ref.checkedStyle,
        labelStyle = _ref.labelStyle,
        rest = _objectWithoutProperties(_ref, ['isChecked', 'isDisabled', 'label', 'primaryColor', 'style', 'checkedStyle', 'labelStyle']);

    style = _extends({
        backgroundColor: 'white',
        borderColor: _colors.silver,
        borderRadius: 3,
        borderStyle: 'solid',
        borderWidth: 2,
        fontSize: 16,
        height: 14,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 4,
        marginTop: 0,
        outline: 'none',
        textAlign: 'center',
        width: 14,
        MozAppearance: 'none',
        WebkitAppearance: 'none'
    }, style);

    if (isChecked) {
        style = _extends({}, style, {
            backgroundColor: primaryColor,
            borderWidth: 0
        }, checkedStyle);
    }

    labelStyle = _extends({}, _typography.text, _typography.semibold, {
        alignItems: 'center',
        display: 'flex',
        fontSize: 11,
        height: 14,
        lineHeight: '14px',
        opacity: isDisabled ? 0.5 : 1,
        position: 'relative'
    }, labelStyle);

    var markStyle = {
        color: 'white',
        fontSize: 11,
        left: 4,
        lineHeight: '14px',
        position: 'absolute',
        top: 0

    };

    return _react2.default.createElement(
        'label',
        { style: labelStyle },
        _react2.default.createElement('input', _extends({ type: 'checkbox', checked: isChecked, style: style, disabled: isDisabled }, rest)),
        ' ',
        label,
        _react2.default.createElement(
            'div',
            { style: markStyle },
            '\u2713'
        )
    );
};

Checkbox.propTypes = {
    isChecked: _react.PropTypes.bool,
    primaryColor: _react.PropTypes.string,
    style: _react.PropTypes.object,
    checkedStyle: _react.PropTypes.object,
    labelStyle: _react.PropTypes.object
};

Checkbox.defaultProps = {
    primaryColor: 'tomato',
    isChecked: false
};

exports.default = Checkbox;