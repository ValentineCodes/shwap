import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
      <Text style={styles.title}>Liquidity</Text>

      <View style={styles.balancesContainer}>
        <View style={styles.ethBalanceContainer}>
          <Image
            source={require('../../../../../assets/images/eth-icon.png')}
            style={styles.ethLogo}
          />

          <Text style={[styles.balance, { marginLeft: -5 }]}>
            {shwapETHBalance !== null ? parseBalance(shwapETHBalance) : null}
          </Text>
        </View>

        <Text style={styles.balance}>
          🥳 {shwapFUNBalance !== null ? parseBalance(shwapFUNBalance) : null}
        </Text>
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
    alignSelf: 'center',
    marginTop: 10
  },
  title: {
    fontSize: FONT_SIZE['lg'],
    fontWeight: 'bold',
    color: 'grey'
  },
  balancesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  ethBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ethLogo: {
    width: FONT_SIZE['xl'] * 1.7,
    aspectRatio: 1,
    marginLeft: -10
  },
  balance: {
    fontSize: FONT_SIZE['xl']
  }
});
