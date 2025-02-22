import { Address } from 'abitype';
import { JsonRpcProvider, parseEther } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, TextInput } from 'react-native-paper';
import { useToast } from 'react-native-toast-notifications';
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
  const [funAmount, setFunAmount] = useState('');

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
  const { data: funContract } = useDeployedContractInfo('FUN');

  const { balance: ethReserve } = useBalance({
    // @ts-ignore
    address: shwapContract?.address
  });
  const { balance: funReserve } = useTokenBalance({
    token: funContract?.address,
    userAddress: shwapContract?.address as Address
  });

  const { write: withdraw } = useScaffoldContractWrite({
    contractName: 'Shwap',
    functionName: 'withdraw'
  });

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleInputChange = (value: string) => {
    if (value.trim() === '') {
      setWithdrawAmount('');
      setEthAmount('');
      setFunAmount('');
      return;
    }
    const amount = Number(value);

    if (isNaN(amount)) return;

    setWithdrawAmount(value.trim());

    if (!totalLiquidity || !ethReserve || !funReserve) return;

    const ethAmount = (parseEther(value) * ethReserve) / totalLiquidity;
    const funAmount = (parseEther(value) * funReserve) / totalLiquidity;

    setEthAmount(parseBalance(ethAmount));
    setFunAmount(parseBalance(funAmount));
  };

  const withdrawLiquidity = async () => {
    try {
      if (withdrawAmount === '') return;

      setIsLoading(true);

      await withdraw({ args: [parseEther(withdrawAmount)] });

      toast.show('Withdrawal Successful!', { type: 'success' });

      await refetchLiquidity();
      await refetchTotalLiquidity();

      setWithdrawAmount('');
      setEthAmount('');
      setFunAmount('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const provider = new JsonRpcProvider(network.provider);

    (async () => {
      provider.off('block');

      await refetchLiquidity();
      await refetchTotalLiquidity();

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
          {isLoading ? (
            <ActivityIndicator
              color="white"
              style={{ paddingHorizontal: 24 }}
            />
          ) : (
            <Text style={styles.buttonLabel}>Withdraw</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.balance}>
        {liquidity && parseBalance(liquidity)} LPT
      </Text>

      <View style={styles.outputContainer}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: 'grey' }}>ETH</Text>
          <Text
            style={[
              styles.outputAmount,
              { color: ethAmount ? 'black' : '#ccc' }
            ]}
          >
            {ethAmount || 0}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: 'grey' }}>FUN</Text>
          <Text
            style={[
              styles.outputAmount,
              { color: funAmount ? 'black' : '#ccc' }
            ]}
          >
            {funAmount || 0}
          </Text>
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
  },
  outputAmount: {
    fontSize: 30
  }
});
