import { Address } from 'abitype';
import { JsonRpcProvider, parseEther } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import { useDeployedContractInfo } from '../../hooks/scaffold-eth/useDeployedContractInfo';
import useNetwork from '../../hooks/scaffold-eth/useNetwork';
import useScaffoldContractRead from '../../hooks/scaffold-eth/useScaffoldContractRead';
import useScaffoldContractWrite from '../../hooks/scaffold-eth/useScaffoldContractWrite';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { COLORS } from '../../utils/constants';
import { parseBalance } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';

type Props = {};

export default function WithdrawLiquidity({}: Props) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');

  const network = useNetwork();
  const account = useAccount();
  const { data: liquidity, refetch: refetchLiquidity } =
    useScaffoldContractRead({
      contractName: 'Shwap',
      functionName: 'liquidity',
      args: [account.address]
    });
  const { data: totalLiquidity, refetch: refetchTotalLiquidity } =
    useScaffoldContractRead({
      contractName: 'Shwap',
      functionName: 'totalLiquidity'
    });
  const { data: shwapContract } = useDeployedContractInfo('Shwap');
  const { data: usdtContract } = useDeployedContractInfo('USDT');

  const { balance: ethReserve } = useBalance({
    // @ts-ignore
    address: shwapContract?.address
  });
  const { balance: usdtReserve } = useTokenBalance({
    token: usdtContract?.address,
    userAddress: shwapContract?.address as Address
  });

  const { write: withdraw } = useScaffoldContractWrite({
    contractName: 'Shwap',
    functionName: 'withdraw'
  });

  const handleInputChange = (value: string) => {
    if (value.trim() === '') {
      setWithdrawAmount('');
      setEthAmount('');
      setUsdtAmount('');
      return;
    }
    const amount = Number(value);

    if (isNaN(amount)) return;

    setWithdrawAmount(value.trim());

    if (!totalLiquidity || !ethReserve || !usdtReserve) return;

    const ethAmount = (parseEther(value) * ethReserve) / totalLiquidity;
    const usdtAmount = (parseEther(value) * usdtReserve) / totalLiquidity;

    setEthAmount(parseBalance(ethAmount));
    setUsdtAmount(parseBalance(usdtAmount));
  };

  const withdrawLiquidity = async () => {
    try {
      if (withdrawAmount === '') return;

      await withdraw({ args: [parseEther(withdrawAmount)] });

      setWithdrawAmount('');
      setEthAmount('');
      setUsdtAmount('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const provider = new JsonRpcProvider(network.provider);

    (async () => {
      provider.off('block');

      provider.on('block', async blockNumber => {
        await refetchLiquidity();
        await refetchTotalLiquidity();
      });
    })();

    return () => {
      provider.off('block');
    };
  }, [network]);
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

        <Pressable onPress={withdrawLiquidity} style={styles.button}>
          <Text style={styles.buttonLabel}>Withdraw</Text>
        </Pressable>
      </View>

      <Text style={styles.balance}>
        {liquidity && parseBalance(liquidity)} LPT
      </Text>

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
