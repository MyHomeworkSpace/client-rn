import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import moment from 'moment';

class HomeworkListItem extends React.Component {
    render() {
        let nameComponents = this.props.homeworkItem.name.split(' ');
        nameComponents = [nameComponents.shift(), nameComponents.join(' ')];
        const completed = (this.props.homeworkItem.complete == 0 ? false : true);
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.Item}>
                <Text style={[styles.ItemMain, (completed ? styles.Completed : null)]}>
                    <Text style={this.props.prefixes[nameComponents[0]] ? { backgroundColor: "#" + this.props.prefixes[nameComponents[0]].background, color: "#" + this.props.prefixes[nameComponents[0]].color } : null}>
                        {nameComponents[0]}
                    </Text>{" " + nameComponents[1]}
                </Text>
                <Text style={styles.itemSecondary}>Due {moment(this.props.homeworkItem.due).format("ddd, MMM Do")}</Text>
            </TouchableOpacity>
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
    }
})

export default HomeworkListItem;