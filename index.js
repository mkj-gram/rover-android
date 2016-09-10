'use strict';
const Hapi = require('hapi');
const Config = require('./config');

const server = new Hapi.Server();


server.connection({
    host: Config.get('/connection/host'),
    port: Config.get('/connection/port')
});

// Setup Log4js application wide
var logger; 

server.register(require('./logger'), (err) => {
    if (err) {
        throw err;
    }
    logger = server.plugins['logger'].logger;
    logger.info("Log4js initialized!");
});


// Setup a connection pool to postgres
// 
const postgresConnectionOptions = {
    host: Config.get('/postgres/host'),
    port: Config.get('/postgres/port'),
    user: Config.get('/postgres/username'),
    password: Config.get('/postgres/password'),
    database: Config.get('/postgres/database')
};

server.register({
    register: require('./connections/postgres'),
    options: postgresConnectionOptions
}, (err) => {
    if (err) {
        throw err;
    }
    logger.info("Postgres Pool initialized!");
});


server.register({
    register: require('./connections/redis'),
    options: { url: Config.get('/redis/url')}
}, (err) => {
    if (err) {
        throw err;
    }
    logger.info("Redis Client initialized!");
});

server.register({
    register: require('./connections/mongodb'),
    options: { urls: Config.get('/mongo/urls'), sslCertFile: Config.get('/mongo/sslCertFile') }
}, (err) => {
    if (err) {
        throw err;
    }
    logger.info("MongoDB Client initialized!");
});

server.register({
    register: require('./connections/elasticsearch'),
    options: { host: Config.get('/elasticsearch/hosts'), log: Config.get('/elasticsearch/log') }
}, (err) => {
    if (err) {
        throw (err);
    }
    logger.info("Elasticsearch Client initialized!");
});

server.register({
    register: require('./connections/rabbitmq'),
    options: { url: Config.get('/amqp/url')}
}, (err) => {
    if (err) {
        throw (err);
    }
    logger.info("RabbitMQ Client initialized!");
});

server.register(require('./connections/fluentd'), (err) => {
    if (err) {
        throw (err);
    }
    logger.info("RabbitMQ Client initialized!");
});

// register application common code
server.register(require('./application/common'), (err) => {
    if (err) {
        throw err;
    }
    logger.info('Application common initialized');
});

// register rover token auth scheme
server.register([require('./auth/rover-api-auth'), require('./application/rover-auth-strategies')], (err) => {
    if (err) {
        throw err;
    }

    logger.info("X-Rover-Api-Key auth strategy initialized!");
});

// Register the services
server.register(require('./services/v1'), (err) => {
    if (err) {
        throw err;
    }

    logger.info("Services initialized!");
});

// Register the controllers
server.register([require('./controllers/v1/event'), require('./controllers/v1/inbox'), require('./controllers/v1/inbox-message'), require('./controllers/v1/inbox-landing-page')], (err) => {
    if (err) {
        throw err;
    }
    logger.info("Controllers initialized!");
});


server.start((err) => {
    if (err) {
        throw err
    }

    logger.info('Server running at:', server.info.uri);
});