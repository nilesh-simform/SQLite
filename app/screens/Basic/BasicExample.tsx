import React, {FC, useEffect, useState} from 'react';
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
import {addMovie, createTable, getMovies} from './queries';
import {todoItem} from '../../constants/types';
import {TodoCard} from '../../Components';

const BasicExample: FC<{}> = () => {
  const [movieName, setMovieName] = useState<string>('');
  const [moviePrice, setMoviePrice] = useState<number>();
  const [list, setList] = useState<todoItem[]>([]);

  const add_data = () => {
    if (!movieName || !moviePrice) {
      Alert.alert('Pls Add the data');
      return;
    }

    addMovie(movieName, moviePrice, () => {
      fetch_data();
      Keyboard.dismiss();
      setMovieName('');
      setMoviePrice(undefined);
    });
  };

  const fetch_data = () => {
    getMovies(setList);
  };

  useEffect(() => {
    createTable();
    fetch_data();
  }, []);

  const _renderItems = ({item}: {item: todoItem}) => {
    return <TodoCard item={item} />;
  };

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <TextInput
          value={movieName}
          style={styles.textInput}
          onChangeText={txt => setMovieName(txt)}
          placeholder="Movie Name"
        />
        <TextInput
          value={moviePrice?.toString()}
          style={styles.textInput}
          keyboardType="numeric"
          placeholder="Movie Price"
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
