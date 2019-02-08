import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { height } = Dimensions.get('window');

import {
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryZoomContainer,
  VictoryClipContainer,
} from 'victory-native';

class FixedVictoryClipContainer extends VictoryClipContainer {
  renderClippedGroup(props, clipId) {
    const {
      style,
      events,
      transform,
      children,
      className,
      groupComponent,
    } = props;
    const clipComponent = this.renderClipComponent(props, clipId);
    const groupProps = {
      className,
      style,
      transform,
      key: `clipped-group-${clipId}`,
      clipPath: `url(#${clipId})`,
      events,
    };
    return React.cloneElement(groupComponent, groupProps, [
      ...React.Children.toArray(children),
      clipComponent,
    ]);
  }
}

class BrokenVictoryClipContainer extends VictoryClipContainer {
  renderClippedGroup(props, clipId) {
    const {
      style,
      events,
      transform,
      children,
      className,
      groupComponent,
    } = props;
    const clipComponent = this.renderClipComponent(props, clipId);
    const groupProps = {
      className,
      style,
      transform,
      key: `clipped-group-${clipId}`,
      clipPath: `url(#${clipId})`,
      events,
    };
    return React.cloneElement(groupComponent, groupProps, [
      clipComponent,
      ...React.Children.toArray(children),
    ]);
  }
}

export default class Chart extends Component {
  state = { length: 3 };
  inc = () => {
    this.setState(({ length }) => {
      return { length: length + 1 };
    });
  };
  dec = () => {
    this.setState(({ length }) => {
      return { length: length - 1 };
    });
  };
  render() {
    return (
      <View style={style.container}>
        <View style={style.buttons}>
          <TouchableOpacity onPress={this.inc} style={style.button}>
            <Text>Increment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.dec} style={style.button}>
            <Text>Decrement</Text>
          </TouchableOpacity>
        </View>
        <VictoryChart
          height={height - 100}
          containerComponent={
            <VictoryZoomContainer
              clipContainerComponent={<BrokenVictoryClipContainer />}
            />
          }
        >
          <VictoryGroup
            animate={{ duration: 1000, onLoad: { duration: 1000 } }}
          >
            {Array.from(this.state).map((_, i) => (
              <VictoryBar
                key={i}
                data={[
                  {
                    x: 1 + i * 0.5,
                    y: 1 + i * 10,
                  },
                  {
                    x: 2 + i * 0.5,
                    y: 2 + i * 10,
                  },
                ]}
              />
            ))}
          </VictoryGroup>
        </VictoryChart>
      </View>
    );
  }
}
const style = StyleSheet.create({
  container: { backgroundColor: 'white', paddingTop: 40 },
  buttons: { flexDirection: 'row' },
  button: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
});
