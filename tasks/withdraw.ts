import { task } from 'hardhat/config';
import { Donations } from '../typechain';

export default task<{ amount: number; address: string }>(
  'withdraw',
  'Withdraw funds to specific address',
  async ({ address, amount }, hre) => {
    const contract: Donations = await hre.ethers.getContractAt(
      'Donations',
      process.env.LOCAL_CONTRACT || ''
    );

    await contract.Withdraw(address, amount);

    console.log(`${amount} Wei(s) sent to ${address}`);
  }
)
  .addParam('amount', 'Funds amount to withdraw')
  .addParam('address', 'Target address to send funds');
