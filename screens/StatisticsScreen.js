import React from 'react';
import {
    ScrollView,
    View,
    Image,
    Text, StyleSheet
} from 'react-native';
import {firebaseApp, meritData, profileData} from '../api/firebase';
import GlobalStyles from '../constants/GlobalStyles';
import { SvgPieChart } from '../components/SvgPieChart';
import stateManager from "../api/stateManager";
import { LogoHeader } from '../components/LogoHeader';
import Colors from '../constants/Colors';
import Enums from '../constants/Enums';
import Layout from "../constants/Layout";

export default class StatisticsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
    constructor(props) {
        super(props);
        this.state = {
            givenData: [],
            receivedData: [],
        }
        this.colors = [
            Colors.palette.mediumBlue,
            Colors.palette.lightGreen,
            Colors.palette.mediumOrange,
            Colors.palette.mediumPink,
            Colors.palette.mediumPurple,
            Colors.palette.darkBlue,
            Colors.palette.darkGreen,
            Colors.palette.darkOrange,
            Colors.palette.darkPink,
            Colors.palette.darkPurple,
            Colors.palette.darkYellow,
            Colors.palette.mediumBlue,
            Colors.palette.lightGreen,
            Colors.palette.mediumOrange,
            Colors.palette.mediumPink,
            Colors.palette.mediumPurple,
            Colors.palette.darkBlue,
            Colors.palette.darkGreen,
            Colors.palette.darkOrange,
            Colors.palette.darkPink,
            Colors.palette.darkPurple,
            Colors.palette.darkYellow,
        ]
    }

    getColor(index){
        return this.colors[index];
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    componentWillMount() {
       this.loadMeritStatsForCharts();
    }
    componentWillReceiveProps(){
        console.log('componentWillReceiveProps');
    }

    loadMeritStatsForCharts(){
        let gd = [];
        for(var i = 0; i < stateManager.user.meritStats.given.length; i++){
            gd.push({
                val: stateManager.user.meritStats.given[i].count,
                label: stateManager.user.meritStats.given[i].category,
                color: this.colors[i]
            })
        }
        let rd = [];
        for(var i = 0; i < stateManager.user.meritStats.received.length; i++){
            rd.push({
                val: stateManager.user.meritStats.received[i].count,
                label: stateManager.user.meritStats.received[i].category,
                color: this.colors[i]
            })
        }
        //console.log('stats',gd,rd);
        this.setState({givenData: gd, receivedData: rd});
    }

  render() {
    return (
        <View style={GlobalStyles.container}>
            <LogoHeader short={true} title={'You\'ve been thanked'} navigation={this.props.navigation}/>
            <ScrollView>
                <Text style={styles.title}>Given</Text>
                <SvgPieChart data={this.state.givenData}/>
                <Text style={styles.title}>Received</Text>
                <SvgPieChart data={this.state.receivedData}/>
                <View style={GlobalStyles.spacerPageBottom}></View>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        padding: Layout.standardPadding,
        textAlign: 'center',
    }
});

