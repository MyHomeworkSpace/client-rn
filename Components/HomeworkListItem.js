import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import moment from 'moment';

class HomeworkListItem extends React.Component {
    render() {
        let nameComponents = this.props.homeworkItem.name.split(' ');
        nameComponents = [nameComponents.shift(), nameComponents.join(' ')];
        const completed = (this.props.homeworkItem.complete == 0 ? false : true);
        let overdue = (moment(this.props.homeworkItem.due).isBefore(moment().subtract(1, 'd')))
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.Item}>
                <Text style={[styles.ItemMain, (completed ? styles.Completed : null), (overdue ? styles.Overdue : null)]}>
                    <Text style={this.props.prefixes[nameComponents[0].toLowerCase()] ? { backgroundColor: "#" + this.props.prefixes[nameComponents[0].toLowerCase()].background, color: "#" + this.props.prefixes[nameComponents[0].toLowerCase()].color } : { backgroundColor: "#ffd3bd", color: "#000000" }}>
                        {nameComponents[0]}
                    </Text>{" " + nameComponents[1]}
                </Text>
                <Text style={styles.itemSecondary}>Due {moment(this.props.homeworkItem.due).format("ddd, MMM Do")}</Text>
            </TouchableOpacity >
        )
    }
}

const styles = StyleSheet.create({
    Item: {
        padding: 10,
    },
    ItemMain: {
        fontSize: 18,
    },
    ItemSecondary: {
        color: '#cccccc',
        fontSize: 14,
        padding: 10,
    },
    Completed: {
        color: '#888888',
        textDecorationLine: 'line-through',
    },
    Overdue: {
        color: "#ff0000"
    }
})

export default HomeworkListItem;