import uuid from 'node-uuid'
import SyncResultType from '../types/SyncResultType'

const SyncQuery = {
    type: SyncResultType,
    resolve() {
        return {
            profile: {
                profileID: uuid.v4(),
                firstName: "Marie",
                lastName: "Avgeropoulos",
                email: "marie.avgeropoulos@example.com",
                gender: "female",
                age: 30,
                phoneNumber: "555-555-5555",
                tags: ["actress", "model", "musician"],
                traits: {
                    height: 1.65
                }
            }
        }
    }
}

export default SyncQuery
