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
        $default: process.env.PORT || 5200
    },
    http: {
        port: {
            $filter: 'env',
            production: parseInt(process.env.PORT) || 8080,
            $default: parseInt(process.env.PORT) || 8080
        }
    },
    raven: {
        enabled: {
            $filter: 'env',
            production: process.env.RAVEN_ENABLED === 'true',
            $default: false
        },
        dsn: {
            $filter: 'env',
            production: process.env.RAVEN_DSN,
            $default: ''
        }
    },
    postgres: {
        dsn: {
            $filter : 'env',
            production: process.env.POSTGRES_DSN,
            $default: 'postgres://postgres:@localhost/files-service-local?sslmode=disable'
        }
    },
    storage: {
        credentials: {
            project_id: {
                $filter: 'env',
                production: process.env.STORAGE_CREDENTIALS_PROJECT_ID,
                $default: 'rover-development'
            },
            key_file: {
                $filter: 'env',
                production: process.env.STORAGE_CREDENTIALS_KEY_FILE,
                $default: undefined
            },
            json: {
                $filter: 'env',
                production: tryParseJson(process.env.STORAGE_CREDENTIALS_JSON, {}),
                $default: {  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6jzBfdYq5LeQu\nA0yIp5EHZ/getaA4Lqt+fcZlzxBo/LTar4lP6DyFVBY/hPYV4VlCuDBEbACqWdYR\nZoigBB4C6aU/+Dk4dUGML4MmUjJx3GYlHJLShJKySRCl137dio9+mZvuRNaXFW/b\nG3v49CtBZOeurybcRm+YusxlA+sxoqBDXD151pO/Jz67GOBatnLElEu9v3aUbD4n\nLT7q5+K/28w1qODycyIeJkNDNvFcUvXc/CASPZnYOS0IkJD1fVDs6Vj+OqneC2GR\nFDx7raWnHDIsGARq8sKguhKpUKWTD6mYOe6s6Q/GtxOLoFvgi4HgwGlKM1nYwu49\ngqmUVzjDAgMBAAECggEAQy6KVG3/MVVh3OIKPxHcy8Z4lxJ/6ot/7XK8rfAFsFEE\njdX1xEVU+gyAYIpwlguLOdgbZaBhEvd7+9MpMzqYViMug51PedHb83Ause+aw98D\nF601AEOGklZ2fMpgIMajiwslGIZIoqqxF73LhKjlJM0CE6l2fI+O43itX1ksarhQ\nqdSxRe11oBA//FTDGuJSe2cfw6/YURewKEXpUmOrsn5RlC1veD0hQmY42f0jp0lg\nBq8eipTcRNg3liJSja9Ai08Mv4eNMrMnMEQe2ZzzXgMM2TIYj9//yTUXYtqkMCGr\nMorQCRQLIu9wfTK//QBGfiIHUJAgGRO23MFgiyf0TQKBgQDjWceJ9CwKWjDpu4Na\nAdEDfiV3genxv5A8/Bi8/3p/cHmLEpOEYsOxiXhBFl+yr6WliNLuNkmZGJI4nMgj\nsFYU9mRIq9tOqpTQRTientZxPJz+sgR3AvFwf8gQKTamx9wytaUgNNO4JyEbf7a4\nfpNAXVC8cSBpQ01yNOe5o2cdhQKBgQDSEYAOz6RIXtRY3VIHUxrHAUwGHeOcAHh6\ngXui8NWwQjAfia0mkTreu+t182Tb+JG/Ycy7BSx1fV1qrz4pHe6J6RWfx+pLwdyb\n0EcJFcC2lqxQ85fSF1r4riJa1z90qukPR+p86PKqsnWMIaMV+FeN5o1zjqxqW6f1\nEp67BclLpwKBgGjWhLIz238mmfmeU3LU9ZpDuGlEiinFaXEF2y6ELOvJZPLhrQ7W\nMGGU/9QbyiNu5dbQolvgws2LTBo5Cf2TGg7uk84DGc1L0fW8heB3ZHGxPsAgPPjY\nbZewBQSWzLHZ5cuoga25ToxT1uuEWDD5hVOf9FQBYq3HsFXi2Zx8Ile1AoGAQ4YQ\njbI88m5Y/3+UwHn8H3/ROh4dbaXRFD/OyB918MQ1x81vdPg13ia1lyJ3hyWtY8FC\nF9Of6Nw1TPermXffl0DvDH8sVtGn4gXe75KocYiZNyQ15vhO66S9skmCQjQ12g2Z\n2DDg3/GhSzv8ujEro5c6XKy9yypPIL2tfBxuCf0CgYEA3rH2tZMhB8bXHoakZnQZ\nGiKRaOCSgW8lZk0Jtyp9dM33L3UitC2A9ZmCrfJXdkc9yF13vcgFFH+gDytTVxVv\nLDepi8Es9pWT4e/1PXqyFiV8MEwEQ1vekgJbtIiAPeP4CWSYuZiIJ/y8T3lAeHe+\nTEBnd9eeXizjU3ShFblcBQc=\n-----END PRIVATE KEY-----\n","client_email": "files-service@rover-development.iam.gserviceaccount.com" }
            }
        },
        config: {
            csv_bucket: {
                $filter: 'env',
                production: process.env.STORAGE_CONFIG_CSV_BUCKET,
                $default: 'rover-development-csv-files'
            }
        }
    }
})


const criteria = {
    env: process.env.APP_ENVIRONMENT || process.env.NODE_ENV || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}