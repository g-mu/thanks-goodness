import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text,
    TextInput,
} from 'react-native';
import {firebaseApp} from '../api/firebase';
import Button from 'apsl-react-native-button';
import GlobalStyles from '../constants/GlobalStyles';
import stateManager from '../api/stateManager';
import { LogoHeader } from '../components/LogoHeader';
import Layout from '../constants/Layout';


export default class CreateAccountScreen extends React.Component {

    fbReturnedAuth = false;

    state = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password2: '',
        error: ' ',
        loading: false
    };

  static navigationOptions = {
    //header: null,
  };

    _handleGoToLogin() {
        //this.props.navigation.navigate('Login');
        this.props.navigation.goBack();
    }

    _handleCreateAccount() {
        this.setState({error:' '});
        const { firstname, lastname, email, password, password2 } = this.state;
        if (firstname == ""){
            setTimeout(() => {this.setState({error:'First name cannot be blank.'})}, 100);
        } else if (lastname == ''){
            setTimeout(() => {this.setState({error:'Last name cannot be blank.'})}, 100);
        } else if(email == ""){
            setTimeout(() => {this.setState({error:'Email address cannot be blank.'})}, 100);
        } else if(password == ""){
            setTimeout(() => {this.setState({error:'Password cannot be blank.'})}, 100);
        } else if(password != password2){
            setTimeout(() => {this.setState({error:'Your passwords do not match.'})}, 100);
        } else {
            this.setState({ error: ' ', loading: true });
            firebaseApp.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    stateManager.newaccountinfo = {firstname: this.state.firstname, lastname: this.state.lastname};
                    this.setState({ error: ' ', loading: false });
                    this.props.navigation.goBack();
                })
                .catch(() => {
                    setTimeout(() => {this.setState({error:'Authentication failed.', loading: false})}, 100);
                });
        }
    }


    renderButtonOrSpinner() {
        if (this.state.loading) {
            //return <Spinner />;
            return <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText}>Creating account...</Button>
        }
        return <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText} onPress={() => this._handleCreateAccount()}>Create account</Button>
    }

  render() {
    return (
        <View style={GlobalStyles.container}>
            <LogoHeader short={true}/>
            <ScrollView style={{padding:Layout.standardPadding}}>
                <Text style={GlobalStyles.errorText}>{this.state.error}</Text>
                <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} placeholder="First name" onChangeText={firstname => this.setState({firstname})}/>
                <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} placeholder="Last name" onChangeText={lastname => this.setState({lastname})}/>
                <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} placeholder="Email address" onChangeText={email => this.setState({email})}/>
                <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} secureTextEntry={true} placeholder="Password" onChangeText={password => this.setState({password})}/>
                <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} secureTextEntry={true} placeholder="Re-enter password" onChangeText={password2 => this.setState({password2})} />
                <View>
                    {this.renderButtonOrSpinner()}
                    <Button style={GlobalStyles.buttonLink} textStyle={GlobalStyles.buttonLinkText} onPress={() => this._handleGoToLogin()}>Cancel</Button>
                </View>
            </ScrollView>
        </View>
    );
  }
}