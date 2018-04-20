import objectAssign from 'object-assign'
import { expect } from 'chai'

import {
  ADD_SUBSCRIBE_TO_CHANGE_LIST,
  ADD_UNSUBSCRIBE_TO_CHANGE_LIST,
  SUBSCRIPTION_UPDATED,
  UNQUEUE_CHANGE_FROM_CHANGE_LIST
} from '../../constants/SubscriptionChangeActionTypes'

import {
  CLEAR_SUBSCRIPTION_LIST
} from '../../constants/SubscriptionListActionTypes'

import {
  subscriptionChangesById,
  addSubscriptionChangeId,
  removeSubscriptionChangeId,
  allSubscriptionChanges,
  addProcessedSubscriptionId,
  allProcessedSubscriptions
} from '../subscriptionChanges'

describe('reducer: subscriptionChanges', () => {
  const sampleLid = "DVL2"
  const sampleProtocol = "sms"
  const sampleSubscriptionId = 123
  const sampleSubscriptionAction = 'subscribe'
  const sampleChangeId = 4
  const sampleId = `${sampleLid}_${sampleProtocol}_subscribe`

  const samplePayload = {
    id: sampleId,
    lid: sampleLid,
    protocol: sampleProtocol,
    subscriptionId: sampleSubscriptionId,
    subscriptionAction: sampleSubscriptionAction,
    changeRequestId: sampleChangeId
  }

  const res = {}
  res[sampleId] = samplePayload

  const loaded = {SVR1_sms_unsubscribe: {
    id: "SVR1_sms_unsubscribe",
    lid: "SVR1",
    protocol: sampleProtocol,
    subscriptionId: 999,
    subscriptionAction: 'unsubscribe',
    changeRequestId: 8
  }}
  const sampleList = objectAssign({}, loaded, res)

  // subscriptionChangesById tests
  it('should return the initial subscriptionChangesById state as an empty object', () => {
    expect(
      subscriptionChangesById(undefined, {})
    ).to.deep.equal({})
  })

  it('empty subscriptionChangesById should handle ADD_SUBSCRIBE_TO_CHANGE_LIST', () => {
    expect(
      subscriptionChangesById({}, {
        type: ADD_SUBSCRIBE_TO_CHANGE_LIST,
        payload: samplePayload
      })
    ).to.deep.equal(res)
  })

  it('preset subscriptionChangesById should handle ADD_SUBSCRIBE_TO_CHANGE_LIST', () => {
    expect(
      subscriptionChangesById(loaded, {
        type: ADD_SUBSCRIBE_TO_CHANGE_LIST,
        payload: samplePayload
      })
    ).to.deep.equal(sampleList)
  })

  it('empty subscriptionChangesById should handle ADD_UNSUBSCRIBE_TO_CHANGE_LIST', () => {
    expect(
      subscriptionChangesById({}, {
        type: ADD_UNSUBSCRIBE_TO_CHANGE_LIST,
        payload: samplePayload
      })
    ).to.deep.equal(res)
  })

  it('preset subscriptionChangesById should handle ADD_UNSUBSCRIBE_TO_CHANGE_LIST', () => {
    expect(
      subscriptionChangesById(loaded, {
        type: ADD_UNSUBSCRIBE_TO_CHANGE_LIST,
        payload: samplePayload
      })
    ).to.deep.equal(sampleList)
  })

  it('subscriptionChangesById should handle CLEAR_SUBSCRIPTION_LIST', () => {
    expect(
      subscriptionChangesById(loaded, {
        type: CLEAR_SUBSCRIPTION_LIST
      })
    ).to.deep.equal({})
  })

  it('subscriptionChangesById should handle SUBSCRIPTION_UPDATED', () => {
    const diff = {...loaded['SVR1_sms_unsubscribe'], changeRequestId: 12}
    expect(
      subscriptionChangesById(loaded, {
        type: SUBSCRIPTION_UPDATED,
        payload: {
          id: 'SVR1_sms_unsubscribe',
          changeRequestId: 12
        }
      })
    ).to.deep.equal({'SVR1_sms_unsubscribe': diff})
  })

  it('preset subscriptionChangesById should handle UNQUEUE_CHANGE_FROM_CHANGE_LIST', () => {
    expect(
      subscriptionChangesById(sampleList, {
        type: UNQUEUE_CHANGE_FROM_CHANGE_LIST,
        payload: samplePayload
      })
    ).to.deep.equal(loaded)
  })

  // addSubscriptionChangeId tests
  it('empty addSubscriptionChangeId should return array with only input Id', () => {
    expect(
      addSubscriptionChangeId([], {
        payload: samplePayload
      })
    ).to.deep.equal([sampleId])
  })

  it('preset addSubscriptionChangeId should return array with input Id appended', () => {
    expect(
      addSubscriptionChangeId(["SVR1_sms_unsubscribe"], {
        payload: samplePayload
      })
    ).to.deep.equal(["SVR1_sms_unsubscribe", sampleId])
  })

  // removeSubscriptionChangeId tests
  it('empty removeSubscriptionChangeId should return empty array', () => {
    expect(
      removeSubscriptionChangeId([], {
        payload: samplePayload
      })
    ).to.deep.equal([])
  })

  it('preset removeSubscriptionChangeId should return filtered array without input Id', () => {
    expect(
      removeSubscriptionChangeId(["SVR1_sms_unsubscribe", sampleId], {
        payload: samplePayload
      })
    ).to.deep.equal(["SVR1_sms_unsubscribe"])
  })

})
