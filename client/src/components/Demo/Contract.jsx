import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Web3 from "web3";

function Contract({ value }) {
    //////////////////
    const [id, setId] = useState('exemplo1'); 
    const [priceItem, setPriceItem] = useState(0);
    const [itemIndex, setItemIndex] = useState(0);
    const { state: { contract, accounts } } = useEth();
    const [valueCost, setValueCost] = useState(0);

    const secureNumberIndex = () => {
      if (id === "" || priceItem <= 0) {
        alert("preencha os dados corretamente!");
        return 0;
      } 
      return 1;
    } 
  
    const handleCreateItem = async (e) => {
      if (!secureNumberIndex || priceItem <= 0) return 0;

      try{
        const res = await contract.methods.CreateItem(id,priceItem).send({from: accounts[0]});
        alert('Abra o console para ver as informações do contrato');
        console.log(res.events.SupplyChainStep.returnValues);
      } catch(err){
        console.log("erro na criação do item: ",err);
      }
    };
  
    const handleTriggerDelivery = async (e) => {
      if (!secureNumberIndex) return 0;
      try {
        const res = await contract.methods.TriggerDelivery(itemIndex).send({from: accounts[0]});
        console.log(res.events);
      } catch(err){
        console.log("erro no pagamento do item: ",err);
      }
    };
  
    const handleTriggerPayment = async (e) => {
      if (!secureNumberIndex) return 0;
      try {
        const res = await contract.methods.TriggerPayment(itemIndex).send({from: accounts[0], value: Web3.utils.toWei(valueCost, 'wei')});
        console.log(res.events.SupplyChainStep.returnValues);
      } catch(err){
        console.log("erro no pagamento do item: ",err);
      }
    };

  // const spanEle = useRef(null);

  return (

    <div>
          <div className="contract-container">
      <div className="contract-content">
        <pre>
          {`
          // SPDX-License-Identifier: MIT
          pragma solidity 0.8.16;

          import "./Ownable.sol";
          import "./Item.sol";

          contract ItemManager is Ownable {
            enum SupplyChainState{Created, Paid, Delivered}

            struct S_Item {
              Item _item;
              string _id;
              uint _itemPrice;
              ItemManager.SupplyChainState _state;
            }

            mapping(uint => S_Item) public items;
            uint itemIndex;

            event SupplyChainStep(uint _indexItem, uint _step, address _itemAddress);

            function CreateItem(string memory _id, uint _itemPrice) public onlyOwner {
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
              emit SupplyChainStep(_indexItem, uint(items[_indexItem]._state), address(items[_indexItem]._item));
              items[_indexItem]._state = SupplyChainState.Paid;
            }

            function TriggerDelivery(uint _indexItem) public onlyOwner {
              require(items[_indexItem]._state == SupplyChainState.Created, "Item is Further in The Chain!");
              emit SupplyChainStep(_indexItem, uint(items[_indexItem]._state), address(items[_indexItem]._item));
              items[_indexItem]._state = SupplyChainState.Delivered;
            }
          }
          `}
        </pre>
      </div>
      <div className="right">
        <div>
          <h2>Create Item</h2>
          Id
          <input
            type="text"
            placeholder="Item ID"
            value={id}
            onChange={e => setId(e.target.value)}
          />
          Item Price
          <input
            type="number"
            placeholder="Item Price"
            value={priceItem}
            onChange={e => setPriceItem(e.target.value)}
          />
          <button onClick={handleCreateItem}>Create Item</button>
        </div>
        <div>
          <h2>Trigger Payment</h2>
          Item Index
          <input
            type="number"
            placeholder="Item Index"
            value={itemIndex}
            onChange={e => setItemIndex(e.target.value)}
          />
          Value <input
            type="number"
            placeholder="Value"
            value={valueCost}
            onChange={e => setValueCost(e.target.value)}
          />
          <button onClick={handleTriggerPayment}>Trigger Payment</button>
        </div>
        <div>
          <h2>Trigger Delivery</h2>
          item Index
          <input
            type="number"
            placeholder="Item Index"
            value={itemIndex}
            onChange={e => setItemIndex(e.target.value)}
          />
          <button onClick={handleTriggerDelivery}>Trigger Delivery</button>
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default Contract;
