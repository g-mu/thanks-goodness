import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Picker,
  Text
} from 'react-native';
import GlobalStyles from '../constants/GlobalStyles';
import {meritData, profileData} from '../api/firebase';
import stateManager from "../api/stateManager";
import { GivingTileComponent } from '../components/giving/GivingTileComponent';
import Layout from '../constants/Layout';
import Enums from '../constants/Enums';
import { LogoHeader } from "../components/LogoHeader";
import Colors from "../constants/Colors";

export default class MeritsScreen extends React.Component {
  static navigationOptions = {
    title: 'Merits',
  };

    constructor(props) {
        super(props);
        this.state = {
            taglist: {},
            meritslist: [],
        };
    }

  componentDidMount() {
    this.loadMerits();
  }

  loadMerits() {
      stateManager.getSystemMerits().then((merits) => {
          this.setState({meritslist: merits});
      }).catch((error)=>{
          console.log('firebase merits error', error);
      })
  }

  render() {
    return (
        <View style={GlobalStyles.container}>
            <LogoHeader short={true} title={'Thank someone!'} navigation={this.props.navigation}/>
          {/*<Picker style={{marginLeft: Layout.standardPadding, marginRight: Layout.standardPadding}}*/}
              {/*selectedValue={this.state.language}*/}
              {/*onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>*/}
              {/*<Picker.Item key={'All'} label={'All'} value={''} />*/}
              {/*{*/}
                  {/*Enums.meritCategories.map((category, j) => {*/}
                      {/*return <Picker.Item key={category} label={category} value={category} />*/}
                  {/*})*/}
              {/*}*/}
          {/*</Picker>*/}
            <View style={GlobalStyles.divider}></View>
        <ScrollView>
            <View style={styles.meritList}>
            {
                this.state.meritslist.map((merit, j) => {
                  if(merit != null && merit != undefined) {
                      return <GivingTileComponent key={merit.key} merit={merit} />
                  }
                })
            }
            </View>
        </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    meritList: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: ((Layout.window.width%(100+Layout.standardPadding))/2),
        paddingRight: ((Layout.window.width%(100+Layout.standardPadding))/2),
    },
});
