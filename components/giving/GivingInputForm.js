import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated,
    ScrollView,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    View,
    Picker,
    Image } from 'react-native';
import GlobalStyles from "../../constants/GlobalStyles";
import Colors from "../../constants/Colors";
import Button from 'apsl-react-native-button';
import {profileData, webStorage} from "../../api/firebase";
import Layout from '../../constants/Layout';
import {mailgunConfig} from "../../api/mailgun";
import stateManager from "../../api/stateManager";
import moment from 'moment';
import SnackBar from 'react-native-snackbar-component'
import HelperFunctions from "../../constants/HelperFunctions";


export default class GivingInputForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            recipientEmail: '',
            reason: '',
            message: '',
            error: ' ',
            showThankYouMessage: false,
            categoryList: stateManager.system.categories,
        };
    }


    componentWillMount() {
    }

    componentDidMount() {
        this.resetState();
    }


    resetState() {
        this.setState({
            recipientEmail: '',
            reason: '',
            message: '',
            error: ' ',
            showThankYouMessage: false,
            categoryList: stateManager.system.categories,
        });
        //console.log('categories',stateManager.system.categories);
    }

    _handleSendMerit(){
        console.log('send merit clicked', this.props.merit);
        this.setState({error:' '});
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(this.state.recipientEmail) === false)
        {
            setTimeout(() => {this.setState({error:'Please make sure the email is correct.'})}, 100);
            return;
        } else if(this.state.recipientEmail == stateManager.user.email){
            setTimeout(() => {this.setState({error:'Sending to yourself? Cheater!'})}, 100);
            return;
        } else if(this.state.reason == ''){
            setTimeout(() => {this.setState({error:'Tell us why.'})}, 100);
            return;
        } else {
            // Log to current user as a 'given'
            profileData.child(stateManager.user.profileid+'/given').push(this.createGivenLog()).then(() => {
                console.log('given added to current user');
            }).catch((error) => {
                console.log("given error",error);
            });

            console.log('Logging to firebase');
            // log to local
            var statindex = HelperFunctions.ArrayHelpers.arrayContainsKey(stateManager.user.meritStats.given, 'category', this.state.reason);
            if (statindex == -1) {
                stateManager.user.meritStats.given.push({
                    category: this.state.reason,
                    count: 1,
                })
            } else {
                stateManager.user.meritStats.given[statindex].count++;
            }

            // Log to recipient
            profileData.orderByChild('email').equalTo(this.state.recipientEmail).once('value').then((profileSnapshot) => {
                console.log('profileSnapshot',profileSnapshot);
                if(profileSnapshot.val() == null){
                    // if there isn't  user, push one and get the key
                     profileData.push({
                         email: this.state.recipientEmail,
                         merits: [ this.createGivenMerit() ],
                    }).then(() => {
                         console.log('created new user and added merit',this.state.recipientEmail);
                         meritGivenEmailAndConfirmation();
                     }).catch((error) => {
                        console.log("push error",error);
                    });
                } else {
                    // add the merit to the user
                    console.log('has existing profile, update the info');
                    var profileid = Object.keys(profileSnapshot.val())[0];
                    //console.log('profileid:',profileid);
                    profileData.child(profileid+'/merits').push(this.createGivenMerit()).then(() => {
                        console.log('merit added to exiting user');
                        this.meritGivenEmailAndConfirmation();
                    }).catch((error) => {
                        console.log("update error",error);
                    });
                }
            }).catch((error) => {
                console.log("find user error",error);
            });
        }
    }

    createGivenMerit(){
        return {
            date: moment().format('DD/MM/YYYY'),
            from: stateManager.user.email,
            key: this.props.merit.key,
            message: this.state.message,
            category: this.state.reason,
        }
    }

    createGivenLog(){
        return {
            date: moment().format('DD/MM/YYYY'),
            to: this.state.recipientEmail,
            key: this.props.merit.key,
            message: this.state.message,
            category: this.state.reason,
        }
    }

    meritGivenEmailAndConfirmation(){
        // send the merit
        console.log('Sending to', this.state.recipientEmail);
        //mailgunConfig.sendMerit(this.state.recipientEmail,vthis.state.image.uri, this.state.message);

        // showing thank you message
        this.setState({showThankYouMessage:true});
        setTimeout(() => {
            this.setState({
                recipientEmail: '',
                message: '',
                error: ' ',
                reason: '',
            });
            this.setState({showThankYouMessage: false})
        }, 2000);

        if(this.props.onComplete){
            this.props.onComplete();
        }
    }

    render() {
        var data = [1,2,3,4,5];
        return (
            <View>
                <Text style={GlobalStyles.errorText}>{this.state.error}</Text>
                <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} placeholder="Recipient email address" value={this.state.recipientEmail} onChangeText={recipientEmail => this.setState({recipientEmail})}/>
                <View style={GlobalStyles.pickerContainer}>
                    <Picker selectedValue={this.state.reason} style={GlobalStyles.picker} itemStyle={GlobalStyles.pickerItem}
                            onValueChange={(itemValue, itemIndex) => this.setState({reason: itemValue})}>
                        <Picker.Item key={'why'} label={'Tell us why...'} value={''} />
                        {
                            this.state.categoryList.map((category, j) => {
                                if(category!=null && category != undefined) {
                                    return <Picker.Item key={category} label={category} value={category}/>
                                }
                            })
                        }
                    </Picker>
                </View>
                <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} placeholder="Say something nice" multiline={true} value={this.state.message} onChangeText={message => this.setState({message})}/>
                <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText} onPress={() => this._handleSendMerit()}>Send</Button>
                <SnackBar visible={this.state.showThankYouMessage} textMessage="Your Thanks was sent! Yay!" backgroundColor={Colors.palette.darkPurple}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
});