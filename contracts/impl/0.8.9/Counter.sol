// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity =0.8.9;

contract Counter {
  uint256 public count;
  address private owner;
  address private ADMIN_ADDRESS;

  modifier onlyAdminContract() {
    require(msg.sender == ADMIN_ADDRESS, "Permission Denied");
    _;
  }

  // Events
  event CounterIncreased(
      address indexed account,
      uint256 count
  );

  constructor(address adminAddress) {
    require(address(adminAddress) != address(0), "invalid address");
    ADMIN_ADDRESS = adminAddress;
  }

  function inc() public onlyAdminContract {
    count += 1;
    emit CounterIncreased(msg.sender, count);
  }

  function get() public view returns (uint256) {
    return count;
  }
}
