'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Anchor = require('./Anchor');

var _Anchor2 = _interopRequireDefault(_Anchor);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var AddButton = function (_Component) {
    _inherits(AddButton, _Component);

    function AddButton() {
        _classCallCheck(this, AddButton);

        return _possibleConstructorReturn(this, (AddButton.__proto__ || Object.getPrototypeOf(AddButton)).apply(this, arguments));
    }

    _createClass(AddButton, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                primaryColor = _props.primaryColor,
                onClick = _props.onClick;
            var _props$style = this.props.style,
                style = _props$style === undefined ? {} : _props$style;


            style = {

                root: _extends({
                    background: primaryColor,
                    borderRadius: 4,
                    display: 'inline-block',
                    height: 24,
                    marginRight: 10,
                    padding: 4,
                    width: 24
                }, style.root),

                icon: _extends({
                    display: 'block',
                    fill: 'white'
                }, style.icon)
            };

            return _react2.default.createElement(
                _Anchor2.default,
                { style: style.root, onClick: onClick },
                _react2.default.createElement(_Icon2.default, { type: 'plus-sign', style: style.icon })
            );
        }
    }]);

    return AddButton;
}(Component);

AddButton.defaultProps = {
    primaryColor: 'tomato',
    onClick: function onClick() {
        return null;
    }
};

exports.default = AddButton;