var React = require('react'),
    fs = require('fs'),
    url = require('url');

var index_html = fs.readFileSync(paths.server + '/views/index.html').toString();

exports.setup = function(app){

	app.get(/^(?!(\/_api)).*$/, function(req, res){

		requirejs([
            'r/_routes'
        ], function(
            Routes
        ){

            var path = url.parse(req.url).pathname;
            var render_react = function(data){
                data = data || {};

                ReactRoutes.run(Routes, path, function(Handler){
                    var html = React.renderToString(React.createElement(Handler, _.assign({}, data), null));

                    res.send(index_html
                        .replace('<!-- {INITIAL_CSS} -->', '')
                        .replace('<!-- {INITIAL_DATA} -->', JSON.stringify(data))
                        .replace('<!-- {CONTENT} -->', html)
                    );
                });
            };

            api.get(path)
                .then(function(props){

                    _.each(props, function(prop, name){
                        props[name] = prop.toJSON ? prop.toJSON() : prop;
                    });

                    render_react(props);
                })

        });

	});

};
