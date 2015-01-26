module.exports = {
	common: {
		whitelisted_ips: ['::1', '127.0.0.1'],
		jwt_secret: '',
		cors_origin: 'http://localhost:9000',
		database: {
			host: '127.0.0.1',
			user: 'your_database_user',
			password: 'your_database_password',
			database: 'myapp_test'
		}
	},

	development: {},
	production: {}
};
