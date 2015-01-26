var winston = require('winston');

// Development only
if(process.env.NODE_ENV != 'development') {
	winston.add(winston.transports.File, { filename: './logs/main.log' });
	winston.remove(winston.transports.Console);
}

// Create logger
exports.createLogger = function(name){

	var winston = require('winston');
	var prepend_message = function(message){
		var d = new Date();
		return d.getDate() + "-"
				+ (d.getMonth()+1) + ' '
				+ zerofill(d.getHours(), 2) + ":"
				+ zerofill(d.getMinutes(), 2) + ":"
				+ zerofill(d.getSeconds(), 2) +
				' [' + name.substr(-20).toLowerCase().replace('.js', '').replace(/\//g, '.') + '] ' + message;
	}

	return {

		info: function(message){
			p(prepend_message(message));
			winston.info(prepend_message(message));
		},

		error: function(message){
			p(prepend_message(message));
			winston.error(prepend_message(message));
		}

	}

}

function zerofill(n, p, c) {
	var pad_char = typeof c !== 'undefined' ? c : '0',
		pad = new Array(1 + p).join(pad_char);
	return (pad + n).slice(-pad.length);
}
