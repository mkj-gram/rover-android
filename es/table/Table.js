'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _layout = require('../../styles/layout');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Table = function (_Component) {
    _inherits(Table, _Component);

    function Table() {
        _classCallCheck(this, Table);

        return _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments));
    }

    _createClass(Table, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.isLoading) {
                this.addSkeleton();
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (this.props.isLoading && !prevProps.isLoading) {
                this.addSkeleton();
            }

            if (!this.props.isLoading && prevProps.isLoading) {
                this.removeSkeleton();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                style = _props.style,
                children = _props.children;


            var containerStyle = _extends({}, Table.defaultStyles.container, style);

            return _react2.default.createElement(
                'div',
                { className: 'Table', style: containerStyle },
                children
            );
        }
    }, {
        key: 'addSkeleton',
        value: function addSkeleton() {
            var element = (0, _reactDom.findDOMNode)(this);

            var body = element.querySelector('.TableBody');
            if (!body) {
                return;
            }

            var row = body.querySelector('.TableRow');
            if (!row) {
                return;
            }

            var bodyHeight = body.getBoundingClientRect().height;
            var rowHeight = row.getBoundingClientRect().height;
            var numRows = Math.ceil(bodyHeight / rowHeight) - 1;

            for (var i = 0; i < numRows; i++) {
                var skeletonRow = row.cloneNode(true);
                skeletonRow.classList.add('SkeletonRow');
                body.appendChild(skeletonRow);
            }
        }
    }, {
        key: 'removeSkeleton',
        value: function removeSkeleton() {
            var element = (0, _reactDom.findDOMNode)(this);

            var body = element.querySelector('.TableBody');
            if (!body) {
                return;
            }

            body.querySelectorAll('.SkeletonRow').forEach(function (element) {
                body.removeChild(element);
            });
        }
    }]);

    return Table;
}(_react.Component);

Table.defaultProps = {
    style: {}
};

Table.defaultStyles = {
    container: _extends({}, _layout.flexContainer)
};

exports.default = Table;