import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import ProvideLiquidity from '../../../components/forms/ProvideLiquidity';
import SwapForm from '../../../components/forms/SwapForm';
import WithdrawLiquidity from '../../../components/forms/WithdrawLiquidity';
import Liquidity from './modules/home/Liquidity';

type Props = {};

export default function Home({}: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 8, paddingVertical: 32, alignItems: 'center' }}>
        <Text variant="displaySmall" style={{ fontWeight: 'bold' }}>
          Shwap
        </Text>

        <Liquidity />
        <ProvideLiquidity />
        <WithdrawLiquidity />
        <SwapForm />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
