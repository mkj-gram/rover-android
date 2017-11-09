'use strict';

const Config = require('./config');
const async = require('async');
const Worker = require('./worker');


process.setMaxListeners(0);

const server = {
	plugins: {},
	connections: {},
	methods: {}
}

if (Config.get('/raven/enabled')) {
	const raven = require('raven');
	const ravenClient = new raven.Client(Config.get('/raven/url'));
    server.plugins.raven = {
        client: ravenClient
    };
    ravenClient.patchGlobal(); 
}

var Logger;

let tasks = [];

tasks.push(function(callback) {
	let logger = require('./plugins/logger');
    logger.register(server, {}, (err) => {
        if (err) {
            return callback(err);
        }

        Logger = server.plugins.logger.logger;
        Logger.info("Log4js initialized");
        return callback();
    });
});

tasks.push(function(callback) {
    let librato = require('./plugins/librato');
    librato.register(server, {}, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("Librato initialized!");
        return callback();
    });
});


tasks.push(function(callback) {
    let redis = require('./connections/redis');
    redis.register(server, { url: Config.get('/redis/url') }, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("Redis Client initialized!");
        return callback();
    });
});

tasks.push(function(callback) {
    let redis = require('./connections/redis');
    // Workaround to initalize a new redis client without overwriting the old one
    let initblock = { connections: {}, plugins: { logger: { logger: server.plugins.logger.logger } } }
    redis.register(initblock, { url: Config.get('/redis/inbox_url') }, (err) => {
        if (err) {
            return callback(err);
        }

        server.connections.redis.inbox = {}
        server.connections.redis.inbox.client = initblock.connections.redis.client

        Logger.info("Redis Inbox Client initialized!");
        return callback();
    });
});


tasks.push(function(callback) {
    let mongo = require('./connections/mongodb');
    mongo.register(server, { urls: Config.get('/mongo/urls'), sslCA: [ Config.get('/mongo/sslCert') ] }, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("MongoDB Client initialized!");
        return callback();
    });
});

tasks.push(function(callback) {
    let rabbitmq = require('./connections/rabbitmq');
    rabbitmq.register(server, { url: Config.get('/amqp/url') }, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("RabbitMQ Client initialized!");
        return callback();
    });
});


tasks.push(function(callback) {
    let fluentd = require('./connections/fluentd');
    fluentd.register(server, {}, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("FluentD Client initialized!");
        return callback();
    });
});

tasks.push(function(callback) {
    let audience = require('./connections/audience')
    audience.register(server, {}, (err) => {
        if (err) {
            return callback(err)
        }
        Logger.info("Audience Client initialized!")
        return callback()
    })
})

tasks.push(function(callback) {
    let services = require('./services/v1');
    services.register(server, {}, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("Services initialized!");
        return callback();
    });
});


process.on('SIGINT', function() {
    console.log("Shutting down");
    let tasks = [];
    let queue;
    let librato;

    if (server.connections && server.connections.elasticsearch && server.connections.elasticsearch.queue) {
        queue = server.connections.elasticsearch.queue;
    }

    if (server.plugins && server.plugins.librato && server.plugins.librato.client) {
        librato = server.plugins.librato.client;    
    }
    

    if (librato) {
        tasks.push(function(callback) {
            librato.stop(function(err) {
                if (err) {
                    console.error(err);
                }
                return callback();
            });
        });
    }
    if (queue) {
        tasks.push(function(callback) {
            queue.flush(function() {
                return callback();
            });
        });
    }

    if (tasks.length > 0) {
        async.parallel(tasks, function(err, results) {
            if (err) {
                console.error(err);
            }
            return process.exit();
        })
    } else {
        return process.exit();
    }
    
});


async.series(tasks, (err) => {
    if (err) {
        throw err;
    }
    
    let SegmentClient = require("@rover/segment-client").v1.Client()

    server.connections["segment"] = SegmentClient

    const worker = new Worker(server);

    let channel = server.connections.rabbitmq.channel;
    channel.assertQueue('send_message_to_customers', { durable: true }).then(function(queue) {
        server.connections.rabbitmq.workerQueue = queue;
        return channel.bindQueue(queue.queue, "background_jobs", queue.queue);
    })
    .then(function() {
        let queue = server.connections.rabbitmq.workerQueue;
        return channel.bindQueue(queue.queue, "delayed_exchange", queue.queue);
    })
    .then(function() {
        return channel.prefetch(Config.get("/worker/concurrency"));
    })
    .then(function() {
        Logger.info("[*] Waiting for messages. To exit press CTRL+C");
        return channel.consume('send_message_to_customers', function(msg) { worker.work(msg) }, {});
    })
    .catch(err => { throw err });
});



