// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./Ownable.sol";
import "./Item.sol";

contract ItemManager is Ownable{

    enum SupplyChainState{Created, Paid, Delivered}

    struct S_Item{
        Item _item;
        string _id;
        uint _itemPrice;
        ItemManager.SupplyChainState _state;
    }

    mapping(uint=>S_Item) public items;
    uint itemIndex;

    event SupplyChainStep(uint _indexItem, uint _step, address _itemAddress);


    function CreateItem(string memory _id, uint _itemPrice) public onlyOwner{
        Item item = new Item(this, _itemPrice, itemIndex);
        items[itemIndex]._item = item;
        items[itemIndex]._id = _id;
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._state = SupplyChainState.Created;
        emit SupplyChainStep(itemIndex, uint(items[itemIndex]._state), address(item));
        itemIndex++;
    }

    function TriggerPayment(uint _indexItem) public payable {
        require(items[_indexItem]._itemPrice == msg.value, "Only Full Payments Accepted!");
        require(items[_indexItem]._state == SupplyChainState.Created, "Item is Further in The Chain!");


        items[_indexItem]._state = SupplyChainState.Paid;
        emit SupplyChainStep(_indexItem, uint(items[_indexItem]._state), address(items[_indexItem]._item));
    }

    function TriggerDelivery(uint _indexItem) public onlyOwner{
        require(items[_indexItem]._state == SupplyChainState.Paid, "Item is Further in The Chain!");

        emit SupplyChainStep(_indexItem, uint(items[_indexItem]._state), address(items[_indexItem]._item));

        items[_indexItem]._state = SupplyChainState.Delivered;
    }
}