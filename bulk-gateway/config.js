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
            $default: 'rover-staging'
        },
        credentials: {
            $filter: 'env',
            production: tryParseJson(process.env.STORAGE_CREDENTIALS, {}),
            $default: {"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDfZX4XmvSB9bQx\nHCpug7QZ8nVZwRLuuPNIgQJ6GoA4mXLSqDAIDasz84wopnFSzypiJP3VqlPOYGlj\n9vu5LvTJGVNuPpAshbbz2Tmquulz1enC3+oWUSOdCDHDrbXKkjkedHRcwMgKsu/t\nXtMD5C9gFJRP66u6jtxLoXPrzBTa2vVyn/hKXeujqSq5CNhkBg3KshQTWwXFzKRL\nnbD4ynr+k1vxSIDt08oq2T2qTde/2z7+dkYOIIk01SagybHTzUX4HFgLGYsk092L\ndojqbMw95U+lI8TbL9gj4UR1svBz4HLR4o0l+AkbAnDXovVYbxLGlX8wITWJEfzZ\nG0+ziU8ZAgMBAAECggEAF/9PDDoZCdza/muII1cCgccJ1Bppbjtv5tn06ijunSXe\nr8JhZnwRaANBixxWEA8w/ln66njhh8nTiGl/oOTqZq/RxoXx9tZmUMuE5lItwcO4\n2LY07zDIIpY+wkZmwNv0RtE7rrsGwh92pokJIeHhNPEA/ZTTXbb68yTkzu+dTeUD\n/27TrTCr9Xj7qLyagmFUoaIdP1XufuLTohCN+P7xNBS7YbqFUizJb8vDmaTaCTqu\n/8+ijErtOaZ+pu/FnGomb+BJPYs7OqfO6BHRIePThbRytQ1c6uYhc16Fo58TH3jY\nY8glX2TPYGNOqpU+So6gr9m35A6TvNmi213L84FYAQKBgQD+L//wr0Fnbdj6nbKD\n6dNxs3WEXZMtfLgMulxQVe/82rXIb8NM08l1BAujD8/aZMIVyf5afqoPrVhng9zr\nyX91W0wI0iMsdJ8eTjKjM0ADVvisOvT2MyUC7V7ABIG3EJGh7QC5HKSctF1ID0GM\n6RpgqNIagklfmYJltxbBaAq5bQKBgQDg/Uk5yX+stswS9A4RBfw+5F+C23u0no9D\nm5NpmRMj2S1OCN6ME5BPdSjTbM2QoCm8Bfj/fYSskBRMlpULalAJ2RQM+WGv7cSw\nssQk/7jOX6cYmLnKSINm52IwlRf18yngJNzXQM9lOulENHTd+CuPQzP8CF8dqmuH\nPevadzqs3QKBgQClfz8WyCS/YMf7NJ28QYvH5d5H1l0zKpbywovESo+8g/IDlLEF\n3oa2R3IEMxFT0nKDmUagSQQUvPpoO3SlmEYCdPTmcVsxYKURKDzUAVRWWFQEX0aK\n3fXlGAOu5cBHHuSTFyp3W+zZkp2Bg11cj5D7Ci/xzo5TTjGWZETOnB0PaQKBgQC9\nxEU4DYG3vrLgJaObri21KlB5AgEUNkzmHFm4zpj7Opng4NA8299zdYFK2tGD8+Nf\nqLX9YPQ/zIKimrv51eDOfZ9Q1iMUDXtCAnY4MszAnKNGtsK2IHVcnTsPeSGtnDys\nxsrSb+K+InNPyOLtuf2bp3Y4VSNM1Uo+1vaQ3NHLrQKBgQC5tIDumJ5pRb2Z4KZC\nvG4+mMxDqTf39fJRu7xIavdbihthbIPXoTl6YH5hPvuI/Ul87Tvs1Vnms2MX0TGL\nkpg+CP1Tnyf3vvHGslHVINakvqWmpvnNwpZbEudXP/69mmRVwsCrHFgcgvYRJkb+\nq/Ae250LuiKllZv2nZR1Zk7nbQ==\n-----END PRIVATE KEY-----\n","client_email": "bulk-gateway-v1@rover-staging.iam.gserviceaccount.com"}        
        },
        bucket_name: {
            $filter: 'env',
            production: process.env.STORAGE_BUCKET_NAME,
            $default: 'bulk-gateway-v1-uploads'
        }
    },
    raven: {
        enabled: {
            $filter: 'env',
            production: process.env.RAVEN_ENABLED == 'true',
            $default: false
        },
        dsn: {
            $filter: 'env',
            production: process.env.RAVEN_DSN,
            $default: ''
        }
    }
});

const criteria = {
    env: process.env.APP_ENVIRONMENT || process.env.NODE_ENV || "development"
};


module.exports = {
    get: (key) => store.get(key, criteria)
}