// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SelfDestructContract {
    address public owner;
    uint8 public _countdown = 15;

    modifier onlyOwner() {
        require(msg.sender == owner, "You're NOT the owner!");
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    fallback() external payable {}

    function destruct() external onlyOwner {
        _countdown--;
        if (_countdown == 0) {
            // SELFDESTRUCT opcode has been deprecated!
            selfdestruct(payable(owner));
        }
    }
}
