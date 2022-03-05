pragma solidity ^0.8.0;

// todo: replace with import '@openzeppelin/contracts/utils/structs/EnumerableMap.sol' after 4.6.0 released
import './EnumerableMap.sol';

contract Donations {
    using EnumerableMap for EnumerableMap.AddressToUintMap;

    EnumerableMap.AddressToUintMap private contributors;

    address private owner;

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            'Withdraw operation available only for Contract`s owner'
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function Donate() public payable returns (string memory) {
        address contributor = msg.sender;

        if (contributors.contains(contributor)) {
            uint256 contributedSum = contributors.get(contributor);
            contributors.set(contributor, contributedSum + msg.value);
        } else {
            contributors.set(contributor, msg.value);
        }

        return 'Thanks a lot!';
    }

    function Withdraw(address payable target, uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, 'Not enough funds');
        target.transfer(amount);
    }

    function GetContributorSum(address contributor)
        public
        view
        returns (uint256)
    {
        return contributors.get(contributor);
    }

    function GetDonationsSum() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < contributors.length(); i++) {
            (address _contributorAddress, uint256 contribution) = contributors
                .at(i);
            sum += contribution;
        }
        return sum;
    }

    function GetContributorsList() public view returns (address[] memory) {
        address[] memory contributorsList = new address[](
            contributors.length()
        );
        for (uint256 i = 0; i < contributors.length(); i++) {
            (address contributor, uint256 _contributionsSum) = contributors.at(
                i
            );
            contributorsList[i] = contributor;
        }
        return contributorsList;
    }
}
