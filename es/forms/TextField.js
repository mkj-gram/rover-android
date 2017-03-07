'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Label = require('./Label');

var _Label2 = _interopRequireDefault(_Label);

var _colors = require('../../styles/colors');

var _typography = require('../../styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var TextField = function (_Component) {
    _inherits(TextField, _Component);

    function TextField(props) {
        _classCallCheck(this, TextField);

        var _this = _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).call(this, props));

        _this.state = {
            isFocused: false
        };

        _this.onFocus = _this.onFocus.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    _createClass(TextField, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                label = _props.label,
                disabled = _props.disabled,
                style = _props.style,
                onFocus = _props.onFocus,
                onBlur = _props.onBlur,
                onChange = _props.onChange,
                rest = _objectWithoutProperties(_props, ['label', 'disabled', 'style', 'onFocus', 'onBlur', 'onChange']);

            var _state = this.state,
                isFocused = _state.isFocused,
                isPresent = _state.isPresent;

            var containerStyle = style.container,
                focusStyle = style.focus,
                disabledStyle = style.disabled,
                labelStyle = style.label,
                presentLabelStyle = style.presentLabel,
                inputStyle = _objectWithoutProperties(style, ['container', 'focus', 'disabled', 'label', 'presentLabel']);

            containerStyle = _extends({}, TextField.defaulStyles.container, containerStyle);

            inputStyle = _extends({}, TextField.defaulStyles.input, inputStyle);

            focusStyle = _extends({}, TextField.defaulStyles.focus, focusStyle);

            disabledStyle = _extends({}, TextField.defaulStyles.disabled, disabledStyle);

            labelStyle = _extends({}, TextField.defaulStyles.label, labelStyle);

            presentLabelStyle = _extends({}, TextField.defaulStyles.presentLabel, presentLabelStyle);

            if (isFocused) {
                inputStyle = _extends({}, inputStyle, focusStyle);
            }

            if (disabled) {
                inputStyle = _extends({}, inputStyle, disabledStyle);
            }

            if (isPresent) {
                labelStyle = _extends({}, labelStyle, presentLabelStyle);
            }

            var input = _react2.default.createElement('input', _extends({ ref: function ref(e) {
                    return _this2.input = e;
                }, disabled: disabled, style: inputStyle, onFocus: this.onFocus, onBlur: this.onBlur, onChange: this.onChange }, rest));

            if (!label) {
                return input;
            }

            return _react2.default.createElement(
                'div',
                { style: containerStyle },
                _react2.default.createElement(
                    _Label2.default,
                    { style: labelStyle },
                    'Name'
                ),
                input
            );
        }
    }, {
        key: 'onFocus',
        value: function onFocus(event) {
            this.setState({
                isFocused: true
            });

            this.props.onFocus(event);
        }
    }, {
        key: 'onBlur',
        value: function onBlur(event) {
            this.setState({
                isFocused: false
            });

            this.props.onBlur(event);
        }
    }, {
        key: 'onChange',
        value: function onChange(event) {
            this.setState({
                isPresent: Boolean(event.target.value)
            });

            this.props.onChange(event);
        }
    }, {
        key: 'getInput',
        value: function getInput() {
            return this.input;
        }
    }]);

    return TextField;
}(Component);

TextField.defaulStyles = {
    container: {
        paddingTop: 18,
        position: 'relative'
    },
    input: _extends({}, _typography.unselectable, {
        background: 'none',
        border: 'none',
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
        padding: '3px 0',
        width: '100%'
    }),
    focus: {
        borderColor: _colors.graphite
    },
    disabled: {
        color: _colors.titanium
    },
    label: {
        transition: 'top 0.1s, font-size 0.1s',
        fontSize: 16,
        pointerEvents: 'none',
        position: 'absolute',
        top: 22
    },
    presentLabel: {
        fontSize: 14,
        top: 0
    }
};

TextField.defaultProps = {
    style: {},
    onFocus: function onFocus() {
        return null;
    },
    onBlur: function onBlur() {
        return null;
    },
    onChange: function onChange() {
        return null;
    }
};

exports.default = TextField;