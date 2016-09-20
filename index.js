'use strict';
const Hapi = require('hapi');
const Config = require('./config');
const async = require('async');
const server = new Hapi.Server();

if (Config.get('/raven/enabled')) {
    const raven = require('raven');
    const ravenClient = new raven.Client(Config.get('/raven/url'));
    ravenClient.patchGlobal();
}

server.connection({
    host: Config.get('/connection/host'),
    port: Config.get('/connection/port')
});

// Setup Log4js application wide
var logger; 

let tasks = [];

tasks.push(function(callback) {
    server.register(require('./plugins/logger'), (err) => {
        if (err) {
            return callback(err);
        }
        logger = server.plugins['logger'].logger;
        logger.info("Log4js initialized!");
        return callback();
    });
});

tasks.push(function(callback) {
    server.register(require('./plugins/librato'), (err) => {
        if (err) {
            return callback(err);
        }
        logger = server.plugins['logger'].logger;
        logger.info("Librato initialized!");
        return callback();
    })
});



// Setup a connection pool to postgres

const postgresConnectionOptions = {
    host: Config.get('/postgres/host'),
    port: Config.get('/postgres/port'),
    user: Config.get('/postgres/username'),
    password: Config.get('/postgres/password'),
    database: Config.get('/postgres/database')
};

tasks.push(function(callback) {
    server.register({
        register: require('./connections/postgres'),
        options: postgresConnectionOptions
    }, (err) => {
        if (err) {
            return callback(err);
        }
        logger.info("Postgres Pool initialized!");
        return callback();
    });
});


tasks.push(function(callback) {
    server.register({
        register: require('./connections/redis'),
        options: { url: Config.get('/redis/url')}
    }, (err) => {
        if (err) {
            return callback(err);
        }
        logger.info("Redis Client initialized!");
        return callback();
    });
});

tasks.push(function(callback) {
    server.register({
        register: require('./connections/mongodb'),
        options: { urls: Config.get('/mongo/urls'), sslCertFile: Config.get('/mongo/sslCertFile') }
    }, (err) => {
        if (err) {
            return callback(err);
        }
        logger.info("MongoDB Client initialized!");
        return callback();
    });
});


tasks.push(function(callback) {
    server.register({
        register: require('./connections/elasticsearch'),
        options: { host: Config.get('/elasticsearch/hosts'), log: Config.get('/elasticsearch/log') }
    }, (err) => {
        if (err) {
            return callback(err);
        }
        logger.info("Elasticsearch Client initialized!");
        return callback();
    });
})

tasks.push(function(callback) {
    server.register({
        register: require('./connections/rabbitmq'),
        options: { url: Config.get('/amqp/url')}
    }, (err) => {
        if (err) {
            return callback(err);
        }
        logger.info("RabbitMQ Client initialized!");
        return callback();
    });    
})

tasks.push(function(callback) {
    server.register(require('./connections/fluentd'), (err) => {
        if (err) {
            return callback(err);
        }
        logger.info("RabbitMQ Client initialized!");
        return callback();
    });   
})


// register application common code
tasks.push(function(callback) {
    server.register(require('./application/common'), (err) => {
        if (err) {
            return callback(err)
        }
        logger.info('Application common initialized');
        return callback();
    });  
})


// register rover token auth scheme
tasks.push(function(callback) {
    server.register([require('./auth/rover-api-auth'), require('./application/rover-auth-strategies')], (err) => {
        if (err) {
            return callback(err);
        }

        logger.info("X-Rover-Api-Key auth strategy initialized!");
        return callback();
    });   
});


// Register the services
tasks.push(function(callback) {
    server.register(require('./services/v1'), (err) => {
        if (err) {
            return callback(err);
        }

        logger.info("Services initialized!");
        return callback();
    });
});

// Register the controllers
tasks.push(function(callback) {
    server.register([require('./controllers/v1/event'), require('./controllers/v1/inbox'), require('./controllers/v1/inbox-message'), require('./controllers/v1/inbox-landing-page')], (err) => {
        if (err) {
            return callback(err);
        }
        logger.info("Controllers initialized!");
        return callback();
    });
});


process.on('SIGINT', function() {
    console.log("Shutting down");
    let queue = server.plugins.elasticsearch.queue;

    queue.flush(function() {
        process.exit(0);
    });
});


async.series(tasks, function(err) {
    if (err) {
        throw err;
    }

    server.start((err) => {
    if (err) {
            throw err
        }

        logger.info('Server running at:', server.info.uri);
    });
});
