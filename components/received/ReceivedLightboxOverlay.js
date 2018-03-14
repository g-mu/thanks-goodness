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
    Image } from 'react-native';
import GlobalStyles from "../../constants/GlobalStyles";
import Button from 'apsl-react-native-button';
import {profileData, webStorage} from "../../api/firebase";
import Layout from '../../constants/Layout';
import {mailgunConfig} from "../../api/mailgun";
import stateManager from "../../api/stateManager";
import { ReceivedMessageBlock } from "./ReceivedMessageBlock";
import GivingInputForm from "../giving/GivingInputForm";

const WINDOW_HEIGHT = Layout.window.height;
const WINDOW_WIDTH = Layout.window.width;
const STATUS_BAR_OFFSET = (Platform.OS === 'android' ? -25 : 0);
const isIOS = Platform.OS === 'ios';


export default class ReceivedLightboxOverlay extends Component {
    static propTypes = {
        origin: PropTypes.shape({
            x:        PropTypes.number,
            y:        PropTypes.number,
            width:    PropTypes.number,
            height:   PropTypes.number,
        }),
        springConfig: PropTypes.shape({
            tension:  PropTypes.number,
            friction: PropTypes.number,
        }),
        backgroundColor: PropTypes.string,
        isOpen:          PropTypes.bool,
        renderHeader:    PropTypes.func,
        onOpen:          PropTypes.func,
        onClose:         PropTypes.func,
        swipeToDismiss:  PropTypes.bool,
    };

    static defaultProps = {
        springConfig: { tension: 30, friction: 7 },
        backgroundColor: 'black',
    };

    state = {
        isAnimating: false,
        target: {
            x: 0,
            y: 0,
            opacity: 1,
        },
        openVal: new Animated.Value(0),
        image: require('../../assets/images/placeholder.png'),
        recipientEmail: '',
        message: '',
        error: ' ',
        scrollY: new Animated.Value(0),
        showSendToAFriend: false,
    };

    componentWillMount() {
    }

    componentDidMount() {
        if(this.props.isOpen) {
            this.open();
        }
        this.loadMeritImage();
    }

    loadMeritImage() {
        let originalThis = this;
        webStorage.child('merits/' + this.props.merit.key + '.png').getDownloadURL().then(function(url) {
            originalThis.setState({image:{uri: url}});
        }).catch(function(error) {
            // Handle any errors
            console.log('image error',error);
        });
    }

    resetState() {
        this.state.scrollY.setValue(0);
        this.setState({
            isAnimating: true,
            target: {
                x: 0,
                y: 0,
                opacity: 1,
            },
            recipientEmail: '',
            message: '',
            error: ' ',
            showSendToAFriend: false,
        });
    }

    open = () => {
        if(isIOS) {
            StatusBar.setHidden(true, 'fade');
        }
        this.resetState();

        Animated.spring(
            this.state.openVal,
            { toValue: 1, ...this.props.springConfig }
        ).start(() => this.setState({ isAnimating: false }));
    }

    close = () => {
        if(isIOS) {
            StatusBar.setHidden(false, 'fade');
        }
        this.resetState();
        Animated.spring(
            this.state.openVal,
            { toValue: 0, ...this.props.springConfig }
        ).start(() => {
            this.setState({
                isAnimating: false,
            });
            this.props.onClose();
        });
    }

    componentWillReceiveProps(props) {
        if(this.props.isOpen != props.isOpen && props.isOpen) {
            this.open();
        }
    }

    _handleSendMerit(){
        console.log('send merit clicked', this.props.merit);
        this.setState({error:' '});
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(this.state.recipientEmail) === false)
        {
            setTimeout(() => {this.setState({error:'Please make sure the email is correct.'})}, 100);
            return;
        }
        else {
            console.log('Logging to firebase');
            // TODO: Log to firebase profile
            profileData.orderByChild('email').equalTo(stateManager.user.email).once('value').then(function(profileSnapshot) {
                console.log('profileSnapshot',profileSnapshot);
                // stateManager.user.firstname = (profilSnapshot.val() && profilSnapshot.val().firstname);
                // stateManager.user.lastname = (profilSnapshot.val() && profilSnapshot.val().lastname);
                // console.log('user',stateManager.user);
            });
            console.log('Sending to', this.state.recipientEmail);
            mailgunConfig.sendMerit(this.state.recipientEmail,vthis.state.image.uri, this.state.message);
            // TODO: confirm to the user that it was sent
        }
    }

    _handleScroll(e) {
        //console.log(e.nativeEvent.contentOffset.y, this.state.scrollY, "jvjhvhm");
    }

    renderSendSection() {
        if (this.state.showSendToAFriend) {
            return <GivingInputForm merit={this.props.merit} onComplete={() => this._handleHideSendClick()}/>
        } else {
            return <Button style={GlobalStyles.buttonLink} textStyle={GlobalStyles.buttonLinkText} onPress={() => this._handleShowSendClick()}>Send to a friend</Button>
        }
    }
    _handleShowSendClick(){
        this.setState({showSendToAFriend:true});
    }
    _handleHideSendClick(){
        //setTimeout(() => {this.setState({showSendToAFriend: false})}, 2000);
    }

    render() {
        const {
            isOpen,
            origin,
            backgroundColor,
        } = this.props;

        const {
            openVal,
            target,
        } = this.state;

        const opacityStyle = {
            opacity: openVal.interpolate({inputRange: [0, 0.1, 1], outputRange: [0, target.opacity/1.1, target.opacity]})
        };
        const imageStyle = {
            padding: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity*48]}),
            paddingTop: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity*32]}),
            paddingBottom: 24,
            margin: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity*48]}),
        };

        const openStyle = [styles.open, {
            left:   openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
            top:    openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y + STATUS_BAR_OFFSET, target.y + STATUS_BAR_OFFSET]}),
            width:  openVal.interpolate({inputRange: [0, 1], outputRange: [origin.width, WINDOW_WIDTH]}),
            height: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.height, WINDOW_HEIGHT]}),
        }];

        var imgMaxHeight = this.state.scrollY.interpolate({
            inputRange: [0, 180, 181],
            outputRange: [280, 120, 120]
        });

        const background = (<Animated.View style={[styles.background, { backgroundColor: backgroundColor }, opacityStyle]}></Animated.View>);
        const header = (<Animated.View style={[styles.header, opacityStyle]}>
            <TouchableOpacity onPress={this.close}>
                <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
        </Animated.View>);

        const content = (
            <Animated.View style={[openStyle,opacityStyle]}>
                <View style={styles.contentContainer}>
                    <Animated.ScrollView
                        style={[styles.actionArea]}
                        scrollEventThrottle={16}
                        contentContainerStyle={{
                            paddingTop: 324,
                            paddingBottom: Layout.standardPadding,
                        }}
                        // Declarative API for animations ->
                        onScroll={Animated.event(
                            [ { nativeEvent: { contentOffset: { y: this.state.scrollY } } } ],
                            { listener: this._handleScroll.bind(this) }, { useNativeDriver: true } )
                        }
                    >
                        <ReceivedMessageBlock merit={this.props.merit}/>
                        {
                            this.props.merit.instances.map((submerit, j) => {
                                return <ReceivedMessageBlock key={j} merit={submerit} />
                            })
                        }
                        {this.renderSendSection()}
                     </Animated.ScrollView>
                    <Animated.View style={{position: 'absolute',maxHeight:imgMaxHeight,width:'100%',display:'flex'}}>
                        <Animated.Image source={this.state.image} style={[GlobalStyles.fullWidthImage, imageStyle, {maxHeight:imgMaxHeight}]}></Animated.Image>
                    </Animated.View>
                </View>
            </Animated.View>
        );

        if (this.props.navigator) {
            return (
                <View>
                    {background}
                    {content}
                    {header}
                </View>
            );
        }

        return (
            <Modal visible={isOpen} transparent={true} onRequestClose={() => this.close()}>
                {background}
                {content}
                {header}
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
    },
    open: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        // Android pan handlers crash without this declaration:
        backgroundColor: 'transparent',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: WINDOW_WIDTH,
        backgroundColor: 'transparent',
        alignItems: 'flex-end'
    },
    contentContainer:{
        width: '100%',
        height:'100%',
    },
    closeButton: {
        fontSize: 35,
        color: 'black',
        lineHeight: 40,
        width: 40,
        textAlign: 'center',
        // shadowOffset: {
        //     width: 0,
        //     height: 0,
        // },
        // shadowRadius: 1.5,
        // shadowColor: 'white',
        // shadowOpacity: 0.8,
    },
    image:{
        aspectRatio: (1/1),
        width: '100%',
        height: '100%',
        // Make sure the image doesn't exceed it's original size
        // If you want it to exceed it's original size, then
        // don't use maxWidth / maxHeight or set their
        // value to null
        // maxWidth: 600,
        // maxHeight: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
        resizeMode: 'contain',
    },
    actionArea:{
        padding: Layout.standardPadding,
    },
});