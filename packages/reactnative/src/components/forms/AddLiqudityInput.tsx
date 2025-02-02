import { Address } from 'abitype';
import { formatEther, parseEther } from 'ethers';
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

export default function AddLiqudityInput({}: Props) {
  const account = useAccount();
  const { data: shwapContract } = useDeployedContractInfo('Shwap');
  const { data: usdtContract } = useDeployedContractInfo('USDT');

  const { balance: ethBalance } = useBalance({
    address: account.address
  });
  const { balance: usdtBalance } = useTokenBalance({
    token: usdtContract?.address,
    userAddress: account.address as Address
  });

  const { balance: ethReserve } = useBalance({
    // @ts-ignore
    address: shwapContract?.address
  });
  const { balance: usdtReserve } = useTokenBalance({
    token: usdtContract?.address,
    userAddress: shwapContract?.address as Address
  });
  const [ethAmount, setEthAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');

  const { write: deposit } = useScaffoldContractWrite({
    contractName: 'Shwap',
    functionName: 'deposit'
  });

  const { write: approve } = useScaffoldContractWrite({
    contractName: 'USDT',
    functionName: 'approve'
  });

  const handleEthAmountChange = (value: string) => {
    if (value.trim() === '') {
      setEthAmount('');
      setUsdtAmount('');
      return;
    }
    const ethAmount = Number(value);

    if (isNaN(ethAmount)) return;

    setEthAmount(value.trim());

    if (!ethReserve || !usdtReserve) return;

    const usdtAmount = parseEther(value) * (usdtReserve / ethReserve);

    setUsdtAmount(formatEther(usdtAmount));
  };

  const approveShwap = async () => {
    try {
      if (usdtAmount === '') return;

      await approve({
        args: [shwapContract?.address, parseEther(usdtAmount) + 1n]
      });
    } catch (error) {
      console.error(error);
    }
  };

  const depositLiquidity = async () => {
    try {
      if (ethAmount === '') return;

      await deposit({ value: parseEther(ethAmount) });

      setEthAmount('');
      setUsdtAmount('');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Liquidity</Text>

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
          <Text style={styles.addButtonLabel}>Deposit</Text>
        </Pressable>
      </View>

      <Text style={styles.balance}>
        {ethBalance !== null ? parseBalance(ethBalance) : null} ETH
      </Text>

      <View style={[styles.inputContainer, { marginTop: 10 }]}>
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

        <Pressable onPress={approveShwap} style={styles.approveButton}>
          <Text style={styles.approveButtonLabel}>Approve</Text>
        </Pressable>
      </View>

      <Text style={styles.balance}>
        {usdtBalance !== null ? parseBalance(usdtBalance) : null} USDT
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
  approveButtonLabel: {
    fontSize: FONT_SIZE['lg'],
    fontWeight: 'bold',
    color: '#555'
  },
  balance: {
    textAlign: 'right',
    fontSize: FONT_SIZE['md']
  }
});
