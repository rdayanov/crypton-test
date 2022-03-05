import { task } from 'hardhat/config';
import { Donations } from '../typechain';

export default task<{ contributor: string; amount: number }>(
  'donate',
  'Send funds',
  async (taskArgs, hre) => {
    const contributor = await hre.ethers.getSigner(taskArgs.contributor);
    const contract: Donations = await hre.ethers.getContractAt(
      'Donations',
      process.env.LOCAL_CONTRACT || '',
      contributor
    );
    const tx = await contract.Donate({ value: taskArgs.amount });
    return tx.wait();
  }
)
  .addParam('amount', 'Funds amount to donate')
  .addParam('contributor', 'Wallet from which to send funds');
