import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import MeritsScreen from '../screens/MeritsScreen';
import AboutScreen from '../screens/AboutScreen';

export default TabNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        Statistics: {
            screen: StatisticsScreen,
        },
        Merits: {
            screen: MeritsScreen,
            navigationOptions: { title: 'Give' }
        },
        About: {
            screen: AboutScreen,
        },
    },
    {
        navigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused}) => {
                const {routeName} = navigation.state;
                let iconName;
                switch (routeName) {
                    case 'Home':
                        //iconName = Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}`  : 'md-ribbon';
                        iconName = 'md-ribbon';
                        break;
                    case 'Statistics':
                        //iconName = Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-contrast';
                        iconName = 'md-contrast';
                        break;
                    case 'Merits':
                        //iconName = Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-happy';
                        iconName = 'md-happy';
                        break;
                    case 'About':
                        //iconName = Platform.OS === 'ios' ? `ios-flame${focused ? '' : '-outline'}` : 'md-bonfire';
                        iconName = 'md-at';
                }
                return (
                    <Ionicons
                        name={iconName}
                        size={28}
                        style={{marginBottom: -3}}
                        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                    />
                );
            },
        }),
        tabBarOptions: {
            activeTintColor: Colors.tabIconSelected,
            inactiveTintColor: Colors.tabIconDefault,
            style: {
                backgroundColor: Colors.brandLight,
            }
        },
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
    }
);
