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

var _Anchor = require('./Anchor');

var _Anchor2 = _interopRequireDefault(_Anchor);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _Popover = require('./Popover');

var _Popover2 = _interopRequireDefault(_Popover);

var _ProximityIcon = require('./images/app-icons/ProximityIcon');

var _ProximityIcon2 = _interopRequireDefault(_ProximityIcon);

var _MessagesIcon = require('./images/app-icons/MessagesIcon');

var _MessagesIcon2 = _interopRequireDefault(_MessagesIcon);

var _ExperiencesIcon = require('./images/app-icons/ExperiencesIcon');

var _ExperiencesIcon2 = _interopRequireDefault(_ExperiencesIcon);

var _AnalyticsIcon = require('./images/app-icons/AnalyticsIcon');

var _AnalyticsIcon2 = _interopRequireDefault(_AnalyticsIcon);

var _CustomersIcon = require('./images/app-icons/CustomersIcon');

var _CustomersIcon2 = _interopRequireDefault(_CustomersIcon);

var _SettingsIcon = require('./images/app-icons/SettingsIcon');

var _SettingsIcon2 = _interopRequireDefault(_SettingsIcon);

var _GimbalIcon = require('./images/app-icons/GimbalIcon');

var _GimbalIcon2 = _interopRequireDefault(_GimbalIcon);

var _XenioIcon = require('./images/app-icons/XenioIcon');

var _XenioIcon2 = _interopRequireDefault(_XenioIcon);

var _colors = require('../styles/colors');

var _typography = require('../styles/typography');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var AppSwitcher = function (_Component) {
    _inherits(AppSwitcher, _Component);

    function AppSwitcher(props) {
        _classCallCheck(this, AppSwitcher);

        var _this = _possibleConstructorReturn(this, (AppSwitcher.__proto__ || Object.getPrototypeOf(AppSwitcher)).call(this, props));

        _this.state = {
            isShowingPopover: false
        };

        _this.showPopover = _this.showPopover.bind(_this);
        _this.hidePopover = _this.hidePopover.bind(_this);
        return _this;
    }

    _createClass(AppSwitcher, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                active = _props.active,
                isGimbalEnabled = _props.isGimbalEnabled,
                isXenioEnabled = _props.isXenioEnabled,
                style = _props.style,
                children = _props.children;
            var isShowingPopover = this.state.isShowingPopover;


            var containerStyle = _extends({}, AppSwitcher.defaultStyles.container, style.container);

            var logoStyle = _extends({}, AppSwitcher.defaultStyles.logo, style.logo);

            var nameStyle = _extends({}, AppSwitcher.defaultStyles.name, style.name);

            var switchStyle = _extends({}, AppSwitcher.defaultStyles.switch, style.switch);

            var chevronStyle = _extends({}, AppSwitcher.defaultStyles.chevron, style.chevron);

            var popoverStyle = _extends({}, AppSwitcher.defaultStyles.popover, style.popover);

            var listStyle = _extends({}, AppSwitcher.defaultStyles.list, style.list);

            var listItemStyle = _extends({}, AppSwitcher.defaultStyles.listItem, style.listItem);

            var iconLinkStyle = _extends({}, AppSwitcher.defaultStyles.iconLink, style.iconLink);

            var activeIconLinkStyle = _extends({}, AppSwitcher.defaultStyles.activeIconLink, style.activeIconLink);

            var iconStyle = _extends({}, AppSwitcher.defaultStyles.icon, style.icon);

            var disabledIconStyle = _extends({}, AppSwitcher.defaultStyles.disabledIcon, style.disabledIcon);

            var labelStyle = _extends({}, AppSwitcher.defaultStyles.label, style.label);

            var comingSoonStyle = _extends({}, AppSwitcher.defaultStyles.comingSoon, style.comingSoonStyle);

            var renderProximityIcon = function renderProximityIcon() {
                if (isGimbalEnabled) {
                    return _react2.default.createElement(
                        'div',
                        { style: listItemStyle },
                        _react2.default.createElement(
                            _Anchor2.default,
                            { href: 'https://manager.gimbal.com/', target: '_blank', onClick: _this2.hidePopover, style: iconLinkStyle },
                            _react2.default.createElement(_GimbalIcon2.default, { style: iconStyle })
                        ),
                        _react2.default.createElement(
                            _Anchor2.default,
                            { href: 'https://manager.gimbal.com/', target: '_blank', onClick: _this2.hidePopover, style: labelStyle },
                            'Gimbal'
                        )
                    );
                } else if (isXenioEnabled) {
                    return _react2.default.createElement(
                        'div',
                        { style: listItemStyle },
                        _react2.default.createElement(
                            _Anchor2.default,
                            { href: 'https://planner.xenioapps.com/', target: '_blank', onClick: _this2.hidePopover, style: iconLinkStyle },
                            _react2.default.createElement(_XenioIcon2.default, { style: iconStyle })
                        ),
                        _react2.default.createElement(
                            _Anchor2.default,
                            { href: 'https://planner.xenioapps.com/', target: '_blank', onClick: _this2.hidePopover, style: labelStyle },
                            'Xenio Planner'
                        )
                    );
                } else {
                    return _react2.default.createElement(
                        'div',
                        { style: listItemStyle },
                        _react2.default.createElement(
                            _Anchor2.default,
                            { href: '/proximity/', target: '_blank', onClick: _this2.hidePopover, style: active === 'proximity' ? activeIconLinkStyle : iconLinkStyle },
                            _react2.default.createElement(_ProximityIcon2.default, { style: iconStyle })
                        ),
                        _react2.default.createElement(
                            _Anchor2.default,
                            { href: '/proximity/', target: '_blank', onClick: _this2.hidePopover, style: labelStyle },
                            'Proximity'
                        )
                    );
                }
            };

            return _react2.default.createElement(
                'div',
                { style: containerStyle },
                _react2.default.createElement(
                    _Anchor2.default,
                    { to: '/', style: logoStyle },
                    this.props.children[0]
                ),
                _react2.default.createElement(
                    _Anchor2.default,
                    { to: '/', style: nameStyle },
                    this.props.children[1]
                ),
                _react2.default.createElement(
                    _Popover2.default,
                    { ref: function ref(_ref2) {
                            return _this2.popover = _ref2;
                        }, attachment: 'top left', targetAttachment: 'bottom center', isOpen: isShowingPopover, hideCloseButton: true, onRequestClose: this.hidePopover, style: popoverStyle },
                    _react2.default.createElement(
                        _Anchor2.default,
                        { ref: function ref(_ref) {
                                return _this2.switch = _ref;
                            }, style: switchStyle, onClick: this.showPopover },
                        _react2.default.createElement(_Icon2.default, { style: chevronStyle, type: 'chevron-down' })
                    ),
                    _react2.default.createElement(
                        'div',
                        { style: listStyle },
                        renderProximityIcon(),
                        _react2.default.createElement(
                            'div',
                            { style: listItemStyle },
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/messages/', target: '_blank', onClick: this.hidePopover, style: active === 'messages' ? activeIconLinkStyle : iconLinkStyle },
                                _react2.default.createElement(_MessagesIcon2.default, { style: iconStyle })
                            ),
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/messages/', target: '_blank', onClick: this.hidePopover, style: labelStyle },
                                'Messages'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { style: listItemStyle },
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/experiences/', target: '_blank', onClick: this.hidePopover, style: active === 'experiences' ? activeIconLinkStyle : iconLinkStyle },
                                _react2.default.createElement(_ExperiencesIcon2.default, { style: iconStyle })
                            ),
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/experiences/', target: '_blank', onClick: this.hidePopover, style: labelStyle },
                                'Experiences'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { style: listItemStyle },
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/customers/', target: '_blank', onClick: this.hidePopover, style: active === 'customers' ? activeIconLinkStyle : iconLinkStyle },
                                _react2.default.createElement(_CustomersIcon2.default, { style: iconStyle })
                            ),
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/customers/', target: '_blank', onClick: this.hidePopover, style: labelStyle },
                                'Customers'
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { style: listItemStyle },
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/settings/', target: '_blank', onClick: this.hidePopover, style: active === 'settings' ? activeIconLinkStyle : iconLinkStyle },
                                _react2.default.createElement(_SettingsIcon2.default, { style: iconStyle })
                            ),
                            _react2.default.createElement(
                                _Anchor2.default,
                                { href: '/settings/', target: '_blank', onClick: this.hidePopover, style: labelStyle },
                                'Settings'
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            var switchElement = _reactDom2.default.findDOMNode(this.switch);
            var switchRect = switchElement.getBoundingClientRect();

            if (this.popover.contentElement) {
                this.popover.contentElement.style.marginLeft = 0 - switchRect.left - 20 + 14 + 'px';
            }

            if (this.popover.arrowElement) {
                this.popover.arrowElement.style.left = switchRect.left - 14 + 10 + 'px';
            }
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
    }]);

    return AppSwitcher;
}(Component);

AppSwitcher.propTypes = {
    isGimbalEnabled: _react.PropTypes.bool.isRequired,
    isXenioEnabled: _react.PropTypes.bool.isRequired
};

AppSwitcher.defaultProps = {
    isGimbalEnabled: false,
    isXenioEnabled: false,
    style: {}
};

AppSwitcher.defaultStyles = {
    container: {
        alignItems: 'center',
        display: 'flex'
    },
    logo: {},
    name: _extends({}, _typography.text, _typography.bold, _typography.uppercase, {
        color: _colors.graphite,
        marginLeft: 14
    }),
    switch: {
        borderLeft: '1px solid #D8D8D8',
        borderRight: '1px solid transparent',
        marginLeft: 12,
        outline: 'none',
        paddingTop: 2,
        paddingRight: 12,
        paddingBottom: 2,
        paddingLeft: 12
    },
    chevron: {
        display: 'block'
    },
    popover: {
        background: '#343A4C',
        padding: '30px 10px',
        arrow: {
            borderColor: '#343A4C'
        }
    },
    list: {
        display: 'flex'
    },
    listItem: {
        alignItems: 'center',
        display: 'flex',
        flex: 'none',
        flexDirection: 'column',
        width: 108
    },
    iconLink: {
        borderColor: 'transparent',
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 2,
        marginBottom: 5,
        padding: 3
    },
    icon: {
        display: 'block'
    },
    label: _extends({}, _typography.text, {
        color: 'white'
    }),
    comingSoon: _extends({}, _typography.text, _typography.light, {
        color: '#BED0FF',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 6
    })
};

AppSwitcher.defaultStyles.activeIconLink = _extends({}, AppSwitcher.defaultStyles.iconLink, {
    borderColor: '#939EC2'
});

AppSwitcher.defaultStyles.disabledIcon = _extends({}, AppSwitcher.defaultStyles.icon, {
    opacity: '0.5'
});

exports.default = AppSwitcher;