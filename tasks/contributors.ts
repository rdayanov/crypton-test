import { task } from 'hardhat/config';
import { Donations } from '../typechain';

export default task('contributors', 'Get contributors list', async (_, hre) => {
  const contract: Donations = await hre.ethers.getContractAt(
    'Donations',
    process.env.LOCAL_CONTRACT || ''
  );

  const contributors = await contract.GetContributorsList();
  console.log(contributors);
});
