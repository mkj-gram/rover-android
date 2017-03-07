'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _backgrounds = require('../../styles/backgrounds');

var _colors = require('../../styles/colors');

var _typography = require('../../styles/typography');

var _TextField = require('../forms/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _PartialLockIcon = require('../icons/PartialLockIcon');

var _PartialLockIcon2 = _interopRequireDefault(_PartialLockIcon);

var _LockIcon = require('../icons/LockIcon');

var _LockIcon2 = _interopRequireDefault(_LockIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Layer = function (_Component) {
    _inherits(Layer, _Component);

    function Layer(props) {
        _classCallCheck(this, Layer);

        var _this = _possibleConstructorReturn(this, (Layer.__proto__ || Object.getPrototypeOf(Layer)).call(this, props));

        _this.state = {
            isOver: false,
            isEditing: false
        };

        _this.onMouseEnter = _this.onMouseEnter.bind(_this);
        _this.onMouseLeave = _this.onMouseLeave.bind(_this);
        _this.onDoubleClick = _this.onDoubleClick.bind(_this);
        return _this;
    }

    _createClass(Layer, [{
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
            var _props = this.props,
                name = _props.name,
                icon = _props.icon,
                isHighlighted = _props.isHighlighted,
                isSelected = _props.isSelected,
                isLast = _props.isLast,
                lockStatus = _props.lockStatus,
                onMouseEnter = _props.onMouseEnter,
                onMouseLeave = _props.onMouseLeave,
                onRequestSetLockStatus = _props.onRequestSetLockStatus,
                onRequestSetName = _props.onRequestSetName,
                primaryColor = _props.primaryColor,
                rest = _objectWithoutProperties(_props, ['name', 'icon', 'isHighlighted', 'isSelected', 'isLast', 'lockStatus', 'onMouseEnter', 'onMouseLeave', 'onRequestSetLockStatus', 'onRequestSetName', 'primaryColor']);

            var style = {
                alignItems: 'center',
                background: lockStatus === 'locked' ? _backgrounds.slashes : isSelected ? (0, _colors.hexa)({ hex: primaryColor, alpha: 0.1 }) : 'none',
                borderColor: _colors.cloud,
                borderStyle: 'solid',
                borderBottomWidth: isLast ? 0 : 1,
                cursor: 'default',
                display: 'flex',
                height: 36,
                paddingLeft: 10
            };

            return _react2.default.createElement(
                'div',
                _extends({
                    style: style,
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave,
                    onDoubleClick: this.onDoubleClick
                }, rest),
                this.renderIcon(),
                this.renderName(),
                this.renderLockIcon()
            );
        }
    }, {
        key: 'renderIcon',
        value: function renderIcon() {
            var _props2 = this.props,
                icon = _props2.icon,
                isHighlighted = _props2.isHighlighted,
                isSelected = _props2.isSelected,
                lockStatus = _props2.lockStatus,
                primaryColor = _props2.primaryColor;


            if (!icon) {
                return;
            }

            var style = {
                flex: 'none',
                marginRight: 8,
                opacity: lockStatus === 'partial' || lockStatus === 'locked' ? 0.5 : 1,
                width: 12
            };

            var styledIcon = (0, _react.cloneElement)(icon, {
                style: {
                    display: 'block',
                    fill: isHighlighted || isSelected ? primaryColor : _colors.silver,
                    margin: '0 auto'
                }
            });

            return _react2.default.createElement(
                'div',
                { style: style },
                styledIcon
            );
        }
    }, {
        key: 'renderName',
        value: function renderName() {
            return this.state.isEditing ? this.renderTextField() : this.renderLabel();
        }
    }, {
        key: 'renderTextField',
        value: function renderTextField() {
            var _this2 = this;

            var onRequestSetName = this.props.onRequestSetName;


            var style = {
                background: 'white',
                flex: '1 0 0',
                fontSize: 12,
                focus: {
                    borderColor: _colors.titanium
                }
            };

            return _react2.default.createElement(_TextField2.default, {
                ref: function ref(textField) {
                    return _this2.textField = textField;
                },
                defaultValue: this.props.name,
                style: style,
                onBlur: function onBlur(e) {
                    onRequestSetName(e.target.value);
                    _this2.setState({ isEditing: false });
                },
                onKeyPress: function onKeyPress(e) {
                    if (e.key === 'Enter') {
                        _this2.textField.getInput().blur();
                    }
                }
            });
        }
    }, {
        key: 'renderLabel',
        value: function renderLabel() {
            var _props3 = this.props,
                isHighlighted = _props3.isHighlighted,
                isSelected = _props3.isSelected,
                lockStatus = _props3.lockStatus,
                name = _props3.name,
                primaryColor = _props3.primaryColor;


            var style = _extends({}, _typography.text, _typography.truncate, {
                color: isHighlighted || isSelected ? primaryColor : _colors.steel,
                flex: '1 0 0',
                fontSize: 12,
                opacity: lockStatus === 'partial' || lockStatus === 'locked' ? 0.5 : 1
            });

            return _react2.default.createElement(
                'div',
                { style: style },
                name
            );
        }
    }, {
        key: 'renderLockIcon',
        value: function renderLockIcon() {
            var _props4 = this.props,
                lockStatus = _props4.lockStatus,
                primaryColor = _props4.primaryColor,
                onRequestSetLockStatus = _props4.onRequestSetLockStatus;
            var isOver = this.state.isOver;


            var style = {
                flex: '0 0 auto',
                marginLeft: 8,
                marginRight: 10
            };

            var nextLockStatus = lockStatus === 'partial' ? 'locked' : lockStatus === 'locked' ? null : 'partial';

            var hasLock = Boolean(lockStatus);

            var iconStyle = {
                fill: isOver && !hasLock ? primaryColor : isOver ? _colors.steel : _colors.silver,
                opacity: isOver || hasLock ? 1 : 0
            };

            var Icon = lockStatus === 'locked' ? _LockIcon2.default : _PartialLockIcon2.default;

            return _react2.default.createElement(
                'div',
                {
                    style: style,
                    onClick: function onClick(e) {
                        e.stopPropagation();
                        onRequestSetLockStatus(nextLockStatus);
                    }
                },
                _react2.default.createElement(Icon, { style: iconStyle })
            );
        }
    }, {
        key: 'onMouseEnter',
        value: function onMouseEnter(event) {
            this.setState({
                isOver: true
            });
            this.props.onMouseEnter(event);
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave(event) {
            this.setState({
                isOver: false
            });
            this.props.onMouseLeave(event);
        }
    }, {
        key: 'onDoubleClick',
        value: function onDoubleClick(event) {
            var lockStatus = this.props.lockStatus;


            if (lockStatus === 'partial' || lockStatus === 'locked') {
                return;
            }

            this.setState({
                isEditing: true
            });
        }
    }]);

    return Layer;
}(_react.Component);

Layer.propTypes = {
    name: _react.PropTypes.string,
    icon: _react.PropTypes.element,
    isHighlighted: _react.PropTypes.bool,
    isLast: _react.PropTypes.bool,
    primaryColor: _react.PropTypes.string,
    lockStatus: _react.PropTypes.oneOf(['locked', 'partial']),
    onMouseEnter: _react.PropTypes.func.isRequired,
    onMouseLeave: _react.PropTypes.func.isRequired,
    onRequestSetLockStatus: _react.PropTypes.func.isRequired,
    onRequestSetName: _react.PropTypes.func.isRequired
};

Layer.defaultProps = {
    isHighlighted: false,
    isLast: false,
    primaryColor: 'tomato',
    onMouseEnter: function onMouseEnter() {
        return null;
    },
    onMouseLeave: function onMouseLeave() {
        return null;
    },
    onRequestSetLockStatus: function onRequestSetLockStatus() {
        return null;
    },
    onRequestSetName: function onRequestSetName() {
        return null;
    }
};

exports.default = Layer;