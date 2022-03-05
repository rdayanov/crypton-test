import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import type { Donations } from '../typechain';

type SignerWithAddress = {
  signer: Signer;
  address: string;
};

describe('Donations', () => {
  let donate: Donations;
  let contractOwner: SignerWithAddress,
    firstContributor: SignerWithAddress,
    anotherContributor: SignerWithAddress;

  before(async () => {
    const [owner, firstSigner, anotherSigner] = await ethers.getSigners();
    firstContributor = { signer: firstSigner, address: firstSigner.address };
    anotherContributor = {
      signer: anotherSigner,
      address: anotherSigner.address,
    };
    contractOwner = {
      signer: owner,
      address: owner.address,
    };
  });

  beforeEach(async () => {
    const Donations = await ethers.getContractFactory('Donations');
    donate = await Donations.deploy();
    await donate.deployed();
  });

  describe('Donate', () => {
    describe('firstContributor donates 123 native coins', () => {
      const firstDonationSum = 123;

      beforeEach(async () => {
        const firstContributionTx = await donate
          .connect(firstContributor.signer)
          .Donate({ value: firstDonationSum });
        await firstContributionTx.wait();
      });

      it('contributions sum from firstContributor should be 123', async () => {
        expect(
          await donate.GetContributorSum(firstContributor.address)
        ).to.equal(firstDonationSum);
      });

      it('all donations sum should be 123', async () => {
        expect(await donate.GetDonationsSum()).to.equal(firstDonationSum);
      });

      it('contributor`s address should be added to contributors list', async () => {
        expect(await donate.GetContributorsList()).to.contain(
          firstContributor.address
        );
      });

      describe('firstContributor donates 44 native coins', () => {
        const secondDonationSum = 44;
        const donationsSum = firstDonationSum + secondDonationSum;
        beforeEach(async () => {
          const secondContributionTx = await donate
            .connect(firstContributor.signer)
            .Donate({ value: secondDonationSum });
          await secondContributionTx.wait();
        });

        it('contributions sum should be 167', async () => {
          expect(
            await donate.GetContributorSum(firstContributor.address)
          ).to.equal(donationsSum);
        });

        it('all donations sum should be 167', async () => {
          expect(await donate.GetDonationsSum()).to.equal(donationsSum);
        });

        it('contributor`s address should be added to contributors list only once', async () => {
          expect(await donate.GetContributorsList()).to.deep.equal([
            firstContributor.address,
          ]);
        });
      });

      describe('anotherContributor donates 12 native coins', () => {
        const anotherDonationSum = 12;
        const donationsSum = firstDonationSum + anotherDonationSum;

        beforeEach(async () => {
          const anotherContributionTx = await donate
            .connect(anotherContributor.signer)
            .Donate({ value: anotherDonationSum });
          await anotherContributionTx.wait();
        });

        it('contributions sum from anotherContributor should be 12', async () => {
          expect(
            await donate.GetContributorSum(anotherContributor.address)
          ).to.equal(anotherDonationSum);
        });

        it('all donations sum should be 135', async () => {
          expect(await donate.GetDonationsSum()).to.equal(donationsSum);
        });

        it('both contributors should be listed', async () => {
          expect(await donate.GetContributorsList()).to.deep.equal([
            firstContributor.address,
            anotherContributor.address,
          ]);
        });
      });
    });
  });

  describe('Withdraw', () => {
    const balance = 10;

    beforeEach(async () => {
      const contributionTx = await donate
        .connect(firstContributor.signer)
        .Donate({ value: balance });
      await contributionTx.wait();
    });

    describe('contractOwner trying to withdraw funds', () => {
      it('transaction should fail because of amount exceed', async () => {
        await expect(
          donate
            .connect(contractOwner.signer)
            .Withdraw(contractOwner.address, 15)
        ).to.revertedWith('Not enough funds');
      });

      it('5 native coins should be sent to anotherContributor', async () => {
        await expect(
          async () =>
            await donate
              .connect(contractOwner.signer)
              .Withdraw(anotherContributor.address, 5)
        ).to.changeEtherBalance(anotherContributor.signer, 5);
      });
    });

    describe('anotherContributor trying to withdraw funds', () => {
      it('transaction should fail because of insufficient permissions', async () => {
        await expect(
          donate
            .connect(anotherContributor.signer)
            .Withdraw(anotherContributor.address, 5)
        ).revertedWith(
          'Withdraw operation available only for Contract`s owner'
        );
      });
    });
  });
});
