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

var RadioButton = function RadioButton(_ref) {
    var label = _ref.label,
        disabled = _ref.disabled,
        isChecked = _ref.isChecked,
        primaryColor = _ref.primaryColor,
        style = _ref.style,
        checkedStyle = _ref.checkedStyle,
        labelStyle = _ref.labelStyle,
        rest = _objectWithoutProperties(_ref, ['label', 'disabled', 'isChecked', 'primaryColor', 'style', 'checkedStyle', 'labelStyle']);

    style = _extends({
        backgroundColor: 'white',
        borderColor: _colors.silver,
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        fontSize: 16,
        height: 16,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 4,
        marginTop: 0,
        outline: 'none',
        textAlign: 'center',
        width: 16,
        MozAppearance: 'none',
        WebkitAppearance: 'none'
    }, style);

    labelStyle = _extends({}, _typography.text, {
        alignItems: 'center',
        display: 'flex',
        height: 16,
        lineHeight: '16px',
        opacity: disabled ? 0.5 : 1,
        position: 'relative'
    }, labelStyle);

    var markStyle = {
        backgroundColor: disabled ? _colors.silver : primaryColor,
        borderRadius: 4,
        display: isChecked ? 'block' : 'none',
        height: 8,
        left: 4,
        position: 'absolute',
        top: 4,
        width: 8
    };

    return _react2.default.createElement(
        'label',
        { style: labelStyle },
        _react2.default.createElement('input', _extends({ type: 'radio', disabled: disabled, checked: isChecked, style: style }, rest)),
        ' ',
        label,
        _react2.default.createElement('div', { style: markStyle })
    );
};

RadioButton.propTypes = {
    isChecked: _react.PropTypes.bool,
    primaryColor: _react.PropTypes.string,
    style: _react.PropTypes.object,
    checkedStyle: _react.PropTypes.object,
    labelStyle: _react.PropTypes.object
};

RadioButton.defaultProps = {
    primaryColor: 'tomato',
    isChecked: false
};

exports.default = RadioButton;