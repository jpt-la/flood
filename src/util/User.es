import AWS from 'aws-sdk'
import 'amazon-cognito-js'

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser } from 'amazon-cognito-identity-js'

import keys from '../keys'

import { store } from '../store'

import {
  getUserSubscriptions
} from '../actions/SubscriptionFormActions'


class AppUser {
  constructor() {
    this.AWS = AWS
    this.region = 'us-east-1'
    this.authenticated = false
    this.appConfig = {...keys.awsConfig}
    this.userData = {}

    this.userPoolId = this.appConfig.UserPoolId
    this.clientId = this.appConfig.ClientId

    this.poolData = {
      UserPoolId: this.userPoolId,
      ClientId: this.clientId
    }
    this.AWS.config.update({region: this.region})
  }

  setCognitoUser = (loginInfo) => {
    this.username = loginInfo.Username
    this.password = loginInfo.Password

    this.authenticationData = {
      Username: this.username,
      Password: this.password
    }
    this.authenticationDetails = new this.AWS.CognitoIdentityServiceProvider.AuthenticationDetails(
      this.authenticationData)
    this.userPool = new this.AWS.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData)

    this.userData = {
      Username: this.username,
      Pool: this.userPool
    }
    this.cognitoUser = new this.AWS.CognitoIdentityServiceProvider.CognitoUser(this.userData)

    return this.cognitoUser
  }

  authenticate = (callback) => {
    this.cognitoUser.authenticateUser(this.authenticationDetails, {
      onSuccess: (result) => {
        this.idToken = result.getIdToken().getJwtToken()
        // this.AWS.config.credentials = new this.AWS.CognitoIdentityCredentials({
        this.credentials = new this.AWS.CognitoIdentityCredentials({
          IdentityPoolId: this.appConfig.IdentityPoolId,
          Logins: {
            [this.appConfig.Logins.cognito.identityProviderName]: this.idToken
          }
        }, {
          region: 'us-east-1'
        })

        this.identityId = this.credentials.params.IdentityId
        this.AWS.config.credentials = this.credentials

        this.cognitoUser.getUserAttributes((err, att) => {
          if (err) console.log(err)
          else {
            const user = {}
            for (let i = 0; i < att.length; i++) {
              user[att[i].Name] = att[i].Value
            }
            this.userData = {...user}
            console.log(this.userData)
          }
        })
        return callback(0)
      }
    })
  }

  createCognitoSyncSession = () => {
    this.cognitoSync = new this.AWS.CognitoSync()
    return this.cognitoSync
  }

}


class FloodAppUser extends AppUser {
  constructor() {
    super()

    this.dataset = 'texasflood'
    this.userSubscriptions = []
    this.syncSession = null
  }

  checkForSubscriptions(callback) {
    this.syncSession = this.createCognitoSyncSession()

    const baseParams = {
      IdentityId: this.identityId,
      IdentityPoolId: this.appConfig.IdentityPoolId
    }

    this.syncSession.listDatasets({
      IdentityId: this.identityId,
      IdentityPoolId: this.appConfig.IdentityPoolId
    }, (err, data) => {
      if (err) console.log(err)
      else {
        if (data.Datasets.length > 0 && data.Datasets[0].DatasetName === this.dataset) {
          this.getUserSubscriptions({...baseParams, DatasetName: this.dataset}, callback)
        }
        else return callback([])
      }
    })
  }

  getUserSubscriptions(params, callback) {
    if (!params.nextToken) {
      this.userSubscriptions = []
    }
    this.syncSession.listRecords(params, (err, subscriptions) => {
      if (err) console.log(err)
      else {
        this.userSubscriptions = this.userSubscriptions.concat(subscriptions.Records)
        if (subscriptions.nextToken) {
          this.getUserSubscriptions({nextToken})
        }
        else {
          return callback(this.userSubscriptions)
        }
      }
    })
  }

  subscribe(subscriptionData) {
    const stringData = JSON.stringify({...subscriptionData, protocol: "sms", endpoint: this.userData.phone_number})
    this.AWS.config.credentials.get(() => {
      const client = new this.AWS.CognitoSyncManager()
      client.openOrCreateDataset(this.dataset, (err, dataset) => {
        if (err) console.log(err)
        else {
          console.log(dataset)
          dataset.put(
            subscriptionData.subscriptionArn, stringData, (err, record) => {
              if (err) console.log(err)
              else this.synchronize(dataset)
            })
        }
      })
    })
  }

  synchronize(dataset) {
    dataset.synchronize({
      onSuccess: (dataset, newRecords) => {
        store.dispatch(getUserSubscriptions())
      },
      onFailure: (err) => {
        console.log(err)
      },
      onConflict: (dataset, conflicts, callback) => {

      },
      onDatasetDeleted: (dataset, datasetName, callback) => {
        return callback(true)
      },
      onDatasetsMerged: (dataset, datasetNames, callback) => {
        return callback(false)
      }
    })
  }

  unsubscribe(arn) {
    console.log(this.AWS.config.credentials)
    this.AWS.config.credentials.get(() => {
      const client = new this.AWS.CognitoSyncManager()
      client.openOrCreateDataset(this.dataset, (err, dataset) => {
        if (err) console.log(err)
        else {
          dataset.remove(arn, (err, record) => {
            if (err) console.log(err)
            else this.synchronize(dataset)
          })
        }
      })
    })
  }

  logout() {
    console.log("logging out")
  }
}

export default (new FloodAppUser)
