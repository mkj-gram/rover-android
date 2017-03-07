'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _IconButton = require('./IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var isOpen = _ref.isOpen,
        onAfterOpen = _ref.onAfterOpen,
        onRequestClose = _ref.onRequestClose,
        closeTimeoutMS = _ref.closeTimeoutMS,
        _ref$style = _ref.style,
        style = _ref$style === undefined ? {} : _ref$style,
        children = _ref.children;


    style = {
        overlay: _extends({
            backgroundColor: 'transparent'
        }, style.overlay),
        content: _extends({
            background: 'white',
            border: 'none',
            borderRadius: 5,
            bottom: 'auto',
            boxShadow: '0px 3px 20px 0px rgba(0, 0, 0, 0.25)',
            left: '50%',
            padding: '40px 20px 20px 20px',
            right: 'auto',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400
        }, style.content)
    };

    return _react2.default.createElement(
        _reactModal2.default,
        { isOpen: isOpen, onAfterOpen: onAfterOpen, onRequestClose: onRequestClose, closeTimeoutMS: closeTimeoutMS, style: style },
        _react2.default.createElement(_IconButton2.default, {
            type: 'close',
            onClick: onRequestClose,
            style: {
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1
            }
        }),
        children
    );
};