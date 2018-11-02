import React, { Component } from 'react';

import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

export default class SRImage extends Component {
  constructor(props) {
    super(props);

    // state
    this.state = {
      loadComplete: false,
    }
  }
  render() {
    return (
      <View style={this.props.style}>
        <Image
          {...this.props}
          style={this.state.loadComplete ? styles.hide : styles.show}
          source={this.props.sr_defaultSource}
        />
        {
          this.props.source.uri ? (
            <Image
              {...this.props}
              style={this.state.loadComplete ? styles.show : styles.hide}
              source={this.props.source}
              onLoad={() => {
                console.log('加载完成');
                this.setState({
                  loadComplete: true,
                })
              }}
            />
          ) : (
              null
            )
        }

      </View>
    )
  }
}

const styles = StyleSheet.create({
  hide: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 1,
    height: 1,
  },
  show: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
})
