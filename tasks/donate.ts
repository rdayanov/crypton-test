import { task } from 'hardhat/config';
import { Donations } from '../typechain';

export default task<{ contributor: string; amount: number }>(
  'donate',
  'Send funds',
  async ({ contributor, amount }, hre) => {
    const signer = await hre.ethers.getSigner(contributor);
    const contract: Donations = await hre.ethers.getContractAt(
      'Donations',
      process.env.CONTRACT_ADDRESS || '',
      signer
    );
    const tx = await contract.Donate({ value: amount });
    await tx.wait();
    console.log(`${amount} Wei(s) received from ${contributor}`);
  }
)
  .addParam('amount', 'Funds amount to donate')
  .addParam('contributor', 'Wallet from which to send funds');
