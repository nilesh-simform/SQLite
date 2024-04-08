import React from 'react';
import {SafeAreaView} from 'react-native';
import BasicExample from './app/screens/Basic/BasicExample';
import MigrationExample from './app/screens/Migration/MigrationScreen';

function App(): JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <BasicExample />
      {/* <MigrationExample /> */}
    </SafeAreaView>
  );
}

export default App;
