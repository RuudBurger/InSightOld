var knex = require('knex')({
	client: 'mysql',
	connection: settings.database
});
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('visibility');

/**
 * Meter data
 */
var P1 = bookshelf.Model.extend({
	tableName: 'p1_log'
});


module.exports = {
	'P1': P1
}
