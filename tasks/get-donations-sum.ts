import { task } from 'hardhat/config';
import { Donations } from '../typechain';

export default task(
  'getDonationsSum',
  'Get all donations sum',
  async (_, hre) => {
    const contract: Donations = await hre.ethers.getContractAt(
      'Donations',
      process.env.CONTRACT_ADDRESS || ''
    );
    const donationsSum = await contract.GetDonationsSum();
    console.log(donationsSum.toNumber());
  }
);
