var load = ['react-router'];

// Don't load react-route Node.js load
var is_node = typeof global != 'undefined';
if(is_node)
    load = [];

define(load, function(RR){
    return is_node && global.ReactRoutes ? global.ReactRoutes : RR;
});
