var jwt = require('express-jwt'),
    Promise = require('bluebird'),
	log = createLogger(__filename);

exports.setup = function(app){

	// Dashboard
    var dashboard_route = '/dashboard/';
	api.addFor(dashboard_route, 'dashboard', function(){

        return new db.P1()
            .query(function(qb) {
                qb.whereRaw('p1_timestamp >= NOW() - INTERVAL 1 DAY');
            }).fetchAll().then(function(collection){

            var usage = {
                'timestamps': [],
                'elec_high': [],
                'elec_low': [],
                'usage': [],
                'gas': []
            };

            var avg_usage = 0,
                counter = 0,
                every = 6;

            collection.forEach(function(item, nr){
                avg_usage += item.get('p1_current_power_in');
                counter++;

                if(nr % every == every-1 || nr == collection.length - 1){
                    usage.timestamps.push(item.get('p1_timestamp').getTime() / 1000);
                    usage.elec_high.push(item.get('p1_meterreading_in_2'));
                    usage.elec_low.push(item.get('p1_meterreading_in_1'));
                    usage.usage.push(Math.round((avg_usage / counter) * 1000));
                    usage.gas.push(item.get('p1_channel_1.meterreading'));

                    avg_usage = counter = 0;
                }
            });

            return usage;
        });
	});

	app.get('/_api'+dashboard_route, function(req, res){

		api.get('/dashboard')
			.then(function(props){
				res.json(props);
			})
			.catch(function(e){
				res.status(300).json({
					'ohoh': 'Something isn\'t right',
					'message': e
				});
			});

	});


    // Current usage
    var current_usage_route = '/current_usage/';
    api.addFor(current_usage_route, 'current_usage', function(){

        return new db.P1()
            .query(function(qb){
                qb.orderBy('p1_timestamp', 'DESC');
            }).fetch().then(function(model){

                return {
                    'timestamp': model.get('p1_timestamp').getTime() / 1000,
                    'elec_high':  model.get('p1_meterreading_in_1'),
                    'elec_low': model.get('p1_meterreading_in_2'),
                    'usage': Math.round(model.get('p1_current_power_in') * 1000),
                    'gas': model.get('p1_channel_1.meterreading')
                };
            });
    });

    app.get('/_api'+current_usage_route, function(req, res){

        api.get('/current_usage')
            .then(function(props){
                res.json(props);
            })
            .catch(function(e){
                res.status(300).json({
                    'ohoh': 'Something isn\'t right',
                    'message': e
                });
            });

    });

};
