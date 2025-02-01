import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AddLiqudityInput({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Liquidity</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          mode="outlined"
          style={styles.inputField}
          outlineColor="transparent"
          activeOutlineColor="transparent"
          placeholderTextColor="#ccc"
          cursorColor="#ccc"
          placeholder="0"
          onChangeText={onChange}
        />
        <Text style={styles.token}>ETH</Text>
      </View>

      <Text style={styles.balance}>0 ETH</Text>

      <View style={[styles.inputContainer, { marginTop: 10 }]}>
        <TextInput
          value={value}
          mode="outlined"
          style={styles.inputField}
          outlineColor="transparent"
          activeOutlineColor="transparent"
          placeholderTextColor="#ccc"
          cursorColor="#ccc"
          placeholder="0"
          onChangeText={onChange}
        />
        <Text style={styles.token}>USDT</Text>
      </View>

      <Text style={styles.balance}>0 USDT</Text>
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
  token: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'grey',
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: FONT_SIZE['xl'],
    fontWeight: 'bold',
    color: 'grey'
  },
  balance: {
    textAlign: 'right',
    fontSize: FONT_SIZE['md']
  }
});
