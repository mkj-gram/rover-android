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

var _Popover = require('./Popover');

var _Popover2 = _interopRequireDefault(_Popover);

var _typography = require('../styles/typography');

var _colors = require('../styles/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var AccountMenu = function (_Component) {
    _inherits(AccountMenu, _Component);

    function AccountMenu(props) {
        _classCallCheck(this, AccountMenu);

        var _this = _possibleConstructorReturn(this, (AccountMenu.__proto__ || Object.getPrototypeOf(AccountMenu)).call(this, props));

        _this.state = {
            isShowingPopover: false
        };

        _this.showPopover = _this.showPopover.bind(_this);
        _this.hidePopover = _this.hidePopover.bind(_this);
        _this.signOutDidClick = _this.signOutDidClick.bind(_this);
        return _this;
    }

    _createClass(AccountMenu, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                style = _props.style,
                children = _props.children;
            var isShowingPopover = this.state.isShowingPopover;

            var _styles = this.styles(style),
                popoverStyle = _styles.popover,
                linkStyle = _styles.link,
                linkHoverStyle = _styles.linkHover,
                nameStyle = _styles.name,
                chevronStyle = _styles.chevron,
                containerStyle = _styles.container;

            return _react2.default.createElement(
                _Popover2.default,
                {
                    attachment: 'top right',
                    targetAttachment: 'bottom right',
                    targetOffset: '0 -6px',
                    hideCloseButton: true,
                    isOpen: isShowingPopover,
                    onRequestClose: this.hidePopover,
                    style: popoverStyle
                },
                _react2.default.createElement(
                    'div',
                    { style: containerStyle },
                    _react2.default.createElement(
                        _Anchor2.default,
                        { style: nameStyle, onClick: this.showPopover },
                        children
                    ),
                    _react2.default.createElement(
                        _Anchor2.default,
                        { style: chevronStyle, onClick: this.showPopover },
                        _react2.default.createElement(_Icon2.default, { type: 'chevron-down' })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        _Anchor2.default,
                        { style: linkStyle, hoverStyle: linkHoverStyle, href: '/settings/', target: '_blank', onClick: this.hidePopover },
                        'Rover Settings'
                    ),
                    _react2.default.createElement(
                        _Anchor2.default,
                        { style: linkStyle, hoverStyle: linkHoverStyle, onClick: this.signOutDidClick },
                        'Sign Out'
                    )
                )
            );
        }
    }, {
        key: 'styles',
        value: function styles(overrides) {
            var popover = overrides.popover,
                link = overrides.link,
                linkHover = overrides.linkHover,
                name = overrides.name,
                chevron = overrides.chevron,
                container = _objectWithoutProperties(overrides, ['popover', 'link', 'linkHover', 'name', 'chevron']);

            var defaultPopover = {
                paddingBottom: 7,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 7,
                width: 170
            };

            var defaultLink = _extends({}, _typography.text, _typography.large, _typography.truncate, {
                display: 'block',
                height: 40,
                lineHeight: '40px',
                padding: '0 18px'
            });

            var defaultLinkHover = {
                background: '#F5F5F5'
            };

            var defaultName = _extends({}, _typography.text, _typography.semibold, {
                color: _colors.graphite,
                marginRight: 10
            });

            var defaultChevron = {
                outline: 'none'
            };

            var defaultContainer = {
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'flex-end'
            };

            return {
                popover: _extends({}, defaultPopover, popover),
                link: _extends({}, defaultLink, link),
                linkHover: _extends({}, defaultLinkHover, linkHover),
                name: _extends({}, defaultName, name),
                chevron: _extends({}, defaultChevron, chevron),
                container: _extends({}, defaultContainer, container)
            };
        }
    }, {
        key: 'showPopover',
        value: function showPopover() {
            this.setState({
                isShowingPopover: true
            });
        }
    }, {
        key: 'hidePopover',
        value: function hidePopover() {
            this.setState({
                isShowingPopover: false
            });
        }
    }, {
        key: 'signOutDidClick',
        value: function signOutDidClick() {
            this.props.onRequestSignOut();
            this.hidePopover();
        }
    }]);

    return AccountMenu;
}(Component);

AccountMenu.defaultProps = {
    style: {},
    onRequestSignOut: function onRequestSignOut() {
        return null;
    }
};

exports.default = AccountMenu;