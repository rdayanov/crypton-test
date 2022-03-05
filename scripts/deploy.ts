import { ethers } from 'hardhat';

async function main() {
  const Donations = await ethers.getContractFactory('Donations');
  const donation = await Donations.deploy();

  await donation.deployed();

  console.log('Donations deployed to:', donation.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
