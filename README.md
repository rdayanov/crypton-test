# Crypton test

## Project setup

1. install deps
```zsh
yarn install
touch .env
```

2. fill .env file with the following variables
  * `PRIVATE_KEY` - contract owner`s private key
  * `RINKEBY_URL` - project url
  * `CONTRIBUTOR_PRIVATE_KEY` - private key of wallet which will be used as contributor`s wallet in donate operation
  * `CONTRACT_ADDRESS` - left empty for now

3. deploy contract and save address from output to `CONTRACT_ADDRESS` .env variable
```zsh
yarn deploy
```

## Scripts
* `yarn test:coverage` - run tests with coverage
* `yarn deploy` - deploy contract to rinkeby network
* `yarn donate --amount 2 --contributor 0xD09a1B6121642153ef89c85491e5185Dd4dE1f9D` - send funds to contract from specified address
* `yarn contributors` - prints contributors list
* `yarn getDonationsSum` - prints all donations sum
* `yarn getContributorSum 0xD09a1B6121642153ef89c85491e5185Dd4dE1f9D` - prints specific contributor`s contributions sum
* `yarn withdraw --amount 33 --address 0xfabb0ac9d68b0b445fb7357272ff202c5651694a` - withdraw specified amount of funds to target address
