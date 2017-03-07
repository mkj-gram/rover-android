'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _colors = require('../../common/styles/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToolTip = function ToolTip(_ref) {
    var message = _ref.message;
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('div', {
            style: {
                position: 'absolute',
                height: 14,
                width: 14,
                top: 23,
                left: '50%',
                backgroundColor: _colors.graphite,
                transform: 'rotate(45deg)'
            }
        }),
        _react2.default.createElement(
            'div',
            {
                style: {
                    background: _colors.graphite,
                    borderRadius: 3,
                    color: 'white',
                    fontSize: 12,
                    fontFamily: 'Source Sans Pro',
                    height: 28,
                    right: -52,
                    lineHeight: '28px',
                    padding: '0 14px',
                    position: 'absolute',
                    textAlign: 'center',
                    top: 12,
                    whiteSpace: 'nowrap',
                    width: 118,
                    marginTop: 16
                }
            },
            message
        )
    );
};

exports.default = ToolTip;