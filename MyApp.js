import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, StatusBar, FlatList, Alert } from "react-native";
import database from '@react-native-firebase/database';

function MyApp() {
    const [inputValue, setInputValue] = useState(null);
    const [fetchdata, setFetchData] = useState([]);

    const [isupdatedata, setIsUpdateData] = useState(false);
    const [selectedcardindex, setSelectedCardindex] = useState(null);


    useEffect(() => {
        getdatafromdb();
    }, []);

    const getdatafromdb = async () => {
        try {
            await database().goOffline();
            const dbRef = database().ref('todo');
            dbRef.on('value', (snapshot) => {
                const data = snapshot.val();
                setFetchData(data || []);
            });
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const presshandler = async () => {
        try {
            if (inputValue && inputValue.length !== 0) {
                console.log(fetchdata.length)
                const count = fetchdata.length;
                await database().ref(`todo/${count}`).set({
                    value: inputValue,
                });
                setInputValue('');
            } else {
                Alert.alert('Please enter some value and try again...');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updatehandler = async () => {
        try {
            if (inputValue && inputValue.length !== 0) {
                await database().ref(`todo/${selectedcardindex}`).update({
                    value: inputValue,
                });
                setIsUpdateData(false);
                setInputValue('');
            } else {
                Alert.alert('Please enter some value and try again...');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removehandler = async (cardindex) => {
        try {
            Alert.alert('Alert', "Are sure to delete data ?", [
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log("Cancel");
                    },
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        console.log("Ok");
                        try {
                            await database().ref(`todo/${cardindex}`).remove();
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    const handlercardpress = async (cardindex, cardvalue) => {
        try {
            setIsUpdateData(true);
            setInputValue(cardvalue);
            setSelectedCardindex(cardindex);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <View>
                <Text style={{ color: 'black', fontSize: 30, textAlign: 'center', fontWeight: 'bold' }}>To-do App</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Please enter any value..."
                    value={inputValue}
                    onChangeText={(value) => setInputValue(value)}
                />
                {
                    !isupdatedata ? (
                        <TouchableOpacity style={styles.addButtion} onPress={() => presshandler()}>
                            <Text style={{ color: 'black', fontSize: 20 }}>Add</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.addButtion} onPress={() => updatehandler()}>
                            <Text style={{ color: 'black', fontSize: 20 }}>Update</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
            <View style={styles.flatListContainer}>
                <Text style={{ fontSize: 25, marginVertical: 20, fontWeight: 'bold' }}>My Todo-List</Text>
                <FlatList
                    data={fetchdata}
                    renderItem={({ item, index }) => {
                        if (item !== null) {
                            return (
                                <TouchableOpacity onPress={() => handlercardpress(index, item.value)} onLongPress={() => removehandler(index)}>
                                    <View style={styles.addCardContainer}>
                                        <Text style={styles.card}>{item.value}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
}

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
    },
    inputBox: {
        padding: 10,
        marginTop: 25,
        width: width - 30,
        borderRadius: 10,
        borderWidth: 2,
    },
    addButtion: {
        backgroundColor: 'coral',
        alignItems: 'center',
        padding: 10,
        marginTop: 20,
        borderRadius: 20,
    },
    flatListContainer: {
        flex: 1,
        height: height - 250,
        alignItems: 'center',
    },
    addCardContainer: {
        marginTop: 5,
        backgroundColor: 'palegreen',
        borderColor: 'black',
        borderWidth: 1, 
        borderRadius: 30,
        padding: 20,
        width: width - 50,
    },
    card: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default MyApp;
