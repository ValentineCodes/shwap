import { Address } from 'abitype';
import { parseEther } from 'ethers';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import { useDeployedContractInfo } from '../../hooks/scaffold-eth/useDeployedContractInfo';
import useScaffoldContractWrite from '../../hooks/scaffold-eth/useScaffoldContractWrite';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { COLORS } from '../../utils/constants';
import { parseBalance } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function ProvideLiquidity({}: Props) {
  const account = useAccount();
  const { data: shwapContract } = useDeployedContractInfo('Shwap');
  const { data: funContract } = useDeployedContractInfo('FUN');

  const { balance: ethBalance } = useBalance({
    address: account.address
  });
  const { balance: funBalance } = useTokenBalance({
    token: funContract?.address,
    userAddress: account.address as Address
  });

  const { balance: ethReserve } = useBalance({
    // @ts-ignore
    address: shwapContract?.address
  });
  const { balance: funReserve } = useTokenBalance({
    token: funContract?.address,
    userAddress: shwapContract?.address as Address
  });
  const [ethAmount, setEthAmount] = useState('');
  const [funAmount, setFunAmount] = useState<bigint | null>();

  const { write: deposit } = useScaffoldContractWrite({
    contractName: 'Shwap',
    functionName: 'deposit'
  });

  const { write: approve } = useScaffoldContractWrite({
    contractName: 'FUN',
    functionName: 'approve'
  });

  const handleEthAmountChange = (value: string) => {
    if (value.trim() === '') {
      setEthAmount('');
      setFunAmount(null);
      return;
    }
    const ethAmount = Number(value);

    if (isNaN(ethAmount)) return;

    setEthAmount(value.trim());

    if (!ethReserve || !funReserve) return;

    const funAmount = (parseEther(value) * funReserve) / ethReserve;

    setFunAmount(funAmount);
  };

  const depositLiquidity = async () => {
    try {
      if (ethAmount === '' || funAmount === null || funAmount === undefined)
        return;

      await approve({
        args: [shwapContract?.address, funAmount + 1n]
      });

      await deposit({ value: parseEther(ethAmount) });

      setEthAmount('');
      setFunAmount(null);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provide Liquidity</Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={ethAmount}
          mode="outlined"
          style={styles.inputField}
          outlineColor="transparent"
          activeOutlineColor="transparent"
          placeholderTextColor="#ccc"
          cursorColor="#ccc"
          placeholder="0"
          onChangeText={handleEthAmountChange}
        />

        <Pressable onPress={depositLiquidity} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>Provide</Text>
        </Pressable>
      </View>

      <Text style={styles.balance}>
        {ethBalance !== null ? parseBalance(ethBalance) : null} ETH
      </Text>

      <View style={[styles.inputContainer, { marginTop: 10 }]}>
        <TextInput
          value={funAmount ? parseBalance(funAmount) : undefined}
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

        <Text style={styles.pairTokenLabel}>FUN</Text>
      </View>

      <Text style={styles.balance}>
        {funBalance !== null ? parseBalance(funBalance) : null} FUN
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
    alignSelf: 'center',
    marginTop: 10
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
  addButton: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.primary
  },
  addButtonLabel: {
    fontSize: FONT_SIZE['lg'],
    fontWeight: 'bold',
    color: 'white'
  },
  approveButton: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  pairTokenLabel: {
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
