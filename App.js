import React from 'react';
import {   ToastAndroid,StyleSheet, Text, View, Button,Linking } from 'react-native';
import Login from 'react-native-login';

const config = {
  url: 'https://chat.sagaoftherealms.net/auth',
  realm: 'demo',
  client_id: 'Android',
  redirect_uri: 'keycloak-demo://app'
};



export default class App extends React.Component {
  

  componentDidMount() {
    Login.tokens().then(tokens => 
    {
      this.setState({tokens});
      console.log("tokens didmount" + tokens)
      if (tokens) {
        for (thing in tokens) {
          console.log(thing +":"+tokens[thing])
        }
        ToastAndroid.show("Access Token " + tokens['access_token'], ToastAndroid.LONG);
      }
      if (!tokens) 
      {
        var url = Linking.getInitialURL().then((url) => 
        {
          if (url) {
            console.log("URL Found!")
            var code = this.getParameterByName("code", url);
            if (code) {
              Login.retrieveTokens(code);
            }

          }
        }).catch(err => 
        {
          console.log('An error occurred', err)
        });
        
      }
    }).catch(() => {this.setState({tokens: null});console.log("no tokens");});


  }

  clicked() {
        Login.tokens().then(tokens => 
          {
            console.log("tokens" + tokens);
            Login.start(config).then(tokens => 
            {
              console.log("tokens" + tokens);
            }).catch(err => 
            {
              console.log(err);
            });
          });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Press Me!" onPress={this.clicked}></Button>
      </View>
    );
  }


  getParameterByName(name, url) {
    
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
