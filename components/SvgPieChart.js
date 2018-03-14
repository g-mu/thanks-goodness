import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Constants, Svg } from 'expo';
import {PieChart} from './pie-chart';
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

export class SvgPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        }
    }

    render() {
        const {data} = this.state;

        const pieData = data
            .filter(value => value.val > 0)
            .map((value, index) => ({
                value: value.val,
                color: data[index].color,
                key: `pie-${index}`,
            }))

        return (
            <View>
                <PieChart
                    width={'100%'}
                    height={200}
                    style={ { height: 200 } }
                    data={ pieData }
                    spacing={ 0 }
                    innerRadius={ 20 }
                    outerRadius={ 55 }
                    labelRadius={ 80 }
                    renderDecorator={ ({ item, pieCentroid, labelCentroid, index }) => (
                        <Svg.G key={ index }>
                            <Svg.Line
                                x1={ labelCentroid[ 0 ] }
                                y1={ labelCentroid[ 1 ] }
                                x2={ pieCentroid[ 0 ] }
                                y2={ pieCentroid[ 1 ] }
                                stroke={ item.color }
                            />
                            <Svg.Circle
                                cx={ labelCentroid[ 0 ] }
                                cy={ labelCentroid[ 1 ] }
                                r={ 15 }
                                fill={ item.color }
                            />
                        </Svg.G>
                    ) }
                />
                <View style={styles.keyTextContainer}>
                {
                    data.sort(function(a,b){return a.val - b.val}).map((data, j) => {
                        return <Text key={j} style={[styles.keyText,{color:data.color}]}>{data.val} {data.label}</Text>
                    })
                }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    keyTextContainer:{
        width: Layout.window.width,
        padding: Layout.standardPadding,
        paddingTop:0,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    keyText: {
        minWidth: '33%',
        flexBasis: '33%',
        flex: 1,
        padding:4,
        height:28,
    },
});


