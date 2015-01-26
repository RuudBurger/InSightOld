define([
    'react', 'js/router_helper',
    'r/root', 'r/dashboard'
], function(
    React, ReactRouter,
    Root, Dashboard
){

    var Route = ReactRouter.Route,
        DefaultRoute = ReactRouter.DefaultRoute;

    return (
        <Route name="app" path="/" handler={Root}>
            <Route name="dashboard" path="/dashboard/" handler={Dashboard} />
            <DefaultRoute handler={Dashboard} />
        </Route>
    );

});
