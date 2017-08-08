import SegmentSchema from './SegmentSchema'

const SegmentSchemaQuery = {
    type: SegmentSchema,
    args: {},
    resolve(_, {}) {

        /*
         *  attribute: 'Bluetooth Enabled' -->  attribute: 'bluetoothEnabled',
         *  Need another field in deviceSchema to match key val of attributes from profiles + devices objects
         */
        return {
            deviceSchema: [
                {
                    attribute: 'deviceId',
                    attributeType: 'StringPredicate'
                },
                {
                    attribute: 'deviceOS',
                    attributeType: 'StringPredicate'
                },
                {
                    attribute: 'deviceOSVersion',
                    attributeType: 'VersionPredicate'
                },
                {
                    attribute: 'model',
                    attributeType: 'StringPredicate'
                },
                {
                    attribute: 'appVersion',
                    attributeType: 'StringPredicate'
                },
                {
                    attribute: 'carrier',
                    attributeType: 'StringPredicate'
                }, {
                    attribute: 'lastSeen',
                    attributeType: 'DatePredicate'
                },
                {
                    attribute: 'last known location',
                    attributeType: 'GeofencePredicate'
                }
            ],
            profileSchema: [
                {
                    attribute: 'firstName',
                    attributeType: 'StringPredicate'
                },
                {
                    attribute: 'age',
                    attributeType: 'NumberPredicate'
                },
                {
                    attribute: 'Account Created',
                    attributeType: 'DatePredicate'
                },
            ]
        }
    }
}

export default SegmentSchemaQuery
