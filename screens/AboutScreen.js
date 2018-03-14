import React from 'react';
import {
    ScrollView,
    View,
    Image,
    Text
} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import Button from 'apsl-react-native-button';
import GlobalStyles from '../constants/GlobalStyles';
import Layout from '../constants/Layout';
import stateManager from '../api/stateManager';
import { firebaseApp } from '../api/firebase';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  };

    _handleLogout() {
        firebaseApp.auth().signOut();
        stateManager.user = null;
        this.props.screenProps.rootNavigation.navigate('Login');
    }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScrollView style={[GlobalStyles.contentContainer,{padding:Layout.standardPadding, paddingBottom:32}]}>
          <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText} onPress={() => this._handleLogout()}>Log out</Button>
          <ExpoConfigView />
      </ScrollView>
    )
  }
}
