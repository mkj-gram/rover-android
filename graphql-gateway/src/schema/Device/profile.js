import Profile from '../Profile'

const profile = {
    type: Profile,
    resolve: ({ deviceIdentifier }) => {
        // TODO: Fetch profile, passing in deviceIdentifier
        return {
            identifier: "80000516109",
            attributes: {
                firstName: "Marie",
                lastName: "Avgeropoulos",
                email: "marie.avgeropoulos@example.com",
                gender: "female",
                age: 30,
                phoneNumber: "555-555-5555",
                tags: [
                    "actress",
                    "model",
                    "musician"
                ],
                height: 1.65
            },
            createdAt: "2017-10-04T13:54:16-04:00",
            updatedAt: "2017-10-04T13:54:16-04:00"
        }
    }
}

export default profile
