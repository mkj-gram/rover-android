'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _RoundedButton = require('../../common/components/RoundedButton');

var _RoundedButton2 = _interopRequireDefault(_RoundedButton);

var _Label = require('../../common/components/forms/Label');

var _Label2 = _interopRequireDefault(_Label);

var _NewButton = require('../../common/components/NewButton');

var _NewButton2 = _interopRequireDefault(_NewButton);

var _Popover = require('../../common/components/Popover');

var _Popover2 = _interopRequireDefault(_Popover);

var _TextField = require('../../common/components/forms/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewPopover = function (_Component) {
    _inherits(NewPopover, _Component);

    function NewPopover() {
        _classCallCheck(this, NewPopover);

        return _possibleConstructorReturn(this, (NewPopover.__proto__ || Object.getPrototypeOf(NewPopover)).apply(this, arguments));
    }

    _createClass(NewPopover, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                type = _props.type,
                primaryColor = _props.primaryColor,
                name = _props.name,
                isOpen = _props.isOpen,
                isLoading = _props.isLoading,
                onRequestOpen = _props.onRequestOpen,
                onRequestClose = _props.onRequestClose,
                setName = _props.setName,
                _onSubmit = _props.onSubmit;


            var style = {
                textField: {
                    marginBottom: 20
                }
            };

            var isValid = Boolean(name);

            return _react2.default.createElement(
                _Popover2.default,
                { isOpen: isOpen, targetAttachment: 'bottom left', targetOffset: '5px 12px', onRequestClose: onRequestClose },
                _react2.default.createElement(
                    _NewButton2.default,
                    { primaryColor: primaryColor, onClick: onRequestOpen },
                    'New ',
                    type
                ),
                _react2.default.createElement(
                    'form',
                    {
                        onSubmit: function onSubmit(e) {
                            e.preventDefault();
                            _onSubmit();
                        } },
                    _react2.default.createElement(
                        _Label2.default,
                        null,
                        'Name'
                    ),
                    _react2.default.createElement(_TextField2.default, {
                        ref: function ref(_ref) {
                            return _this2.textField = _ref;
                        },
                        value: name,
                        style: style.textField,
                        onChange: function onChange(e) {
                            return setName(e.target.value);
                        }
                    }),
                    _react2.default.createElement(
                        _RoundedButton2.default,
                        {
                            type: 'primary',
                            primaryColor: primaryColor,
                            isDisabled: !isValid,
                            isLoading: isLoading,
                            onClick: _onSubmit
                        },
                        'Create ',
                        type
                    ),
                    _react2.default.createElement(
                        _RoundedButton2.default,
                        {
                            type: 'cancel',
                            primaryColor: primaryColor,
                            isDisabled: isLoading,
                            onClick: onRequestClose
                        },
                        'Cancel'
                    )
                )
            );
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (this.props.isOpen && !prevProps.isOpen) {
                var input = _reactDom2.default.findDOMNode(this.textField);
                input.focus();
            }
        }
    }]);

    return NewPopover;
}(_react.Component);

NewPopover.defaultProps = {
    type: 'Object',
    primaryColor: 'tomato',
    name: ''
};

exports.default = NewPopover;