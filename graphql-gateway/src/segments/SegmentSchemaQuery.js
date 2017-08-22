import RoverApis from '@rover/apis'
import Audience from '@rover/audience-client'
import promisify from '@rover-common/grpc-promisify'

import SegmentSchema from './SegmentSchema'

const audienceClient = Audience.v1.Client()
promisify(audienceClient)

const attributeTypeMap = {
    bool: 'BooleanPredicate',
    geopoint: 'GeofencePredicate',
    integer: 'NumberPredicate',
    int32: 'NumberPredicate',
    double: 'NumberPredicate',
    string: 'StringPredicate',
    timestamp: 'DatePredicate',
    version: 'VersionPredicate',
    'array[string]': 'StringPredicate'
}

const SegmentSchemaQuery = {
    type: SegmentSchema,
    args: {},
    resolve: async (_, {}, { authContext }) => {
        const getDeviceSchemaFromGrpc = async () => {
            const request = new RoverApis.audience.v1.Models
                .GetDeviceSchemaRequest()
            request.setAuthContext(authContext)
        
            let response
        
            try {
                response = await audienceClient.getDeviceSchema(request)
            } catch (e) {
                throw new Error(e)
            }
        
            return response.getSchema().getAttributesList().map(schema => ({
                attribute: schema.getAttribute(),
                label: schema.getLabel(),
                attributeType: attributeTypeMap[schema.getAttributeType()]
            }))
        }
        
        const getProfileSchemaFromGrpc = async () => {
            const request = new RoverApis.audience.v1.Models
                .GetProfileSchemaRequest()
            request.setAuthContext(authContext)
            let response
        
            try {
                response = await audienceClient.getProfileSchema(request)
            } catch (e) {
                throw new Error(e)
            }
            return response.getSchema().getAttributesList().map(schema => ({
                attribute: schema.getAttribute(),
                label: schema.getLabel(),
                attributeType: attributeTypeMap[schema.getAttributeType()]
            }))
        }
        return {
            deviceSchema: await getDeviceSchemaFromGrpc(),
            profileSchema: await getProfileSchemaFromGrpc()
        }
    }
}

export default SegmentSchemaQuery
