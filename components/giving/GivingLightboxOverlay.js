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
import GivingInputForm from './GivingInputForm';

const WINDOW_HEIGHT = Layout.window.height;
const WINDOW_WIDTH = Layout.window.width;
const STATUS_BAR_OFFSET = (Platform.OS === 'android' ? -25 : 0);
const isIOS = Platform.OS === 'ios';


export default class GivingLightboxOverlay extends Component {
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

    constructor(props){
        super(props);
        this.state = {
            isAnimating: false,
            target: {
                x: 0,
                y: 0,
                opacity: 1,
            },
            openVal: new Animated.Value(0),
            image: require('../../assets/images/placeholder.png'),

            scrollY: new Animated.Value(0),

        };
    }


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

    _handleScroll(e) {
        //console.log(e.nativeEvent.contentOffset.y, this.state.scrollY, "jvjhvhm");
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
                        <GivingInputForm merit={this.props.merit}/>
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
        color: Colors.palette.darkPurple,
        lineHeight: 40,
        width: 40,
        textAlign: 'center',
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
    }
});