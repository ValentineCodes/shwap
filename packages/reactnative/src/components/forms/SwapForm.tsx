import { Address } from 'abitype';
import { parseEther } from 'ethers';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import useAccount from '../../hooks/scaffold-eth/useAccount';
import useBalance from '../../hooks/scaffold-eth/useBalance';
import { useDeployedContractInfo } from '../../hooks/scaffold-eth/useDeployedContractInfo';
import useScaffoldContractRead from '../../hooks/scaffold-eth/useScaffoldContractRead';
import useScaffoldContractWrite from '../../hooks/scaffold-eth/useScaffoldContractWrite';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import { COLORS } from '../../utils/constants';
import { parseBalance } from '../../utils/helperFunctions';
import { FONT_SIZE } from '../../utils/styles';
import AmountInput from './AmountInput';

type Props = {};

export default function SwapForm({}: Props) {
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const account = useAccount();
  const { data: shwapContract } = useDeployedContractInfo('Shwap');
  const { data: funContract } = useDeployedContractInfo('FUN');

  // token balances
  const { balance: ethBalance } = useBalance({
    address: account.address
  });
  const { balance: funBalance } = useTokenBalance({
    token: funContract?.address,
    userAddress: account.address as Address
  });

  // reserves
  const { balance: ethReserve } = useBalance({
    // @ts-ignore
    address: shwapContract?.address
  });
  const { balance: funReserve } = useTokenBalance({
    token: funContract?.address,
    userAddress: shwapContract?.address as Address
  });

  const { readContract: getPrice } = useScaffoldContractRead({
    contractName: 'Shwap',
    functionName: 'price'
  });

  const { write: ethToToken } = useScaffoldContractWrite({
    contractName: 'Shwap',
    functionName: 'ethToToken'
  });

  const { write: tokenToEth } = useScaffoldContractWrite({
    contractName: 'Shwap',
    functionName: 'tokenToEth'
  });

  const { write: approve } = useScaffoldContractWrite({
    contractName: 'FUN',
    functionName: 'approve'
  });

  const handleInputChange = async (value: string) => {
    if (value.trim() === '') {
      setSellAmount('');
      setBuyAmount('');
      return;
    }

    const amount = Number(value);

    if (isNaN(amount)) return;

    if (isFlipped) {
      setBuyAmount(value.trim());
    } else {
      setSellAmount(value.trim());
    }

    if (!ethReserve || !funReserve) return;

    try {
      if (isFlipped) {
        const price = await getPrice({
          args: [parseEther(value), funReserve, ethReserve]
        });

        setSellAmount(parseBalance(price));
      } else {
        const price = await getPrice({
          args: [parseEther(value), ethReserve, funReserve]
        });

        setBuyAmount(parseBalance(price));
      }
    } catch (error) {
      console.error('Failed to get price');
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setSellAmount('');
    setBuyAmount('');
  };

  const swap = async () => {
    try {
      if (isFlipped) {
        if (buyAmount === '') return;

        await approve({
          args: [shwapContract?.address, parseEther(buyAmount)]
        });

        await tokenToEth({ args: [parseEther(buyAmount)] });
      } else {
        if (sellAmount === '') return;

        await ethToToken({ value: parseEther(sellAmount) });
      }

      setSellAmount('');
      setBuyAmount('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={
          isFlipped
            ? { flexDirection: 'column-reverse' }
            : { flexDirection: 'column' }
        }
      >
        <AmountInput
          title={isFlipped ? 'Buy' : 'Sell'}
          value={sellAmount}
          token="ETH"
          balance={ethBalance !== null ? parseBalance(ethBalance) : null}
          onChange={handleInputChange}
          isDisabled={isFlipped}
        />

        <IconButton
          icon="arrow-down"
          size={24}
          iconColor="white"
          onPress={handleFlip}
          style={styles.switchButton}
        />

        <AmountInput
          title={isFlipped ? 'Sell' : 'Buy'}
          value={buyAmount}
          token="FUN"
          balance={funBalance !== null ? parseBalance(funBalance) : null}
          onChange={handleInputChange}
          isDisabled={!isFlipped}
        />
      </View>
      <Button
        mode="contained"
        onPress={swap}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Swap
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10
  },
  switchButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    marginTop: -18,
    marginBottom: -18,
    zIndex: 10
  },
  button: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 5,
    backgroundColor: COLORS.primary
  },
  buttonLabel: {
    fontSize: FONT_SIZE['lg'],
    color: 'white'
  }
});
