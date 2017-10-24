import getDeviceFromProto, {
    getPlatformFromProto,
    getPushEnvironmentFromProto,
    getVersionFromProto
} from '../getDeviceFromProto'
import RoverApis from '@rover/apis'
import promisify from '@rover-common/grpc-promisify'
import { audienceClient, authClient } from '../../../grpcClients'
promisify(audienceClient)

describe('getDeviceFromProto', async () => {

    it('should match snapshot', async () => {
        const authContext = new RoverApis.auth.v1.Models.AuthContext()
        authContext.setAccountId(1)
        authContext.setPermissionScopesList(["admin"])
        const request = new RoverApis.audience.v1.Models.GetDeviceRequest()
        request.setDeviceId("adevice00")
        request.setAuthContext(authContext)
        const response = await audienceClient.getDevice(request)
        const device = getDeviceFromProto(response.getDevice())

        expect(device).toMatchSnapshot()
    })
})

describe('getPlatformFromProto', () => {
    it('should return empty string for platform 0', () => {
        const platform = getPlatformFromProto(0)
        expect(platform).toEqual('')
    }) 
    it('should return "Mobile" for platform 1', () => {
        const platform = getPlatformFromProto(1)
        expect(platform).toEqual('Mobile')
    }) 
    it('should return "Web" for platform 2', () => {
        const platform = getPlatformFromProto(2)
        expect(platform).toEqual('Web')
    }) 
})

describe('getPushEnvironmentFromProto', () => {
    it('should return a string with the first letter capitalized', () => {
        const pushEnvironment = getPushEnvironmentFromProto('development')
        expect(pushEnvironment).toEqual('Development')
    })
})

describe('getVersionFromProto', () => {
    it('should return an empty array for null or undefined proto version messages', () => {
        const version = getVersionFromProto(null)
        expect(version).toEqual([])
    }) 
    it('should return the major, minor, and revision values of a proto version object', () => {
        const protoVersion = new RoverApis.audience.v1.Models.Version()
        protoVersion.setMajor(1)
        protoVersion.setMinor(2)
        protoVersion.setRevision(3)
        const version = getVersionFromProto(protoVersion)
        expect(version).toEqual([1,2,3])
    })
})
