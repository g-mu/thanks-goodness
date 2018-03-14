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
import {firebaseApp, profileData} from '../api/firebase';
import Button from 'apsl-react-native-button';
import GlobalStyles from '../constants/GlobalStyles';
import stateManager from '../api/stateManager';
import { LogoHeader } from '../components/LogoHeader';
import Layout from '../constants/Layout';
import HelperFunctions from '../constants/HelperFunctions';


export default class LoginScreen extends React.Component {
    fbReturnedAuth = false;

    state = {
        online: true,
        needsAuth: false,
        email: '',
        password: '',
        error: ' ',
        loading: false
    };

    static navigationOptions = {
        //header: null,
    };

    // componentWillMount() {
    //     // this.setState({error: ' ', loading: false});
    //     // NetInfo.getConnectionInfo().then((connectionInfo) => {
    //     //     console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    //     // });
    // }

    componentDidMount(){
        this.setState({error: ' ', loading: false});
        firebaseApp.auth().onAuthStateChanged(authUser => {
            if(authUser != null && this.fbReturnedAuth == false) {
                this.fbReturnedAuth = true;
                //console.log('authUser', authUser, stateManager.newaccountinfo);
                // stateManager.user = {
                //     uid: authUser.uid,
                //     email: authUser.email,
                //     profileid: '',
                //     merits:[],
                //     meritStats: {
                //         received: [],
                //         given: [],
                //     },
                // };
                stateManager.user.uid = authUser.uid;
                stateManager.user.email = authUser.email;

                if(stateManager.newaccountinfo != null){
                    // NEW USER
                    // Check if they have a profile record of previous merits
                    profileData.orderByChild('email').equalTo(stateManager.user.email).limitToFirst(1).once('value').then(function(profileSnapshot) {
                        //console.log('profileSnapshot',profileSnapshot, profileSnapshot.val()==null);
                        if(profileSnapshot.val() != null) {
                            console.log('has existing profile, update the info');
                            var profileid = Object.keys(profileSnapshot.val())[0];
                            stateManager.user.profileid = profileid;
                            //console.log('profileid:',profileid);
                            profileData.child(profileid).update({
                                firstname: stateManager.newaccountinfo.firstname,
                                lastname: stateManager.newaccountinfo.lastname,
                            }).then(() => {
                                console.log('profile updated');
                                this.moveToHome();
                            })
                            .catch((error) => {
                                console.log("update new user",error);
                            });
                        } else {
                            console.log('no existing profile, create one');
                            var ref = profileData.push();
                            var key = ref.key();
                            stateManager.user.profileid = key;
                            ref.push({
                                firstname: stateManager.newaccountinfo.firstname,
                                lastname: stateManager.newaccountinfo.lastname,
                                email: stateManager.user.email,
                            }).catch((error) => {
                                console.log("push",error);
                            });
                            this.moveToHome();
                        }
                    });
                    //console.log('newaccountinfo', stateManager.newaccountinfo);
                    //console.log(profileid);
                    // firebaseApp.database().ref('profiles/'+profileid).set({
                    //     firstname: stateManager.newaccountinfo.firstname,
                    //     lastname: stateManager.newaccountinfo.lastname,
                    //     email: stateManager.newaccountinfo.email,
                    // });
                } else {
                    // EXISTING USER
                    profileData.orderByChild('email').equalTo(stateManager.user.email).limitToFirst(1).once('value').then((profileSnapshot) => {
                        var profileid = Object.keys(profileSnapshot.val())[0];
                        var val = HelperFunctions.ArrayHelpers.getFirstObject(profileSnapshot.val());
                        //console.log('profileSnapshot',val, val.firstname, val.merits);
                        stateManager.user.firstname = val.firstname;
                        stateManager.user.lastname = val.lastname;
                        stateManager.user.profileid = profileid;
                        stateManager.user.merits = Object.values(val.merits);
                        stateManager.user.merits = stateManager.user.merits.sort(function(a,b){
                            // sort newest first
                            a = new Date(a.date);
                            b = new Date(b.date);
                            return a>b ? -1 : a<b ? 1 : 0;
                        });

                        // load receiveds
                        for(var i = 0; i < stateManager.user.merits.length; i++){
                             if(stateManager.user.merits[i].category != undefined) {
                                var statindex = HelperFunctions.ArrayHelpers.arrayContainsKey(stateManager.user.meritStats.received, 'category', stateManager.user.merits[i].category);
                                if (statindex == -1) {
                                    stateManager.user.meritStats.received.push({
                                        category: stateManager.user.merits[i].category,
                                        count: 1,
                                    })
                                } else {
                                    stateManager.user.meritStats.received[statindex].count++;
                                }
                            }
                        }

                        // load givens
                        var givens = Object.values(val.given);
                        for(var i = 0; i < givens.length; i++){
                            var statindex = HelperFunctions.ArrayHelpers.arrayContainsKey(stateManager.user.meritStats.given, 'category', givens[i].category);
                            if (statindex == -1) {
                                stateManager.user.meritStats.given.push({
                                    category: givens[i].category,
                                    count: 1,
                                })
                            } else {
                                stateManager.user.meritStats.given[statindex].count++;
                            }
                        }
                        //console.log('stateManager user',stateManager.user);
                        this.moveToHome();
                    }).catch((error) => {
                        console.log("existing user",error);
                    });
                }
            } else {
                console.log("needsAuth");
                this.setState({needsAuth:true});
            }
        });
    }

    moveToHome(){
        if(stateManager.newaccountinfo != null){
            stateManager.user.firstname = stateManager.newaccountinfo.firstname;
            stateManager.user.lastname = stateManager.newaccountinfo.lastname;
            stateManager.newaccountinfo = null;
        }
        this.props.screenProps.rootNavigation.navigate('Main');
    }

    _handleGoToCreateAccount() {
        this.props.navigation.navigate('CreateAccount');
    }

    _handleLogin() {
        this.setState({ error: ' ', loading: true });

        const { email, password } = this.state;
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('login success');
                //this.props.screenProps.rootNavigation.navigate('Main');
                //this.setState({ error: ' ', loading: false });
            })
            .catch(() => {
                setTimeout(() => {this.setState({error:'Authentication failed.', loading: false})}, 100);
            });
    }
    renderButtonOrSpinner() {
        if (this.state.loading) {
            //return <Spinner />;
            return <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText}>Signing in...</Button>
        }
        return <Button style={GlobalStyles.buttonStandard} textStyle={GlobalStyles.buttonStandardText} onPress={() => this._handleLogin()}>Log in</Button>
    }

    renderForm(){
        if(this.state.needsAuth){
            return (
                <View>
                    <LogoHeader short={true}/>
                    <ScrollView style={{padding: Layout.standardPadding}}>
                        <Text style={GlobalStyles.errorText}>{this.state.error}</Text>
                        <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} placeholder="Email address" value={this.state.email} onChangeText={email => this.setState({email})}/>
                        <TextInput underlineColorAndroid='transparent' style={GlobalStyles.textinput} secureTextEntry={true} placeholder="Password" value={this.state.password} onChangeText={password => this.setState({password})} />
                        <View>
                            {this.renderButtonOrSpinner()}
                            <Button style={GlobalStyles.buttonLink} textStyle={GlobalStyles.buttonLinkText} onPress={() => this._handleGoToCreateAccount()}>Create an account</Button>
                        </View>
                    </ScrollView>
                </View>
            )
        } else {
            // TODO: OFFLINE

            // loading (while logging in)
            return (
                <View style={{alignItems:'center',justifyContent:'center',height:'100%',width:'100%'}}>
                    <Image source={require('../assets/images/icon.png')} style={{width:50,height:50}}></Image>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={GlobalStyles.container}>
                {this.renderForm()}
            </View>
        );
    }
}
