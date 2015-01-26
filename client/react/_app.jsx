require.config({
    baseUrl: '/',
    paths: {
        'r': '/react',
        'js': '/scripts',
        'vendor': '/scripts/vendor',
        //'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
        //'react': '//cdnjs.cloudflare.com/ajax/libs/react/0.12.0/react.min',
        'jquery': '/scripts/vendor/jquery',
        'highcharts': '/scripts/vendor/highcharts',
        'highcharts-more': '/scripts/vendor/highcharts-more',
        'highcharts-gauge': '/scripts/vendor/highcharts.solid-gauge',
        'react': '/scripts/vendor/react', // Local,
        'react-router': '/scripts/vendor/react-router',
        'react-router-shim': '/scripts/react_router_shim'
    },
    shim: {
        'react-router-shim': {
            exports: 'React'
        },
        'react-router': {
            deps: ['react-router-shim'],
            exports: 'ReactRouter'
        },
        'highcharts': {
            'exports': 'Highcharts',
            'deps': [ 'jquery']
        },
        'highcharts-more': {
            'exports': 'HighchartsMore',
            'deps': ['jquery','highcharts']
        },
        'highcharts-gauge': {
            'exports': 'HighchartsGauge',
            'deps': ['jquery','highcharts']
        }
    }
});

require([
    'js/helpers', 'vendor/jquery.storageapi',
    'js/api',
    'react', 'js/router_helper',
    'r/_routes',
], function(
    helpers, storage,
    API,
    React, ReactRouter,
    routes
){
    ReactRouter.run(routes, ReactRouter.HistoryLocation, function(Handler) {
        React.render(<Handler {...initial_state} />, document.getElementById('app'));

        // Clear initial state
        initial_state = null;
    });

});
