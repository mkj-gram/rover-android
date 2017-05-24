const Config = require('./config');
const async = require('async');
const router = require('./router');

const server = {
    plugins: {},
    connections: {},
    methods: {}
};



if (Config.get('/raven/enabled')) {
    const raven = require('raven');
    const ravenClient = new raven.Client(Config.get('/raven/url'));
    ravenClient.patchGlobal();
}


// Setup Log4js application wide
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


const postgresConnectionOptions = {
    host: Config.get('/postgres/host'),
    port: Config.get('/postgres/port'),
    user: Config.get('/postgres/username'),
    password: Config.get('/postgres/password'),
    database: Config.get('/postgres/database'),
    ssl: Config.get('/postgres/ssl')
};

tasks.push(function(callback) {
    let postgres = require('./connections/postgres');
    postgres.register(server, postgresConnectionOptions, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("Postgres Pool initialized!");
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
    let elasticsearch = require('./connections/elasticsearch');
    elasticsearch.register(server, { host: Config.get('/elasticsearch/hosts'), log: Config.get('/elasticsearch/log') }, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info("Elasticsearch Client initialized!");
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


// Register application common code
tasks.push(function(callback) {
    let common = require('./application/common');
    common.register(server, {}, (err) => {
        if (err) {
            return callback(err);
        }
        Logger.info('Application common initialized');
        return callback();
    });
});


// Register the services
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

const flush = function(cb) {
    server.connections.elasticsearch.queue.flush(function(err) {
       cb(err)
    })
}

async.series(tasks, (err) => {
    var mongo = server.connections.mongodb.client;

    var col = mongo.collection('customers')
    var cursor = col.find({})

    var docCount = 0

    cursor.on('data', function(doc) {
        docCount++
        server.methods.customer.index(doc, function() {})

        if (docCount >= 5000) {
            cursor.pause()
            console.log('flushing')
            flush(function(err) {
                if (err) {
                    console.log(err)
                }

                docCount = 0
                cursor.resume()
            })
        }
    });

    cursor.once('end', function() {
        console.log('finished streaming!')

        flush(function(err) {
            if (err) {
                console.log(err)
                console.log("YOU CAN EXIT NOW")
            }
        })
    });
})