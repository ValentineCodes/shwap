import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Shwap, FUN } from '../typechain-types';
import { Signer } from 'ethers';

describe('Shwap Contract E2E Tests', function () {
  let fun: FUN;
  let shwap: Shwap;
  let owner: Signer;
  let user: Signer;

  beforeEach(async function () {
    // Get signers
    [owner, user] = await ethers.getSigners();

    // Deploy FUN contract
    const FUN = await ethers.getContractFactory('FUN');
    fun = await FUN.deploy();
    await fun.waitForDeployment();

    // Deploy Shwap contract with FUN address
    const Shwap = await ethers.getContractFactory('Shwap');
    shwap = await Shwap.deploy(await fun.getAddress());
    await shwap.waitForDeployment();

    // Mint FUN to user for testing
    await fun
      .connect(owner)
      .transfer(await user.getAddress(), ethers.parseEther('100'));
  });

  it('Should initialize liquidity', async function () {
    const initialFUN = ethers.parseEther('100');
    const initialETH = ethers.parseEther('1');

    // Approve Shwap contract to spend FUN
    await fun.connect(owner).approve(await shwap.getAddress(), initialFUN);

    // Initialize Shwap liquidity pool
    await shwap.connect(owner).init(initialFUN, { value: initialETH });

    // Verify total liquidity
    const totalLiquidity = await shwap.totalLiquidity();

    expect(totalLiquidity).to.equal(initialETH);

    // Verify liquidity for owner
    const ownerLiquidity = await shwap.getLiquidity(await owner.getAddress());
    expect(ownerLiquidity).to.equal(initialETH);
  });

  it('Should swap ETH for tokens', async function () {
    const initialFUN = ethers.parseEther('100');
    const initialETH = ethers.parseEther('1');
    const swapETH = ethers.parseEther('0.1');

    // Approve and initialize pool
    await fun.connect(owner).approve(await shwap.getAddress(), initialFUN);
    await shwap.connect(owner).init(initialFUN, { value: initialETH });

    // Perform ETH to token swap
    await expect(shwap.connect(user).ethToToken({ value: swapETH })).to.emit(
      shwap,
      'EthToTokenSwap'
    );

    // Check user's FUN balance increased
    const userFUNBalance = await fun.balanceOf(await user.getAddress());
    expect(userFUNBalance).to.be.gt(ethers.parseEther('100'));
  });

  it('Should swap tokens for ETH', async function () {
    const initialFUN = ethers.parseEther('100');
    const initialETH = ethers.parseEther('1');
    const swapTokens = ethers.parseEther('50');

    // Approve and initialize pool
    await fun.connect(owner).approve(await shwap.getAddress(), initialFUN);
    await shwap.connect(owner).init(initialFUN, { value: initialETH });

    // Approve Shwap contract to spend user's tokens
    await fun.connect(user).approve(await shwap.getAddress(), swapTokens);

    // Perform token to ETH swap
    await expect(shwap.connect(user).tokenToEth(swapTokens)).to.emit(
      shwap,
      'TokenToEthSwap'
    );

    // Check user's ETH balance increased
    const userETHBalance = await ethers.provider.getBalance(
      await user.getAddress()
    );
    expect(userETHBalance).to.be.gt(ethers.parseEther('10000')); // Adjust for gas fees
  });

  it('Should deposit liquidity', async function () {
    const initialFUN = ethers.parseEther('100');
    const initialETH = ethers.parseEther('1');
    const depositETH = ethers.parseEther('0.5');

    // Approve and initialize pool
    await fun.connect(owner).approve(await shwap.getAddress(), initialFUN);
    await shwap.connect(owner).init(initialFUN, { value: initialETH });

    // Approve user tokens
    await fun
      .connect(user)
      .approve(await shwap.getAddress(), ethers.parseEther('100'));

    // Deposit liquidity
    await expect(shwap.connect(user).deposit({ value: depositETH })).to.emit(
      shwap,
      'LiquidityProvided'
    );

    // Verify liquidity for user
    const userLiquidity = await shwap.getLiquidity(await user.getAddress());
    expect(userLiquidity).to.be.gt(0);
  });

  it('Should withdraw liquidity', async function () {
    const initialFUN = ethers.parseEther('100');
    const initialETH = ethers.parseEther('1');
    const withdrawAmount = ethers.parseEther('0.5');

    // Approve and initialize pool
    await fun.connect(owner).approve(await shwap.getAddress(), initialFUN);
    await shwap.connect(owner).init(initialFUN, { value: initialETH });

    // Withdraw liquidity
    await expect(shwap.connect(owner).withdraw(withdrawAmount)).to.emit(
      shwap,
      'LiquidityRemoved'
    );

    // Verify owner's liquidity reduced
    const ownerLiquidity = await shwap.getLiquidity(await owner.getAddress());
    expect(ownerLiquidity).to.be.lt(initialETH);
  });
});
