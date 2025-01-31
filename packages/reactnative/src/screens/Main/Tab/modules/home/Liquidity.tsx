import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { FONT_SIZE } from '../../../../../utils/styles';

type Props = {};

export default function Liquidity({}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liquidity</Text>
      <View style={styles.balancesContainer}>
        <Text style={styles.balance}>19.28 ETH</Text>
        <Text style={styles.balance}>2122.59 USDT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20
  },
  title: {
    fontSize: FONT_SIZE['xl']
  },
  balancesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 10
  },
  balance: {
    fontSize: FONT_SIZE['lg']
  }
});
