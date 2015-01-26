require([
    'jquery', 'vendor/pubsub',
    'vendor/lodash'
], function(
    $, ps,
    Lodash
){

	// Create simple global logger
	window.p = console && console.log ? console.log : function () {};

    // Attach jquery to window
    window.$ = $;

    // Attach lodash to window
    window._ = Lodash;

    // Attach pubsub to App
    App.subscribe = ps.subscribe.bind(ps);
    App.unsubscribe = ps.unsubscribe.bind(ps);
    App.publish = ps.publish.bind(ps);

});
