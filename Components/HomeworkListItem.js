import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import moment from 'moment';

class HomeworkListItem extends React.Component {
	render() {
        return(
            <TouchableOpacity onPress={this.props.onPress} style={styles.Item}>
                <Text style={[styles.ItemMain, (this.props.homeworkItem.completed ? styles.Completed : null)]}>{this.props.homeworkItem.name}</Text>
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
        color: '#cccccc',
        textDecorationLine: 'line-through',
    }
})

export default HomeworkListItem;