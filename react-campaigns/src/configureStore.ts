import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { Middleware } from 'redux';

import reducers from './reducers'
import { Store } from 'redux';

const configureStore = (): Store<{}> => {

    const middleware: Array<Middleware> = [thunk]
    if (process.env.NODE_ENV !== 'production') {
        const logger: Middleware = createLogger()
        middleware.push(logger)
    }

    const enhancer = applyMiddleware(...middleware)

    const store = createStore(
        reducers,
        enhancer
    )

    return store
}

export default configureStore
