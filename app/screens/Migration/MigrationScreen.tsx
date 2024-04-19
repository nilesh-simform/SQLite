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
import styles from './MigrationStyles';
import {todoItem} from '../../constants/types';
import {addMovie, getMovies} from './queries';
import {TodoCard} from '../../Components';
import Database from '../../constants/config';

const MigrationExample: FC<{}> = () => {
  const [movieName, setMovieName] = useState<string>('');
  const [moviePrice, setMoviePrice] = useState<number>();
  const [isDBIntitialized, setIsDBInitialized] = useState(false);
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

  const checkDBIntialization = () => {
    const db = Database.getDatabase();

    if (db) {
      setIsDBInitialized(true);
    } else {
      setTimeout(() => {
        checkDBIntialization();
      }, 1000);
    }
  };

  useEffect(()=>{
    checkDBIntialization()
  },[])

  useEffect(() => {
    if (isDBIntitialized) {
      setTimeout(()=>{
        fetch_data();
      },1000)
    }
  }, [isDBIntitialized]);

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
          onChangeText={txt => {
            if (!Number.isNaN(Number(txt))) {
              setMoviePrice(Number(txt));
            }
          }}
          placeholder="Movie Price"
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
