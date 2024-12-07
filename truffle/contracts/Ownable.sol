// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract Ownable {
    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }

    modifier onlyOwner{
        require(isOwner(), "You are not the owner to do this!");
        _;
    }

    function isOwner() public view returns(bool){
        return (owner == msg.sender);
    }
}