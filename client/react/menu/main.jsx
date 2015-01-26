define([
	'react', 'js/router_helper'
], function(
	React, ReactRouter
) {

    var Link = ReactRouter.Link;

	return React.createClass({
		getInitialState: function () {
			return {};
		},

		render: function () {
			return (
                <menu className="main_menu">
                    <Link to="app">Home</Link>
                </menu>
			);
		}
	});
})
