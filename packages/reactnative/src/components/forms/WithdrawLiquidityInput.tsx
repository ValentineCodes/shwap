import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { COLORS } from '../../utils/constants';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function WithdrawLiquidityInput({}: Props) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');

  const handleInputChange = (value: string) => {
    if (value.trim() === '') {
      setEthAmount('');
      setUsdtAmount('');
      return;
    }
    const ethAmount = Number(value);

    if (isNaN(ethAmount)) return;

    setWithdrawAmount(value.trim());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Liquidity</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={withdrawAmount}
          mode="outlined"
          style={styles.inputField}
          outlineColor="transparent"
          activeOutlineColor="transparent"
          placeholderTextColor="#ccc"
          cursorColor="#ccc"
          placeholder="0"
          onChangeText={handleInputChange}
        />

        <Pressable onPress={() => null} style={styles.button}>
          <Text style={styles.buttonLabel}>Withdraw</Text>
        </Pressable>
      </View>

      <Text style={styles.balance}>0 Liquidity</Text>

      <View style={styles.outputContainer}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: 'grey' }}>ETH</Text>
          <TextInput
            value={ethAmount}
            mode="outlined"
            style={styles.inputField}
            outlineStyle={{ borderWidth: 0 }}
            outlineColor="transparent"
            activeOutlineColor="transparent"
            placeholderTextColor="#ccc"
            cursorColor="#ccc"
            placeholder="0"
            disabled
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: 'grey' }}>USDT</Text>
          <TextInput
            value={usdtAmount}
            mode="outlined"
            style={styles.inputField}
            outlineStyle={{ borderWidth: 0 }}
            outlineColor="transparent"
            activeOutlineColor="transparent"
            placeholderTextColor="#ccc"
            cursorColor="#ccc"
            placeholder="0"
            disabled
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center'
  },
  title: {
    fontSize: FONT_SIZE['lg'],
    fontWeight: 'bold',
    color: 'grey'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  inputField: {
    flex: 1,
    fontSize: 35,
    marginLeft: -15,
    backgroundColor: 'transparent'
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primary
  },
  buttonLabel: {
    fontSize: FONT_SIZE['lg'],
    fontWeight: 'bold',
    color: 'white'
  },
  balance: {
    textAlign: 'right',
    fontSize: FONT_SIZE['md']
  },
  outputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  }
});
