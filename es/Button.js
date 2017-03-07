'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _colors = require('../styles/colors');

var _typography = require('../styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_Component) {
    _inherits(Button, _Component);

    function Button(props) {
        _classCallCheck(this, Button);

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

        _this.state = {
            didClick: false
        };

        _this.onClick = _this.onClick.bind(_this);
        return _this;
    }

    _createClass(Button, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            if (this.timeoutID) {
                window.clearTimeout(this.timeoutID);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                image = _props.children,
                color = _props.color,
                height = _props.height,
                horizontalAlignment = _props.horizontalAlignment,
                imageInsets = _props.imageInsets,
                style = _props.style,
                title = _props.title,
                width = _props.width;


            var padding = function padding(insets) {
                return insets.reduce(function (padding, inset) {
                    return padding + ' ' + inset + 'px';
                }, '');
            };

            var justifyContent = void 0;
            switch (horizontalAlignment) {
                case 'left':
                    justifyContent = 'flex-start';
                    break;
                case 'right':
                    justifyContent = 'flex-end';
                    break;
                case 'center':
                    justifyContent = 'center';
                    break;
                default:
                    justifyContent = image ? 'flex-start' : 'center';
                    break;
            }

            return _react2.default.createElement(
                'div',
                {
                    onClick: this.onClick,
                    style: _extends({
                        animation: this.state.didClick ? 'flicker .4s ease-out' : null,
                        alignItems: 'center',
                        display: 'flex',
                        height: height,
                        justifyContent: justifyContent,
                        width: width
                    }, style)
                },
                _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: '@keyframes flicker{0%{opacity:0.5}100%{opacity:1}}' } }),
                image && _react2.default.createElement(
                    'div',
                    { style: { padding: padding(imageInsets) } },
                    image
                ),
                title && _react2.default.createElement(
                    'div',
                    { style: _extends({}, _typography.text, { color: color }) },
                    title
                )
            );
        }
    }, {
        key: 'onClick',
        value: function onClick(event) {
            var _this2 = this;

            if (this.timeoutID) {
                window.clearTimeout(this.timeoutID);
            }

            this.setState({
                didClick: true
            });

            this.timeoutID = window.setTimeout(function () {
                _this2.setState({
                    didClick: false
                });
            }, 400);

            this.props.onClick(event);
        }
    }]);

    return Button;
}(_react.Component);

Button.propTypes = {
    children: _react.PropTypes.element,
    color: _react.PropTypes.string,
    height: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.oneOf(['auto'])]),
    horizontalAlignment: _react.PropTypes.oneOf(['left', 'right', 'center']),
    imageInsets: _react.PropTypes.arrayOf(_react.PropTypes.number),
    onClick: _react.PropTypes.func.isRequired,
    style: _react.PropTypes.object,
    title: _react.PropTypes.string,
    titleInsets: _react.PropTypes.arrayOf(_react.PropTypes.number),
    width: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.oneOf(['auto'])])
};

Button.defaultProps = {
    color: _colors.steel,
    height: 30,
    imageInsets: [0, 0, 0, 0],
    onClick: function onClick() {
        return null;
    },
    width: 'auto'
};

exports.default = Button;