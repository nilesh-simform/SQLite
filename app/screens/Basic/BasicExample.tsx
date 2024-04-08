import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './BasicExampleStyles';
import SQLite from 'react-native-sqlite-storage';

global.db = SQLite.openDatabase(
  {
    name: 'BasicDB',
    location: 'default',
  },
  res => {
    console.log('Success to Open Database', res);
  },
  error => {
    console.log('Error on Open Database', error);
  },
);

type todoItem = {
  id: number;
  name: string;
  price: number;
};

const BasicExample = () => {
  const [movieName, setMovieName] = useState<string>('');
  const [moviePrice, setMoviePrice] = useState<number>();
  const [list, setList] = useState<todoItem[]>([]);

  const createTable = () => {
    global.db.executeSql(
      'CREATE TABLE IF NOT EXISTS movies (userId INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, price INTEGER)',
      [],
      result => {
        console.log('Users TAble created successfully', result);
      },
      error => {
        console.log('Users Error while creating table', error);
      },
    );
  };

  const add_data = () => {
    if (!movieName || !moviePrice) {
      Alert.alert('Pls Add the data');
      return;
    }

    global.db.executeSql(
      'Insert into movies (name, price) values (?,?)',
      [movieName, moviePrice],
      result => {
        console.log('Added successfully');
        fetch_data();
      },
      e => {
        console.log('Error', e);
      },
    );

    Keyboard.dismiss();

    setMovieName('');
    setMoviePrice(undefined);
  };

  const fetch_data = () => {
    global.db.transaction(async tx => {
      tx.executeSql(
        'select * from movies',
        [],
        (result, set) => {
          let arr: todoItem[] = [];
          console.log('fetched successfully', set);
          for (let i = 0; i < set.rows.length; i++) {
            console.log(set.rows.item(i));
            arr.push(set.rows.item(i));
          }

          setList(arr);
        },
        e => {
          console.log('Error', e);
        },
      );
    });
  };

  useEffect(() => {
    createTable();
    fetch_data();
  }, []);

  const _renderItems = ({item}: {item: todoItem}) => {
    return (
      <View style={styles.card}>
        <View style={{flexDirection: 'row'}}>
          <Text>Name: </Text>
          <Text>{item.name}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>Price: </Text>
          <Text>{item.price}$</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <TextInput
          value={movieName}
          style={styles.textInput}
          onChangeText={txt => setMovieName(txt)}
        />
        <TextInput
          value={moviePrice?.toString()}
          style={styles.textInput}
          keyboardType='numeric'
          onChangeText={txt => {
            if (!Number.isNaN(Number(txt))) {
              setMoviePrice(Number(txt));
            }
          }}
        />
        <TouchableOpacity onPress={add_data} style={styles.btn}>
          <Text style={{color: 'white'}}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={list} renderItem={_renderItems} />
    </View>
  );
};

export default BasicExample;
