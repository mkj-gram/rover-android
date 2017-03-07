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

var _colors = require('../styles/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = _react2.default.Component;

var TabBar = function (_Component) {
    _inherits(TabBar, _Component);

    function TabBar() {
        _classCallCheck(this, TabBar);

        return _possibleConstructorReturn(this, (TabBar.__proto__ || Object.getPrototypeOf(TabBar)).apply(this, arguments));
    }

    _createClass(TabBar, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                primaryColor = _props.primaryColor,
                _props$tabs = _props.tabs,
                tabs = _props$tabs === undefined ? [] : _props$tabs,
                activeTab = _props.activeTab,
                _onClick = _props.onClick;
            var _props$style = this.props.style,
                style = _props$style === undefined ? {} : _props$style;


            style = {
                root: {
                    display: 'flex',
                    justifyContent: 'center',
                    height: 60,
                    paddingBottom: 4,
                    position: 'relative'
                },
                tab: {
                    alignItems: 'center',
                    color: _colors.steel,
                    display: 'flex',
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: '20px',
                    padding: '3px 20px 0 20px'
                },
                count: {
                    background: '#BCBCBC',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: '16px',
                    marginLeft: 6,
                    padding: '0 7px',
                    transition: 'background-color 0.2s'
                },
                underline: {
                    background: primaryColor,
                    bottom: 0,
                    display: 'block',
                    height: 4,
                    position: 'absolute',
                    transition: 'left 0.2s, width 0.2s'
                }
            };

            style.activeCount = _extends({}, style.count, {
                background: primaryColor
            });

            var anchors = tabs.map(function (t) {
                var ref = void 0,
                    countStyle = style.count;
                if (t.id === activeTab) {
                    ref = function ref(e) {
                        return _this2.activeTab = e;
                    };
                    countStyle = style.activeCount;
                }

                var count = void 0;
                if (t.count > 0) {
                    count = _react2.default.createElement(
                        'span',
                        { style: countStyle },
                        t.count
                    );
                }

                return _react2.default.createElement(
                    _Anchor2.default,
                    { ref: ref, key: t.id, style: style.tab, onClick: function onClick() {
                            return _onClick(t);
                        } },
                    t.name,
                    count
                );
            });

            return _react2.default.createElement(
                'div',
                { ref: function ref(e) {
                        return _this2.root = e;
                    }, style: style.root },
                anchors,
                _react2.default.createElement('div', { ref: function ref(e) {
                        return _this2.underline = e;
                    }, style: style.underline })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.positionUnderline();
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.positionUnderline();
        }
    }, {
        key: 'positionUnderline',
        value: function positionUnderline() {
            if (!this.activeTab) {
                return;
            }

            var rootRect = this.root.getBoundingClientRect();
            var activeTabRect = this.activeTab.element.getBoundingClientRect();

            this.underline.style.left = activeTabRect.left - rootRect.left + 'px';
            this.underline.style.width = activeTabRect.width + 'px';
        }
    }]);

    return TabBar;
}(Component);

TabBar.defaultProps = {
    primaryColor: 'tomato',
    onClick: function onClick() {
        return null;
    }
};

exports.default = TabBar;