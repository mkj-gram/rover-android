package io.rover.rover.core.data.http

interface NetworkClient {
    /**
     * Perform the given HttpRequest and then deliver the result to the given [completionHandler].
     *
     * Note that [completionHandler] is given an [HttpClientResponse], which includes readable
     * streams.  Thus, it is called on the background worker thread to allow for client code to
     * read those streams, safely away from the Android main UI thread.
     */
    fun networkTask(
        request: HttpRequest,
        bodyData: String?,
        completionHandler: (HttpClientResponse) -> Unit
    ): NetworkTask
}

/**
 * A cancellable concurrent operation.
 */
interface NetworkTask {
    fun cancel()
    fun resume()
}
