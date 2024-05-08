import React from 'react';
import {todoItem} from '../../constants/types';
import {Text, View} from 'react-native';
import styles from './TodoCardStyles';

const TodoCardScreen: React.FC<{item: todoItem}> = ({item}) => {
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

export default TodoCardScreen;
