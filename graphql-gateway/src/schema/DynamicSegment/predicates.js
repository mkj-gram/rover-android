import { PredicateAggregate } from '../Predicate'

const predicates = {
    type: PredicateAggregate,
    resolve: ({ predicateList, condition }) => ({ predicateList, condition })
}

export default predicates
