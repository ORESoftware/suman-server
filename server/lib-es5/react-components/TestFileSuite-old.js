'use strict';

let _stringify2 = JSON.stringify;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by denmanm1 on 3/30/16.
 */

let React = require('react');
let _ = require('lodash');

module.exports = React.createClass({
    displayName: 'exports',


    findChildren: function findChildren(ids) {
        return this.props.data.filter(function (item) {
            return _.includes(ids, item.testId);
        });
    },

    recurse: function recurse(item) {
        let _this = this;

        let children = this.findChildren(item.children.map(function (child) {
            return child.testId;
        }));

        return React.createElement(
            'div',
            { className: 'describe' },
            item.desc,
            React.createElement(
                'div',
                { className: 'test-cases' },
                'Test Cases:',
                (0, _stringify2)(item.tests)
            ),
            React.createElement(
                'div',
                { className: 'suite-children' },
                item.children.length > 0 ? 'Children of ' + item.desc : '(no children)',
                children.map(function (child) {
                    return _this.recurse(child);
                })
            )
        );
    },

    getDescribes: function getDescribes() {
        console.log('data:', this.props.data);
        if (this.props.data && this.props.data[0]) {
            return this.recurse(this.props.data[0]);
        } else {
            return React.createElement(
                'div',
                null,
                'Insert spinner here'
            );
        }
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'accordion-item' },
            this.getDescribes()
        );
    }

});