import React from 'react';
import {
    ScrollView,
    View,
    Image,
    Text, StyleSheet,
} from 'react-native';
import Button from 'apsl-react-native-button';
import {firebaseApp, meritData, profileData} from '../api/firebase';
import GlobalStyles from '../constants/GlobalStyles';
import stateManager from "../api/stateManager";
import { LogoHeader } from '../components/LogoHeader';
import { mailgunConfig } from '../api/mailgun';
import HelperFunctions from '../constants/HelperFunctions';
import Layout from "../constants/Layout";
import { ReceivedTileComponent } from '../components/received/ReceivedTileComponent';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

    constructor(props){
        super(props);
        this.state = {
            displayName: '',
            newMerits: [],
            userMerits: [],
        }
    }

    componentWillMount() {
        //this.clearAllTimeouts();
    }

    componentDidMount() {
        this.loadUserMerits();
        this.setState({displayName: stateManager.user.firstname + ' ' + stateManager.user.lastname});
    }

    clearAllTimeouts(){
        const highestTimeoutId = setTimeout(() => ';');
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    }

    loadUserMerits(){
        var newMerits = [];
        var allUserMerits = [];
        //console.log('user',stateManager.user);
        for(var i = 0; i < stateManager.user.merits.length; i++){
            //console.log(stateManager.user.merits[i]);
            //stateManager.user.merits[i].name = merits[stateManager.user.merits[i].key].name;
            var meritindex = HelperFunctions.ArrayHelpers.arrayContainsKey(allUserMerits,'key',stateManager.user.merits[i].key);
            if(meritindex == -1){
                stateManager.user.merits[i].instances = [];
                allUserMerits.push(stateManager.user.merits[i]);
            } else {
                allUserMerits[meritindex].instances.push(stateManager.user.merits[i]);
            }
            //console.log(stateManager.user);
        }

        for(var i = 0; i < stateManager.user.merits.length; i++){
            if(i >= 4){break;}
            newMerits.push(stateManager.user.merits[i]);
        }
        //console.log('allUserMerits',allUserMerits);
        this.setState({
            newMerits:newMerits,
            userMerits:allUserMerits
        });
    }

    _handleTestEmail(){
        mailgunConfig.sendTestEmail();
    }

    _handleTestSomething(){
        // var profileid = profileData.push({text:1});
        // console.log(profileid);
        // profileData.orderByChild('email').equalTo('asd@asd.com').once('value').then(function(profileSnapshot) {
        //     console.log('profileSnapshot',profileSnapshot,profileSnapshot.val()==null);
        //     // if there isn't  user, push one and get the key
        //     // add the merit to the user
        //
        //     // stateManager.user.firstname = (profilSnapshot.val() && profilSnapshot.val().firstname);
        //     // stateManager.user.lastname = (profilSnapshot.val() && profilSnapshot.val().lastname);
        //     // console.log('user',stateManager.user);
        // });
        stateManager.user.meritStats.given.push({
            category: 'Hello',
            count: 1,
        })
    }

  render() {
    return (
        <View style={GlobalStyles.container}>
            <ScrollView>
                <Text style={[GlobalStyles.sectionHeader,{paddingBottom:0}]}>{this.state.displayName}</Text>
                <LogoHeader height={100}/>

                <Text style={GlobalStyles.sectionHeader}>New thanks</Text>
                {/*<ScrollView horizontal={true}>*/}
                    <View style={styles.meritList}>
                        {
                            this.state.newMerits.map((merit, j) => {
                                if(merit != null && merit != undefined) {
                                    return <ReceivedTileComponent size={(Layout.window.width-Layout.standardPadding*5)/4} key={merit.key} merit={merit} />
                                }
                            })
                        }
                    </View>
                {/*</ScrollView>*/}

                <Text style={GlobalStyles.sectionHeader}>All thanks</Text>
                <View style={styles.meritList}>
                    {
                        this.state.userMerits.map((merit, j) => {
                            if(merit != null && merit != undefined) {
                                return <ReceivedTileComponent key={merit.key} merit={merit} />
                            }
                        })
                    }
                </View>

                <View style={{padding:Layout.standardPadding}}>
                    <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText} onPress={() => this._handleTestEmail()}>Test email</Button>
                    <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText} onPress={() => this._handleTestSomething()}>Test something</Button>
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
        marginBottom: Layout.standardPadding,
    },
});

