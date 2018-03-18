import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import stateManager from './api/stateManager';

import { NetInfoProvider } from 'react-native-netinfo';
import OfflineScreen from './screens/OfflineScreen';

console.ignoredYellowBox = [
    'Setting a timer'
]

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
        let newVar = (
            <NetInfoProvider
                onChange={({ isConnected, connectionInfo }) => {
                    console.log(isConnected);
                    console.log(connectionInfo);
                }}
                render={({ isConnected, connectionInfo }) =>
                    isConnected ? (
              <View style={styles.container}>
                  {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                  {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
                  <RootNavigation />
              </View>
                    ) : (
                        <OfflineScreen/>
                    )
                }
            />
        );
        return newVar;
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
        stateManager.getSystemMerits(),
        stateManager.getSystemCategories(),
        Asset.loadAsync([
            require('./assets/images/icon.png'),
        ]),
        Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'assistant-extralight': require('./assets/fonts/Assistant-ExtraLight.ttf'),
        'assistant-light': require('./assets/fonts/Assistant-Light.ttf'),
        'assistant-regular': require('./assets/fonts/Assistant-Regular.ttf'),
        'assistant-semibold': require('./assets/fonts/Assistant-SemiBold.ttf'),
        'assistant-bold': require('./assets/fonts/Assistant-Bold.ttf'),
        'assistant-extrabold': require('./assets/fonts/Assistant-ExtraBold.ttf'),
        }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
