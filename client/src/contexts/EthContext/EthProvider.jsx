import React, { useReducer, useEffect, useState } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [account, setAccount] = useState("Not Found");
  const [idNet, setIdNet] = useState("Not Found");
  const [accountContract, setAccountContract] = useState("Not Found");

  const init = async (artifact) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      const networkID = await web3.eth.net.getId();
      setIdNet(networkID);

      try {
        const address = artifact.networks[networkID].address;
        const contract = new web3.eth.Contract(artifact.abi, address);
        setAccountContract(address)
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const artifact = require("../../contracts/ItemManager.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    const handleChange = () => {
      init(state.artifact);
    };

    window.ethereum.on("chainChanged", handleChange);
    window.ethereum.on("accountsChanged", handleChange);
    return () => {
      window.ethereum.removeListener("chainChanged", handleChange);
      window.ethereum.removeListener("accountsChanged", handleChange);
    };
  }, [state.artifact]);

  return (
    <EthContext.Provider value={{ state, dispatch }}>
      <h1>Conta conectada: {account}</h1>
      <h1>Network Id: {idNet}</h1>
      <h1>endereço do contrato: {accountContract}</h1>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
