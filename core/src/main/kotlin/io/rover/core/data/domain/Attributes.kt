package io.rover.core.data.domain

/**
 * The Rover API data model sometimes includes unstructured data.  See [Attributes].
 */
sealed class AttributeValue {
    abstract class Scalar: AttributeValue() {
        data class Integer(val value: kotlin.Int) : Scalar()
        data class String(val value: kotlin.String) : Scalar()
        data class Double(val value: kotlin.Double) : Scalar()
        data class Boolean(val value: kotlin.Boolean) : Scalar()
        data class URL(val value: java.net.URI) : Scalar()
        data class Date(val date: java.util.Date) : Scalar()
    }

    data class Hash(val hash: Attributes) : AttributeValue()
    data class Array(val values: List<AttributeValue>) : AttributeValue()
}

/**
 * In certain places the Rover API returns unstructured data and similarly the Rover SDK is
 * expected to submit unstructured data in yet other places.
 *
 * Attributes and [AttributeValue]s are a strongishly typed way to represent such data.
 */
typealias Attributes = Map<kotlin.String, AttributeValue>
