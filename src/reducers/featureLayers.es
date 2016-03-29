import objectAssign from 'object-assign'

const initialState = {
  layers: [
    {
      'id': 'ahps-flood',
      'text': 'Flood Gauges',
      'type': 'cartodb',
      'options': {
        'name': 'ahps-flood',
      },
      'active': true,
    },
    {
      'id': 'animated-weather',
      'text': 'Weather Radar',
      'type': 'animated-weather',
      'active': false,
    },
    {
      'id': 'reservoir-conditions',
      'text': 'Lake Conditions',
      'type': 'cartodb',
      'options': {
        'name': 'wdft-reservoirs',
      },
      'active': false,
    },
    //TODO: Removed until Aeris subscription has been purchased
    // since their advisory layers don't work under the dev plan
    // {
    //   'id': 'flood-alerts',
    //   'text': 'Flood Alerts',
    //   'type': 'flood-alerts',
    //   'active': false,
    // },
  ],
}

export default function featureLayers(state = initialState, action) {
  switch (action.type) {
    case 'SET_FEATURE_LAYER':
      const updatedLayers = state.layers.map((layer) => {
        return objectAssign({}, layer, {
          active: layer.id === action.id
        })
      })
      return objectAssign({}, state, {
        layers: updatedLayers
      })
    default:
      return state
  }
}
