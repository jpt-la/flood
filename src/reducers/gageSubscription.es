import objectAssign from 'object-assign'

import {
  ADD_SUBSCRIPTION_TO_SUBSCRIPTION_LIST,
  CLEAR_SUBSCRIPTION_LIST
} from '../constants/SubscriptionListActionTypes'


const addGageSubscriptionEntry = (state, action) => {
  return objectAssign({}, state, {
    [action.payload.lid]: {
      ...state[action.payload.lid],
      [action.payload.protocol]: action.payload.id,
      "lid": action.payload.lid
    }
  })
}

export const gageSubscriptionById = (state = {}, action) => {
  switch (action.type) {
    case ADD_SUBSCRIPTION_TO_SUBSCRIPTION_LIST:
      return addGageSubscriptionEntry(state, action)
    case CLEAR_SUBSCRIPTION_LIST:
      return {}
    default:
      return state
  }
}

export const addGageSubscriptionId = (state, action) => {
  if (state.indexOf(action.payload.lid) === -1) {
    return state.concat(action.payload.lid).sort()
  }
  return state
}

export const allGageSubscriptions = (state = [], action) => {
  switch (action.type) {
    case ADD_SUBSCRIPTION_TO_SUBSCRIPTION_LIST:
      return addGageSubscriptionId(state, action)
    case CLEAR_SUBSCRIPTION_LIST:
      return []
    default:
      return state
  }
}

export const addDisplayGageSubscriptionId = (state, action) => {
  const cleanedLid = action.payload.lid.replace(/--PD/g, '')
  if (state.indexOf(cleanedLid) === -1) {
    return state.concat(cleanedLid).sort()
  }
  return state
}

export const displayGageSubscriptions = (state = [], action) => {
  switch (action.type) {
    case ADD_SUBSCRIPTION_TO_SUBSCRIPTION_LIST:
      return addDisplayGageSubscriptionId(state, action)
    case CLEAR_SUBSCRIPTION_LIST:
      return []
    default:
      return state
  }
}
