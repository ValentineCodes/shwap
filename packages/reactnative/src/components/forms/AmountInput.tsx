import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { FONT_SIZE } from '../../utils/styles';

type Props = {
  title: string;
  value: string;
  token: string;
  balance: string | null;
  isDisabled: boolean;
  onChange: (value: string) => void;
};

export default function AmountInput({
  title,
  value,
  token,
  balance,
  isDisabled,
  onChange
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          mode="outlined"
          style={styles.inputField}
          outlineStyle={{ borderWidth: 0 }}
          outlineColor="transparent"
          activeOutlineColor="transparent"
          placeholderTextColor="#ccc"
          cursorColor="#ccc"
          placeholder="0"
          onChangeText={onChange}
          disabled={isDisabled}
        />
        <Text style={styles.token}>{token}</Text>
      </View>

      <Text style={styles.balance}>
        {balance} {token}
      </Text>
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
