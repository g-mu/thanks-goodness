import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, Modal, PanResponder, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DRAG_DISMISS_THRESHOLD = 150;
const STATUS_BAR_OFFSET = (Platform.OS === 'android' ? -25 : 0);
const isIOS = Platform.OS === 'ios';

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
  },
  closeButton: {
    fontSize: 35,
    color: 'black',
    lineHeight: 40,
    width: 40,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: 'white',
    shadowOpacity: 0.8,
  },
});

export default class LightboxOverlay extends Component {
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
    isPanning: false,
    target: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    pan: new Animated.Value(0),
    openVal: new Animated.Value(0),
  };

  componentWillMount() {
  }

  componentDidMount() {
    if(this.props.isOpen) {
      this.open();
    }
  }

  open = () => {
    if(isIOS) {
      StatusBar.setHidden(true, 'fade');
    }
    this.state.pan.setValue(0);
    this.setState({
      isAnimating: true,
      target: {
        x: 0,
        y: 0,
        opacity: 1,
      }
    });

    Animated.spring(
      this.state.openVal,
      { toValue: 1, ...this.props.springConfig }
    ).start(() => this.setState({ isAnimating: false }));
  }

  close = () => {
    if(isIOS) {
      StatusBar.setHidden(false, 'fade');
    }
    this.setState({
      isAnimating: true,
    });
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

  render() {
    const {
      isOpen,
      renderHeader,
      swipeToDismiss,
      origin,
      backgroundColor,
    } = this.props;

    const {
      isPanning,
      isAnimating,
      openVal,
      target,
    } = this.state;

    const headerOpacityStyle = {
      opacity: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity]})
    };
    const lightboxOpacityStyle = {
      opacity: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity]})
    };

    const openStyle = [styles.open, {
      left:   openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
      top:    openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y + STATUS_BAR_OFFSET, target.y + STATUS_BAR_OFFSET]}),
      width:  openVal.interpolate({inputRange: [0, 1], outputRange: [origin.width, WINDOW_WIDTH]}),
      height: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.height, WINDOW_HEIGHT]}),
    }];

    const background = (<Animated.View style={[styles.background, { backgroundColor: backgroundColor }, lightboxOpacityStyle]}></Animated.View>);
    const header = (<Animated.View style={[styles.header, headerOpacityStyle]}>
        <TouchableOpacity onPress={this.close}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
    </Animated.View>);
    const content = (
      <Animated.View style={[openStyle]}>
        {this.props.children}
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
