import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import AddLiquidityInput from '../../../../../components/forms/AddLiqudityInput';
import WithdrawLiquidityInput from '../../../../../components/forms/WithdrawLiquidityInput';
import useAccount from '../../../../../hooks/scaffold-eth/useAccount';
import useBalance from '../../../../../hooks/scaffold-eth/useBalance';
import useNetwork from '../../../../../hooks/scaffold-eth/useNetwork';
import { COLORS } from '../../../../../utils/constants';
import { parseBalance } from '../../../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../../../utils/styles';

type Props = {};

export default function Liquidity({}: Props) {
  const [depositAmount, setDepositAmount] = useState('');
  const network = useNetwork();
  const account = useAccount();
  const { balance } = useBalance({
    address: account.address
  });
  return (
    <View style={styles.container}>
      <View style={styles.balancesContainer}>
        <Text style={styles.balance}>19.28 ETH</Text>
        <Text style={styles.balance}>2122.59 USDT</Text>
      </View>

      <View style={styles.inputContainer}>
        <AddLiquidityInput value={depositAmount} onChange={setDepositAmount} />

        <WithdrawLiquidityInput
          title="Withdraw Liquidity"
          value={depositAmount}
          buttonLabel="Withdraw"
          balance={
            balance !== null
              ? `${parseBalance(balance)} ${network.currencySymbol}`
              : null
          }
          onSubmit={() => null}
          onChange={setDepositAmount}
        />
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
  },
  inputContainer: {
    width: '100%',
    gap: 10,
    marginTop: 20
  }
});
