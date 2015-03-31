function karmaConf(config) {
    config.set({
        browsers: ['Chrome'],

        frameworks: ['mocha', 'source-map-support'],

        files: [
            'node_modules/expect.js/index.js',
            'index.test.js',
            'index.js'
        ],

        client: {
            mocha: {
                reporter: 'html', // change Karma's debug.html to the mocha web reporter
                ui: 'bdd'
            }
        }
    });
}

export = karmaConf;