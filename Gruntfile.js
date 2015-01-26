'use strict';

module.exports = function(grunt){

	// Configurable paths
	var config = {
		tmp: '.tmp',
		client: 'client',
		server: 'server'
	};

	grunt.initConfig({

		// Project settings
		config: config,

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				unused: false,
				camelcase: false,
				devel: true
			},
			all: [
				'<%= config.client %>/scripts/{,*/}*.js',
				'!<%= config.client %>/scripts/vendor/*',
				'test/spec/{,*/}*.js'
			]
		},

		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			options: {
				compass: true
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.client %>/styles',
					src: ['*.scss'],
					dest: '<%= config.tmp %>/styles',
					ext: '.css'
				}]
			},
			server: {
				files: [{
					expand: true,
					cwd: '<%= config.client %>/styles',
					src: ['*.scss'],
					dest: '<%= config.tmp %>/styles',
					ext: '.css'
				}]
			}
		},

		react: {
			jsx: {
				files: [{
					expand: true,
					cwd: '<%= config.client %>/react',
					src: ['**/*.jsx'],
					dest: '.tmp/react',
					ext: '.js'
				}]
			}
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['> 1%', 'Android >= 2.1', 'Chrome >= 21', 'Explorer >= 7', 'Firefox >= 17', 'Opera >= 12.1', 'Safari >= 6.0']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.tmp %>/styles/',
					src: '{,*/}*.css',
					dest: '<%= config.tmp %>/styles/'
				}]
			}
		},

		lodash: {
			build: {
                dest: '<%= config.client %>/scripts/vendor/lodash.js',
                options: {
                    include: ['each', 'difference', 'union', 'pluck']
                }
            }
		},

		// COOL TASKS ==============================================================
		watch: {
			scss: {
				files: ['<%= config.client %>/styles/{,*/}*.{scss,sass}'],
				tasks: ['sass:server', 'autoprefixer'],
				options: {
					'livereload': true
				}
			},
			js: {
				files: [
                    '<%= config.client %>/scripts/**/*.js',
                    '<%= config.tmp %>/react/*.js'
                ],
				tasks: ['jshint'],
				options: {
					'livereload': true
				}
			},
			react: {
				files: ['<%= config.client %>/react/{,*/}*.jsx'],
				tasks: ['react']
			},
			livereload: {
				options: {
					livereload: 35729
				},
				files: [
					'<%= config.client %>/{,*/}*.html',
					'<%= config.tmp %>/styles/{,*/}*.css',
					'<%= config.client %>/react/{,*/}*.js',
					'<%= config.client %>/images/{,*/}*'
				]
			}
		},

		nodemon: {
			dev: {
				script: 'app.js'
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			tasks: ['react', 'sass:server', 'nodemon', 'watch']
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	//grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-lodash');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['sass', 'jshint', 'concurrent']);
    grunt.registerTask('build', ['lodash']);

};
