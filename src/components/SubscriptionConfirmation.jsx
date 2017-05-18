import React, { Component, PropTypes } from 'react'
import {
    Button,
    Checkbox,
    Card,
    CardTitle,
    CardText,
    CardActions
} from 'react-mdl'
import Modal from 'react-modal'

const reactModalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.50)'
  }
}


class SubscriptionConfirmation extends Component {
  static propTypes = {
    showConfirmation: PropTypes.bool,
    hideSubscriptionConfirmation: PropTypes.func,
    showSnackbar: PropTypes.func,
    subscribeGage: PropTypes.func,
    lid: PropTypes.string,
    name: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleConfirmation = this.handleConfirmation.bind(this)
  }

  componentDidMount() {
    console.log(this.props)
  }

  handleCloseModal() {
    this.props.hideSubscriptionConfirmation()
  }

  handleConfirmation(event) {
    event.preventDefault()
    this.props.subscribeGage(this.props.lid.toUpperCase())
    this.handleCloseModal()
  }

  render() {
    return (
      <Modal isOpen={this.props.showConfirmation}
             contentLabel="Confirm Changes Modal"
             style={reactModalStyle}
             className="subscription-confirm-modal">
        <Card>
          <CardTitle className="subscription-confirm-modal-title"><i className="material-icons">playlist_add_check</i>
          Confirm Subscription
          </CardTitle>
          <CardText className="subscription-confirm-modal-text">
            <p>Are you sure you want to subscribe to receive alerts for the
            <b> { this.props.name } ({ this.props.lid })</b> flood gage?</p>
          </CardText>
          <CardActions className="subscription-confirm-modal-actions">
            <Button type="button" onClick={this.handleConfirmation}>Confirm</Button>
            <Button autoFocus="true" type="button" onClick={this.handleCloseModal}>Cancel</Button>
          </CardActions>
        </Card>
      </Modal>
    )
  }
}

export default SubscriptionConfirmation
