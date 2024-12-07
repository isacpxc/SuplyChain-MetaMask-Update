// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./ItemManager.sol";

contract Item{
    uint public pricePaid;
    uint  public priceInWei;
    uint public index;

    ItemManager parentContract;

    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) {
        priceInWei = _priceInWei;
        index = _index;
        parentContract = _parentContract;
    }

    receive() external payable {
        require(pricePaid == 0, "Only Full Payments Accepted!");
        require(priceInWei == msg.value, "");
        (bool success,) = address(parentContract).call{value: msg.value}(abi.encodeWithSignature("TriggerPayment(uint256)", index));
        pricePaid+=msg.value;
        require(success, "The transaction wasn't successful! Cancelling!");
    }

    fallback() external payable { }
}