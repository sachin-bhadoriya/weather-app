import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import React from 'react';
import Main from './components/Main';

const App = () => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={['#1e2549', '#473b90', '#7646a6']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <Main />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default App;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    width: "90%",
    margin: "auto"
  },
});