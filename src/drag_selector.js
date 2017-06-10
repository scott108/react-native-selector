import React, { Component } from 'react';
import {
  Text,
  View,
  PanResponder,
} from 'react-native';

export default class DragSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutHeight: 0,
      layoutWidth: 0,
      height: 0,
      width: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      offsetX: 0,
      offsetY: 0
    }
    this.measureLayout = this.measureLayout.bind(this);
  }
  componentWillMount() {
    // add PanRespnder listener
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // gestureState.{x,y}0
        this.setState({ height: null,
                        width: null,
                        top: gestureState.y0,
                        bottom: this.state.layoutHeight - gestureState.y0,
                        left: gestureState.x0,
                        right: this.state.layoutWidth - gestureState.x0
                        });
        //console.log("onPanResponderGrant (x0, y0): " + "(" + gestureState.x0 + ", " + gestureState.y0 + ")");
      },
      onPanResponderMove: (evt, gestureState) => {
        // last move distance gestureState.move{X,Y}
        // move distance gestureState.d{x,y}
        if(gestureState.dx < 0) {
          this.setState({ offsetX: gestureState.dx,
                          left: this.state.left + gestureState.dx - this.state.offsetX
                        });
        } else {
          this.setState({ offsetX: gestureState.dx,
                          right: this.state.right - gestureState.dx + this.state.offsetX
                        });
        }
        if(gestureState.dy < 0) {
          this.setState({ offsetY: gestureState.dy,
                          top: this.state.top + gestureState.dy - this.state.offsetY
                        });
        } else {
          this.setState({ offsetY: gestureState.dy,
                          bottom: this.state.bottom - gestureState.dy + this.state.offsetY
                        });
        }
        console.log("onPanResponderMove dx: " + "(" + gestureState.dx + ", " + gestureState.dy + ")");
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({ height: 0,
                        width: 0,
                        offsetX: 0,
                        offsetY: 0
                      });
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }
  measureLayout() {
    this.refs.selector.measure((a, b, width, height, px, py) => {
      this.setState({ layoutHeight: height, layoutWidth: width });
    });
  }
  componentDidMount() {
    setTimeout(this.measureLayout);
  }
  render() {
    return (
      <View ref='selector' style={this.props.style} {...this._panResponder.panHandlers}>
        {this.props.children}
        <View style={{position: 'absolute',
                      height: this.state.height,
                      width: this.state.width,
                      top: this.state.top,
                      bottom: this.state.bottom,
                      left: this.state.left,
                      right: this.state.right,
                      backgroundColor: '#DDFF7788', 
                      borderWidth: 1, 
                      borderColor: '#DDFF77ff'}}/>
      </View>
    );
  }
}