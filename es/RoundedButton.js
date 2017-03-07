'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Anchor = require('./Anchor');

var _Anchor2 = _interopRequireDefault(_Anchor);

var _colors = require('../styles/colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Button = function Button(_ref) {
    var primaryColor = _ref.primaryColor,
        type = _ref.type,
        isDisabled = _ref.isDisabled,
        isLoading = _ref.isLoading,
        style = _ref.style,
        children = _ref.children,
        onClick = _ref.onClick,
        rest = _objectWithoutProperties(_ref, ['primaryColor', 'type', 'isDisabled', 'isLoading', 'style', 'children', 'onClick']);

    var loadingIndicatorStyle = style.loadingIndicator,
        anchorStyle = _objectWithoutProperties(style, ['loadingIndicator']);

    anchorStyle = _extends({}, Button.defaultStyles.anchor, anchorStyle);

    loadingIndicatorStyle = _extends({}, Button.defaultStyles.loadingIndicator, loadingIndicatorStyle);

    switch (type) {
        case 'cancel':
            anchorStyle.color = primaryColor;
            break;
        case 'primary':
            anchorStyle.backgroundColor = primaryColor;
            anchorStyle.color = 'white';
            break;
        default:
            anchorStyle.backgroundColor = _colors.steel;
            anchorStyle.color = 'white';
    }

    if (isDisabled) {
        switch (type) {
            case 'cancel':
                anchorStyle.color = _colors.silver;
                break;
            default:
                anchorStyle.backgroundColor = _colors.cloud;
                anchorStyle.color = _colors.silver;
        }
    }

    var loadingIndicator = void 0;
    if (isLoading) {
        anchorStyle.position = 'relative';
        anchorStyle.color = 'rgba(0, 0, 0, 0.0)';
        loadingIndicator = _react2.default.createElement('div', { style: loadingIndicatorStyle });
    }

    return _react2.default.createElement(
        _Anchor2.default,
        _extends({ style: anchorStyle, isDisabled: isLoading || isDisabled, onClick: onClick }, rest),
        children,
        loadingIndicator
    );
};

Button.defaultProps = {
    primaryColor: 'tomato',
    style: {},
    onClick: function onClick() {
        return null;
    }
};

Button.defaultStyles = {
    anchor: {
        borderRadius: 4,
        border: 'none',
        display: 'inline-block',
        fontFamily: '"Source Sans Pro", serif',
        fontSize: 14,
        height: 40,
        lineHeight: '40px',
        outline: 'none',
        padding: '0 20px',
        textAlign: 'center'
    },
    loadingIndicator: {
        borderRadius: '50%',
        animation: 'spin .6s linear infinite',
        borderTop: '2px solid white',
        borderRight: '2px solid transparent',
        left: '50%',
        height: 16,
        marginTop: -8,
        marginLeft: -8,
        position: 'absolute',
        top: '50%',
        width: 16
    }
};

exports.default = Button;