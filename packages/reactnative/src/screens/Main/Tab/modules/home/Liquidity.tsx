import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import useBalance from '../../../../../hooks/scaffold-eth/useBalance';
import { useDeployedContractInfo } from '../../../../../hooks/scaffold-eth/useDeployedContractInfo';
import { useTokenBalance } from '../../../../../hooks/useTokenBalance';
import { parseBalance } from '../../../../../utils/helperFunctions';
import { FONT_SIZE } from '../../../../../utils/styles';

type Props = {};

export default function Liquidity({}: Props) {
  const { data: shwapContract } = useDeployedContractInfo('Shwap');
  const { data: funContract } = useDeployedContractInfo('FUN');

  const { balance: shwapETHBalance } = useBalance({
    // @ts-ignore
    address: shwapContract?.address
  });
  const { balance: shwapFUNBalance } = useTokenBalance({
    token: funContract?.address,
    userAddress: shwapContract?.address
  });
  return (
    <View style={styles.container}>
      <View style={styles.balancesContainer}>
        <Text style={styles.balance}>
          {shwapETHBalance !== null ? parseBalance(shwapETHBalance) : null} ETH
        </Text>
        <Text style={styles.balance}>
          {shwapFUNBalance !== null ? parseBalance(shwapFUNBalance) : null} FUN
        </Text>
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
