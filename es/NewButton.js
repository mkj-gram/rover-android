'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AddButton = require('./AddButton');

var _AddButton2 = _interopRequireDefault(_AddButton);

var _Anchor = require('./Anchor');

var _Anchor2 = _interopRequireDefault(_Anchor);

var _typography = require('../styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var NewButton = function (_Component) {
    _inherits(NewButton, _Component);

    function NewButton() {
        _classCallCheck(this, NewButton);

        return _possibleConstructorReturn(this, (NewButton.__proto__ || Object.getPrototypeOf(NewButton)).apply(this, arguments));
    }

    _createClass(NewButton, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                primaryColor = _props.primaryColor,
                style = _props.style,
                children = _props.children,
                onClick = _props.onClick;

            var buttonStyle = style.button,
                textStyle = style.text,
                containerStyle = _objectWithoutProperties(style, ['button', 'text']);

            containerStyle = _extends({}, NewButton.defaultStyles.container, containerStyle);

            buttonStyle = _extends({}, NewButton.defaultStyles.button, buttonStyle);

            textStyle = _extends({}, NewButton.defaultStyles.text, textStyle);

            return _react2.default.createElement(
                'div',
                { style: containerStyle },
                _react2.default.createElement(_AddButton2.default, { primaryColor: primaryColor, style: buttonStyle, onClick: onClick }),
                _react2.default.createElement(
                    _Anchor2.default,
                    { style: textStyle, onClick: onClick },
                    children
                )
            );
        }
    }]);

    return NewButton;
}(Component);

NewButton.defaultStyles = {
    container: {
        alignItems: 'center',
        display: 'flex'
    },
    button: {},
    text: _extends({}, _typography.text, _typography.large)
};

NewButton.defaultProps = {
    primaryColor: 'tomato',
    style: {},
    onClick: function onClick() {
        return null;
    }
};

exports.default = NewButton;