import { applyMiddleware, createStore, Middleware, Store } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducers from './reducers'

const configureStore = (): Store<{}> => {
    const middleware: Array<Middleware> = [thunk]
    if (process.env.NODE_ENV !== 'production') {
        const logger: Middleware = createLogger()
        middleware.push(logger)
    }

    const enhancer = applyMiddleware(...middleware)

    return createStore(reducers, enhancer)
}

export default configureStore
