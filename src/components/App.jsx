import React, { Component } from 'react'
import { Content, Layout } from 'react-mdl'

import ga from '../util/GoogleAnalytics'
import MapContainer from '../containers/MapContainer'
import NavigationDrawer from '../components/NavigationDrawer'
import Disclaimer from '../components/Disclaimer'
import SubscribeContainer from '../containers/SubscribeContainer'
import AboutContainer from '../containers/AboutContainer'
import ToasterContainer from '../containers/ToasterContainer'
import FloodHeaderContainer from '../containers/FloodHeaderContainer'
import FloodFooter from './FloodFooter'

ga.pageview(window.location.pathname)

export default class App extends Component {
  constructor(props) {
    super(props)
  }

componentDidMount() {
  this.props.showSnackbar(<p><strong>Warning: </strong>This application is currently in beta. For the official version, visit <a href="http://map.texasflood.org">http://map.texasflood.org</a></p>,
                          8000)
}

  render() {
    const navContentInitState = () => {
      if (this.props.location.pathname === '/subscriptions') {
        return {
          showFeatureLayerChooser: false,
          showSubscriptionForm: true
        }
      }
      return {
        showFeatureLayerChooser: true,
        showSubscriptionForm: false
      }
    }

    return (
      <div>
        <Disclaimer />
        <SubscribeContainer />
        <AboutContainer />
        <Layout fixedDrawer fixedHeader>
          <FloodHeaderContainer />
            <NavigationDrawer
              navContentInitState={navContentInitState()} browser={this.props.browser}
            />
            <Content>
            <MapContainer
              initialCenter={{
                lat: this.props.params.lat || null,
                lng: this.props.params.lng || null,
                zoom: this.props.params.zoom || null
              }}
              gageCenter={{
                lid: this.props.params.lid || null
              }} />
            </Content>
          <FloodFooter />
          <ToasterContainer />
        </Layout>
      </div>
    )
  }
}
