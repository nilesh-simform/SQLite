import SQLite from 'react-native-sqlite-storage';
import {todoItem} from '../../constants/types';

const db = SQLite.openDatabase(
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

export const createTable = () => {
  db.executeSql(
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

export const addMovie = (
  movieName: string,
  moviePrice: number,
  successCB: () => void,
) => {
  db.executeSql(
    'Insert into movies (name, price) values (?,?)',
    [movieName, moviePrice],
    result => {
      console.log('Added successfully');
      successCB();
    },
    e => {
      console.log('Error', e);
    },
  );
};

export const getMovies = (successCB: (result: todoItem[]) => void) => {
  db.transaction(async tx => {
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

        successCB(arr);
      },
      e => {
        console.log('Error', e);
      },
    );
  });
};
