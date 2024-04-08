import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './MigrationStyles';
import Database from '../../constants/config';
const db = Database.getDatabase();

type todoItem = {
  id: number;
  name: string;
  price: number;
};

const MigrationExample = () => {
  const [movieName, setMovieName] = useState<string>('');
  const [moviePrice, setMoviePrice] = useState<number>();
  const [list, setList] = useState<todoItem[]>([]);

  const add_data = () => {
    if (!movieName || !moviePrice) {
      Alert.alert('Pls Add the data');
      return;
    }

    db.executeSql(
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

    setMovieName('');
    setMoviePrice(undefined);
  };

  const fetch_data = () => {
    db.transaction(async tx => {
      tx.executeSql(
        'select * from movies',
        [],
        (result, set) => {
          let arr = [];
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
    setTimeout(() => {
      fetch_data();
    }, 1000);
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
          keyboardType="numeric"
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

export default MigrationExample;
