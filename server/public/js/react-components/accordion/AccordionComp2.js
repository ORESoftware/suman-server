define(function (require, exports, module) {
const React = require('react');

const Section = require('./AccordionSection2');

let Accordion = React.createClass({
    displayName: 'Accordion',

    render: function () {
        return React.createElement(
            'div',
            { className: 'main' },
            React.createElement(
                'div',
                { className: 'title' },
                this.props.title
            ),
            React.createElement(
                Section,
                { title: 'Section Title One' },
                ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet nemo harum voluptas aliquid rem possimus nostrum excepturi!'
            ),
            React.createElement(
                Section,
                { title: 'Section Title Two' },
                ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet nemo harum voluptas aliquid rem possimus nostrum excepturi!'
            ),
            React.createElement(
                Section,
                { title: 'Section Title Three' },
                ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet nemo harum voluptas aliquid rem possimus nostrum excepturi!'
            )
        );
    }
});

module.exports = Accordion;
});
