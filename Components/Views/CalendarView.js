import React from 'react';
import { View, StyleSheet, Text, AsyncStorage } from 'react-native';
import { Agenda } from 'react-native-calendars';
import moment from 'moment';

import Loading from '../Loading.js'
import { createStackNavigator } from 'react-navigation';


class CalendarView extends React.Component {
    static navigationOptions = {
        title: 'Calendar',
    };

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            monthsLoaded: [],
            loading: true
        };
        this.load();
    }

    load = async () => {
        const token = await AsyncStorage.getItem('csrfToken');
        this.setState({
            token: token,
            loading: false,
        })
    }

    render() {
        if (this.state.loading) return <Loading />
        return (
            <Agenda
                items={this.state.items}
                loadItemsForMonth={(month) => {
                    if (this.state.monthsLoaded.indexOf(moment(month).format("YYYY-MM") < 0)) {
                        const start = moment().startOf('month').startOf('week').format("YYYY-MM-DD");
                        const end = moment().endOf('month').endOf('week').format("YYYY-MM-DD");
                        fetch(`https://api-v2.myhomework.space/calendar/getView?csrfToken=${this.state.token}&start=${start}&end=${end}`, {
                            method: 'GET',
                            credentials: 'include',
                        }).then((response) => {
                            return response.text();
                        }).then((text) => {
                            const days = JSON.parse(text).view.days;
                            let items = this.state.items
                            for (const i in days) {
                                if (moment(days[i].day).month() == moment(month).month()) {
                                    items[days[i].day] = days[i].events
                                    if (days[i].shiftingIndex != -1) {
                                        items[days[i].day].splice(0, 0, { type: "friday", name: `Friday ${days[i].shiftingIndex}` });
                                    }
                                }
                            }
                            const monthsLoaded = this.state.monthsLoaded;
                            monthsLoaded.push(moment(month).format("YYYY-MM"));
                            this.setState({
                                items: items,
                                monthsLoaded: monthsLoaded
                            })
                        }).catch((error) => {
                            console.error(error);
                            alert("Could not connect to MyHomeworkSpace server.")
                        })
                    }
                }}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
            />
        );
    }

    renderItem(item) {
        return (
            <View>
            {
                item.type == "friday" || item.type == "announcement" ?
                    <View style={styles.noBgItem}><Text style={styles.grayText}>{item.name}</Text></View>
                    : (<View style={styles.item}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.times}>{moment(item.start*1000).format("h:mm a") + " - " + moment(item.end*1000).format("h:mm a")}</Text>
                        {item.data.ownerName ? <Text style={styles.small}>{item.data.ownerName}</Text> : null}
                        {item.data.buildingName ? <Text style={styles.small}>{item.data.buildingName + " " + item.data.roomNumber}</Text> : null}
                    </View>)
            }
            </View>
        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text style={styles.grayText}>No events today!</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    noBgItem: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    grayText: {
        color: '#777777'
    },
    itemName: {
        fontWeight: "bold"
    },
    small: {
        color: '#777777',
        fontSize: 13
    }
});

export default createStackNavigator(
    {
        CalendarView: CalendarView,
    },
    {
        initialRouteName: 'CalendarView',
    }
);