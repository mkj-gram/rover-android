'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ArrowIconDown = require('../icons/ArrowIconDown');

var _ArrowIconDown2 = _interopRequireDefault(_ArrowIconDown);

var _ArrowIconRight = require('../icons/ArrowIconRight');

var _ArrowIconRight2 = _interopRequireDefault(_ArrowIconRight);

var _colors = require('../../styles/colors');

var _typography = require('../../styles/typography');

var _TextField = require('../forms/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LayerGroup = function (_Component) {
    _inherits(LayerGroup, _Component);

    function LayerGroup(props) {
        _classCallCheck(this, LayerGroup);

        var _this = _possibleConstructorReturn(this, (LayerGroup.__proto__ || Object.getPrototypeOf(LayerGroup)).call(this, props));

        _this.state = {
            isEditing: false,
            isOverArrow: false
        };
        return _this;
    }

    _createClass(LayerGroup, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.textField) {
                var input = this.textField.getInput();
                input.focus();
                input.setSelectionRange(0, input.value.length);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                isCollapsed = _props.isCollapsed,
                isSelected = _props.isSelected,
                isEmpty = _props.isEmpty,
                onMouseEnter = _props.onMouseEnter,
                onMouseLeave = _props.onMouseLeave,
                onClick = _props.onClick,
                primaryColor = _props.primaryColor,
                style = _props.style;


            style = _extends({
                alignItems: 'center',
                backgroundColor: isSelected ? (0, _colors.hexa)({ hex: primaryColor, alpha: 0.1 }) : 'transparent',
                borderWidth: isCollapsed || isEmpty ? '1px 0 0 0' : '1px 0',
                borderColor: _colors.cloud,
                borderStyle: 'solid',
                cursor: 'default',
                display: 'flex',
                height: 36,
                paddingLeft: 5,
                paddingBottom: isCollapsed || isEmpty ? 1 : 0,
                marginBottom: isCollapsed || isEmpty ? -1 : 0
            }, style);

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    {
                        style: style,
                        onMouseEnter: onMouseEnter,
                        onMouseLeave: onMouseLeave,
                        onClick: onClick,
                        onDoubleClick: function onDoubleClick(e) {
                            return _this2.setState({ isEditing: true });
                        }
                    },
                    this.renderArrow(),
                    this.renderIcon(),
                    this.renderName()
                ),
                this.renderLayers()
            );
        }
    }, {
        key: 'renderArrow',
        value: function renderArrow() {
            var _this3 = this;

            var _props2 = this.props,
                isCollapsed = _props2.isCollapsed,
                onRequestExpand = _props2.onRequestExpand,
                onRequestCollapse = _props2.onRequestCollapse;
            var isOverArrow = this.state.isOverArrow;


            var style = {
                alignItems: 'center',
                backgroundColor: isOverArrow ? _colors.cloud : 'transparent',
                borderRadius: 7,
                display: 'flex',
                fill: _colors.steel,
                flex: 'none',
                height: 14,
                justifyContent: 'center',
                marginRight: 5,
                width: 14
            };

            var onClick = function onClick(event) {
                event.stopPropagation();

                _this3.props.isCollapsed ? onRequestExpand() : onRequestCollapse();
            };

            var onMouseEnter = function onMouseEnter(event) {
                _this3.setState({
                    isOverArrow: true
                });
            };

            var onMouseLeave = function onMouseLeave(event) {
                _this3.setState({
                    isOverArrow: false
                });
            };

            var Icon = isCollapsed ? _ArrowIconRight2.default : _ArrowIconDown2.default;

            return _react2.default.createElement(
                'div',
                {
                    style: style,
                    onClick: onClick,
                    onMouseEnter: onMouseEnter,
                    onMouseLeave: onMouseLeave
                },
                _react2.default.createElement(Icon, null)
            );
        }
    }, {
        key: 'renderIcon',
        value: function renderIcon() {
            var _props3 = this.props,
                icon = _props3.icon,
                isHighlighted = _props3.isHighlighted,
                isSelected = _props3.isSelected,
                primaryColor = _props3.primaryColor;


            if (!icon) {
                return;
            }

            return (0, _react.cloneElement)(icon, {
                style: {
                    fill: isHighlighted || isSelected ? primaryColor : _colors.silver,
                    flex: 'none',
                    marginRight: 7
                }
            });
        }
    }, {
        key: 'renderName',
        value: function renderName() {
            return this.state.isEditing ? this.renderTextField() : this.renderLabel();
        }
    }, {
        key: 'renderTextField',
        value: function renderTextField() {
            var _this4 = this;

            var onRequestSetName = this.props.onRequestSetName;


            var style = {
                background: 'white',
                flex: '1 0 0',
                fontSize: 12,
                marginRight: 10,
                focus: {
                    borderColor: _colors.titanium
                }
            };

            return _react2.default.createElement(_TextField2.default, {
                ref: function ref(textField) {
                    return _this4.textField = textField;
                },
                defaultValue: this.props.name,
                style: style,
                onBlur: function onBlur(e) {
                    onRequestSetName(e.target.value);
                    _this4.setState({ isEditing: false });
                },
                onKeyPress: function onKeyPress(e) {
                    if (e.key === 'Enter') {
                        _this4.textField.getInput().blur();
                    }
                }
            });
        }
    }, {
        key: 'renderLabel',
        value: function renderLabel() {
            var _props4 = this.props,
                isHighlighted = _props4.isHighlighted,
                isSelected = _props4.isSelected,
                name = _props4.name,
                primaryColor = _props4.primaryColor;


            var style = _extends({}, _typography.text, _typography.truncate, {
                color: isHighlighted || isSelected ? primaryColor : _colors.steel,
                fontSize: 12,
                marginRight: 10
            });

            return _react2.default.createElement(
                'div',
                { style: style },
                name
            );
        }
    }, {
        key: 'renderLayers',
        value: function renderLayers() {
            if (this.props.isCollapsed) {
                return;
            }

            var children = this.props.children;


            var style = {
                paddingLeft: 30
            };

            return _react2.default.createElement(
                'div',
                { style: style },
                children
            );
        }
    }]);

    return LayerGroup;
}(_react.Component);

LayerGroup.propTypes = {
    name: _react.PropTypes.string,
    icon: _react.PropTypes.element,
    isCollapsed: _react.PropTypes.bool.isRequired,
    isEmpty: _react.PropTypes.bool.isRequired,
    isHighlighted: _react.PropTypes.bool.isRequired,
    isSelected: _react.PropTypes.bool.isRequired,
    isLast: _react.PropTypes.bool.isRequired,
    primaryColor: _react.PropTypes.string,
    onMouseEnter: _react.PropTypes.func.isRequired,
    onMouseLeave: _react.PropTypes.func.isRequired,
    onClick: _react.PropTypes.func.isRequired,
    onRequestSetName: _react.PropTypes.func.isRequired,
    onRequestExpand: _react.PropTypes.func.isRequired,
    onRequestCollapse: _react.PropTypes.func.isRequired
};

LayerGroup.defaultProps = {
    isCollapsed: false,
    isEmpty: false,
    isHighlighted: false,
    isSelected: false,
    isLast: false,
    primaryColor: 'tomato',
    onMouseEnter: function onMouseEnter() {
        return null;
    },
    onMouseLeave: function onMouseLeave() {
        return null;
    },
    onClick: function onClick() {
        return null;
    },
    onRequestSetName: function onRequestSetName() {
        return null;
    },
    onRequestExpand: function onRequestExpand() {
        return null;
    },
    onRequestCollapse: function onRequestCollapse() {
        return null;
    }
};

exports.default = LayerGroup;