'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RemoveIcon = require('./icons/RemoveIcon');

var _RemoveIcon2 = _interopRequireDefault(_RemoveIcon);

var _colors = require('../styles/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RemoveButton = function (_Component) {
    _inherits(RemoveButton, _Component);

    function RemoveButton(props) {
        _classCallCheck(this, RemoveButton);

        var _this = _possibleConstructorReturn(this, (RemoveButton.__proto__ || Object.getPrototypeOf(RemoveButton)).call(this, props));

        _this.state = {
            isOver: false
        };

        _this.onMouseEnter = _this.onMouseEnter.bind(_this);
        _this.onMouseLeave = _this.onMouseLeave.bind(_this);
        return _this;
    }

    _createClass(RemoveButton, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                _extends({}, this.props, {
                    onMouseEnter: this.onMouseEnter,
                    onMouseLeave: this.onMouseLeave
                }),
                _react2.default.createElement(_RemoveIcon2.default, {
                    style: {
                        display: 'block',
                        fill: this.state.isOver ? _colors.red : _colors.silver
                    }

                })
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
    }]);

    return RemoveButton;
}(_react.Component);

RemoveButton.defaultProps = {
    onClick: function onClick() {
        return null;
    },
    onMouseEnter: function onMouseEnter() {
        return null;
    },
    onMouseLeave: function onMouseLeave() {
        return null;
    }
};

exports.default = RemoveButton;