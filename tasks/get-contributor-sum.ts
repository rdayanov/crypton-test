import { task } from 'hardhat/config';
import { Donations } from '../typechain';

export default task<{ contributor: string }>(
  'getContributorSum',
  'Get sum sent by specific contributor',
  async ({ contributor }, hre) => {
    const contract: Donations = await hre.ethers.getContractAt(
      'Donations',
      process.env.CONTRACT_ADDRESS || ''
    );
    const contributorSum = await contract.GetContributorSum(contributor);
    console.log(contributorSum.toNumber());
  }
).addPositionalParam('contributor', 'Wallet from which funds sent');
