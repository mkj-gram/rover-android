'use strict';

const Confidence = require('confidence');

const tryParseJson = function(input, fallback) {
    if (!input) {
        return fallback
    }

    try {
        const json = JSON.parse(input)
        return json
    } catch (e) {
        console.error(e)
        return fallback || {}
    }
}

const store = new Confidence.Store({
    host: {
        $filter: 'env',
        production: '0.0.0.0',
        $default: '0.0.0.0'
    },
    port: {
        $filter: 'env',
        production: process.env.PORT,
        $default: 3100
    },
    storage: {
        project_id: {
            $filter: 'env',
            production: process.env.STORAGE_PROJECT_ID,
            $default: 'rover-development'
        },
        credentials: {
            $filter: 'env',
            production: tryParseJson(process.env.STORAGE_CREDENTIALS, {}),
            $default: {"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC9CvdtUt5ZNmYM\n1A8FTBe+Ielcn8FQKVZNlEwiVV8cuuNVKVO5OysbUHnsLKOLBc4T2wESbQpoSsUf\nkkvPYHCiWuoqVUyCQMpl/U39c+HOx4TcUMifYP/xy2+S3jQ1gyJtwwvKDKnvnbVR\nsN4e/WeQGRRQTmEtHOH3tamNLL2iwkP0wdJWKVPwHBL+JD5rAkn8ixMgBfR5O9Zw\no0hQQutJeZk6u4bw3WE5+fdAp1l+onf5Jp+fSJTwyPvnKivG9AR9vm/nvv/59KZ1\nvK25oJopE+ovYoBEBN57hGUm6ucf625wUU59JoxqBT2Yvn3cEfB5pRo3z9TJbqH9\n57RZ1eblAgMBAAECggEAWNfekLJxbNvz+fNvW733KpQlaDJsV5AVzz/yx+/3UzlB\nvbQ+dL8p8xxPMH+KHLwNracvScmVKo55Ne07U6qvRJ4Vju+nlU99z5DMJmFfrh52\nglQ09TJRFwHU3eEwCDYo6AzSbZKmCsbDgDDvMwFEuqQOt+8eHGWGjTQDCyYLuYFj\n8QDyiQjGI+OkO/xDimvRq5uBShApX9LAeT3vlm09b106WjojvNfCKSsyq0GaWx5k\nPEe+JH+yXQ5TB10oB4mWjTnP1+7ymeHz+bQ3YjvobOUUdnihwtSIp0gF6b6ePrqf\nNSpeKcniENbKUEEP9n5llnn66MH2+2/nh8s30fjjwQKBgQDo9FZmvExw6LFHsIId\nZ9p7S/rlv8+sCZAXgZ4bu3aaDTcBNjNXZjfa8aCxKeOlQxmxShouuLQs5lbw+NiG\nmhI1cmuTYwkTXWZV+t7h2/clMwIg3bVLdd4/J/zhVQqs/mzkVXxrq+ooXC2C6Q2Z\nDkkSI6ZOy82FEplkDn7QXPBUzwKBgQDPvoznVDd1NZ2HFYI3TG/JLO31eZm6igjV\nkyOwEbMEh7VH5cZOvEnFk6QuGP1frhisZYpLB9gsOUBOCsbP0zxBfUpf5SLi1IFu\ntD+qbrkxmLu7hn8f1L92RKESXgGsY4PgSDvKUCvvVdkZco4urovcKuk9PGz4GOuP\nIFN7nc4eCwKBgQDiuhRxryjS55bLiF5LEm4RfJS4EaSk8zW7uxrQMPcw3lW/pyn3\nEXShcnSMmZGHojQaWl37RSePX6wUoo3TC5dXT4KmE0idAVV9r0pIFteG7AtRQ5eU\n1yY0381+3k8iqgn/fbg37z1ahMSC2iKy6bVyoyHVJQRlVQHX4UfJsfry/wKBgQDC\nhQTAkm2/NS3ET9J23v6I26YQxQS50wgEm1q+QURjiIKoyLDQBqP4+Y6wjzuoPIbj\n3cwJB1ZVymG48YRJEtyH4b4jXpU02ZA8TVCT0Etd8kpOg9hCwN1p60b6wMVGWoQg\nHOLHRBxvZO38UvRpJ4zT4eY1LYBHKmZexQEGbbOTEwKBgQCOLjl/u4Z5OOk1V20C\ny8tR6LwTwFbsOvCWmNUF8nirgWKVwnbwUl3XO6ibJlHDKs8h2U0wG52eskrne3uR\n6eGQ3H/4pZJ3Bun5LepraRiQF0Kpc/N2RKlqLDFTO8BM5ZFUi2bpq+4JVR7DyzAY\npyRypcYHtb/0jUWuGGvZvMpHrg==\n-----END PRIVATE KEY-----\n","client_email": "bulk-service@rover-development.iam.gserviceaccount.com"}
        },
        bucket_name: {
            $filter: 'env',
            production: process.env.STORAGE_BUCKET_NAME,
            $default: 'bulk-service'
        }
    },
    postgres: {
        username: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_USERNAME,
            $default: 'rover_development'
        },
        password: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_PASSWORD,
            $default: 'password1'
        },
        database: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_DATABASE,
            $default: 'rover-local'
        },
        host: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_HOST,
            $default: 'localhost'
        },
        port: {
            $filter: 'env',
            production: process.env.POSTGRESQL_DB_PORT,
            $default: 5432
        },
        ssl: {
            $filter: 'env',
            production: true,
            $default: false
        }
    }
});

const criteria = {
    env: process.env.APP_ENVIRONMENT || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}