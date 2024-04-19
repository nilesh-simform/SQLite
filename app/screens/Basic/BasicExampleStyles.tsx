import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    borderBottomWidth: 1,
  },
  textInput: {
    borderWidth: 1,
    width: 140,
    marginRight: 10,
    height: 40,
    paddingLeft: 10,
  },
  btn: {
    width: 70,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
