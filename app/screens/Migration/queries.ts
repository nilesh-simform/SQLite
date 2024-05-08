import Database from '../../constants/config';
import {todoItem} from '../../constants/types';

const db = Database.getDatabase();

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
