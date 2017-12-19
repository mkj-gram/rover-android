import RoverApis from '@rover/apis'

export const valueFromProto = (value) => {
    switch (value.getValueTypeCase()) {
       case 1: {
           return value.getBooleanValue()
       }
       case 2: {
           return value.getIntegerValue()
       }
       case 3: {
           return value.getDoubleValue()
       }
       case 4: {
           return value.getStringValue()
       }
       case 5: {
           return value.getStringArrayValue().getValuesList()
       }
       case 7: {
           return null
       }
       case 8: {
           return RoverApis.Helpers.timestampFromProto(value.getTimestampValue())
       }
       default: {
           return undefined
       }
   }
}

const getRoverProfileValues = (id, p) => {
   const props = {
       id,
       account_id: p.getAccountId(),
       identifier: p.getIdentifier() === "" ? null : p.getIdentifier(),
       updated_at: RoverApis.Helpers.timestampFromProto(p.getUpdatedAt()),
       created_at: RoverApis.Helpers.timestampFromProto(p.getCreatedAt())
   }

   let rover_profiles = []

   Object.keys(props).forEach(property => {
       rover_profiles.push({
           attribute: property,
           selector: 'ROVER_PROFILE',
           value: props[property]
       })
   })
   return rover_profiles
}

const getCustomProfileValues = (p) => {
   const attributes = p.getAttributesMap()
   let custom_profiles = []

   attributes.keys().arr_.forEach(key => {
       custom_profiles.push({
           attribute: key,
           selector: 'CUSTOM_PROFILE',
           value: valueFromProto(attributes.get(key))
       })
   })
   return custom_profiles
}

export default (profiles, p) => {
   const id = p.getId()
   profiles[id] = getRoverProfileValues(id, p).concat(getCustomProfileValues(p))
}