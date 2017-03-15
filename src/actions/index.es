import axios from 'axios'
import R from 'ramda'

import { createAction } from 'redux-actions'

import * as types from './types'

export const layerStatusChange = (id, status) => {
  return {
    type: types.CHANGE_LAYER_STATUS,
    id,
    status
  }
}

export const hoverOverMapClickable = (data) => {
  return {
    type: types.HOVER_OVER_MAP_CLICKABLE,
    data,
  }
}

export const setBaseLayer = (id) => {
  return {
    type: types.SET_BASE_LAYER,
    id
  }
}

export const setPopup = createAction(types.SET_POPUP, data => data)

export const setFeatureLayer = (id) => {
  return (dispatch) => {
    dispatch(setPopup())

    dispatch({
      type: types.SET_FEATURE_LAYER,
      id
    })
  }
}

export const setGaugeInit = (initState) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_GAUGE_INIT,
      initState
    })
  }
}

//function only run once on the initial app build. populationed the subscribeDialog reducer
//with the current stage of all flood gauges
export function initialGaugeStatus() {
  return (dispatch) => {
    const query = `SELECT lid, name, latitude, longitude FROM nws_ahps_gauges_texas`
    return axios.get(`https://tnris-flood.cartodb.com/api/v2/sql?q=${query}`)
      .then(({data}) => {
        const formatState = data.rows.map((gauge) => {
          const obj = {}
          obj[gauge.lid] = {"name": gauge.name, "latitude": gauge.latitude, "longitude": gauge.longitude}
          return obj
        })
        const initState = R.mergeAll(formatState)
        dispatch(setGaugeInit(initState))
      })
  }
}

export const showSubscribeDialog = () => {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_SUBSCRIBE_DIALOG
    })
  }
}

export const hideSubscribeDialog = () => {
  return (dispatch) => {
    dispatch({
      type: types.HIDE_SUBSCRIBE_DIALOG
    })
  }
}

export const setLidAndName = (lid, name) => {
  return (dispatch) => {
    dispatch({
      type: types.SET_LID_AND_NAME,
      lid,
      name
    })
  }
}

export const updateTimestamp = (timestamp) => {
  return (dispatch) => {
    dispatch({
      type: types.UPDATE_TIMESTAMP,
      timestamp
    })
  }
}

export const showAboutDialog = () => {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_ABOUT_DIALOG
    })
  }
}

export const hideAboutDialog = () => {
  return (dispatch) => {
    dispatch({
      type: types.HIDE_ABOUT_DIALOG
    })
  }
}
