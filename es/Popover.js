'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactTether = require('react-tether');

var _reactTether2 = _interopRequireDefault(_reactTether);

var _IconButton = require('./IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var Popover = function (_Component) {
    _inherits(Popover, _Component);

    function Popover(props) {
        _classCallCheck(this, Popover);

        var _this = _possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).call(this, props));

        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(Popover, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('keydown', this.handleKeyDown);
            document.addEventListener('click', this.handleClick);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('keydown', this.handleKeyDown);
            document.removeEventListener('click', this.handleClick);
        }
    }, {
        key: 'handleKeyDown',
        value: function handleKeyDown(event) {
            if (event.keyCode === 27 && this.props.closeOnEscape) {
                this.props.onRequestClose();
            }
        }
    }, {
        key: 'handleClick',
        value: function handleClick(event) {
            if (!this.props.closeOnClickOutside || !this.contentElement) {
                return;
            }

            var targetElement = _reactDom2.default.findDOMNode(this.tetherComponent);
            var clickedOutside = !targetElement.contains(event.target) && !this.contentElement.contains(event.target);
            if (clickedOutside) {
                this.props.onRequestClose();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                isOpen = _props.isOpen,
                style = _props.style,
                attachment = _props.attachment,
                targetAttachment = _props.targetAttachment,
                offset = _props.offset,
                targetOffset = _props.targetOffset,
                hideCloseButton = _props.hideCloseButton,
                children = _props.children,
                onRequestClose = _props.onRequestClose;

            var arrowStyle = style.arrow,
                closeButtonStyle = style.closeButton,
                contentStyle = _objectWithoutProperties(style, ['arrow', 'closeButton']);

            contentStyle = _extends({}, Popover.defaultStyles.content, contentStyle);

            arrowStyle = _extends({}, Popover.defaultStyles.arrow, arrowStyle);

            closeButtonStyle = _extends({}, Popover.defaultStyles.closeButton, closeButtonStyle);

            var horizontalAttachment = attachment.split(' ')[1];
            var verticalAttachment = attachment.split(' ')[0];

            switch (horizontalAttachment) {
                case 'left':
                    contentStyle.marginLeft = -20;
                    arrowStyle.left = 10;
                    break;
                case 'right':
                    contentStyle.marginRight = -20;
                    arrowStyle.right = 10;
                    break;
            }

            switch (verticalAttachment) {
                case 'top':
                    contentStyle.animation = 'slideDown 0.2s ease-out';
                    contentStyle.marginTop = 10;
                    arrowStyle.borderLeftColor = 'transparent';
                    arrowStyle.borderRightColor = 'transparent';
                    arrowStyle.borderTopColor = 'transparent';
                    arrowStyle.top = -20;
                    break;
            }

            var closeButtonElement = void 0;
            if (!hideCloseButton) {
                closeButtonElement = _react2.default.createElement(_IconButton2.default, { type: 'close', onClick: onRequestClose, style: closeButtonStyle });
            }

            var contentElement = void 0;
            if (isOpen) {
                contentElement = _react2.default.createElement(
                    'div',
                    { style: contentStyle, ref: function ref(_ref2) {
                            return _this2.contentElement = _ref2;
                        } },
                    closeButtonElement,
                    children[1],
                    _react2.default.createElement('div', { ref: function ref(_ref) {
                            return _this2.arrowElement = _ref;
                        }, style: arrowStyle })
                );
            }

            return _react2.default.createElement(
                _reactTether2.default,
                { ref: function ref(e) {
                        return _this2.tetherComponent = e;
                    }, attachment: attachment, targetAttachment: targetAttachment, offset: offset, targetOffset: targetOffset },
                children[0],
                contentElement
            );
        }
    }]);

    return Popover;
}(Component);

Popover.defaultProps = {
    isOpen: false,
    style: {},
    attachment: 'top left',
    targetAttachment: 'bottom center',
    offset: '0 0',
    targetOffset: '0 0',
    hideCloseButton: false,
    closeOnClickOutside: true,
    closeOnEscape: true,
    onRequestClose: function onRequestClose() {
        return null;
    }
};

Popover.defaultStyles = {
    content: {
        background: 'white',
        borderRadius: 5,
        boxShadow: '0px 3px 20px 0px rgba(0, 0, 0, 0.25)',
        padding: '40px 20px 20px 20px',
        position: 'relative'
    },
    arrow: {
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 10,
        position: 'absolute',
        width: 0,
        height: 0
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1
    }
};

exports.default = Popover;