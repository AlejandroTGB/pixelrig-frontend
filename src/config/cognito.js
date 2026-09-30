import { Amplify } from 'aws-amplify'

export const COGNITO = {
  userPoolId: 'us-east-1_9ZxooRhyv',
  userPoolClientId: '62n42rgrii24pdg7j3ufe13scr'
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: COGNITO.userPoolId,
      userPoolClientId: COGNITO.userPoolClientId,
      loginWith: {
        email: true
      }
    }
  }
})
