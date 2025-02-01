import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';
import AmountInput from './AmountInput';

type Props = {};

export default function SwapForm({}: Props) {
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={
          isFlipped
            ? { flexDirection: 'column-reverse' }
            : { flexDirection: 'column' }
        }
      >
        <AmountInput
          title={isFlipped? "Buy" : "Sell"}
          value={sellAmount}
          token="ETH"
          balance="1"
          onChange={setSellAmount}
        />

        <IconButton
          icon="arrow-down"
          size={24}
          iconColor="white"
          onPress={() => setIsFlipped(!isFlipped)}
          style={styles.switchButton}
        />

        <AmountInput
          title={isFlipped? "Sell" : "Buy"}
          value={buyAmount}
          token="USDT"
          balance="3310.25"
          onChange={setBuyAmount}
        />
      </View>
      <Button
        mode="contained"
        onPress={() => null}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Swap
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20
  },
  switchButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    marginTop: -18,
    marginBottom: -18,
    zIndex: 10
  },

  button: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 5,
    backgroundColor: COLORS.primary
  },
  buttonLabel: {
    fontSize: FONT_SIZE['lg'],
    color: 'white'
  }
});
