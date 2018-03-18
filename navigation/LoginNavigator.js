import React from 'react';
import { StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';

export default StackNavigator(
    {
        Login: {
            screen: LoginScreen,
        },
        CreateAccount: {
            screen: CreateAccountScreen,
        },
    },
    {
        headerMode: 'none',
    }
);
