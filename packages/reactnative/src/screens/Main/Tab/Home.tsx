import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import Liquidity from './modules/home/Liquidity';

type Props = {};

export default function Example({}: Props) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 8, paddingVertical: 32, alignItems: 'center' }}>
        <Text variant="displaySmall" style={{ fontWeight: 'bold' }}>
          Shwap
        </Text>

        <Liquidity />
      </View>
    </ScrollView>
  );
}
