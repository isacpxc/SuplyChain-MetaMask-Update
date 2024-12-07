# What is this repository?
This repository updates the connection code with metamask and updates the front end used to handle smart contracts in the Supply Chain project of the *Ethereum Blockchain Developer Bootcamp With Solidity (2024)* course in section 14, using the latest possible versions of the functionalities used.

## Before
Use Node.js v14 - v18
And don't forget to use `npm init` in \client

## Working

```sh
# Install Truffle and ganache globally
$ npm install -g truffle ganache
```
Open a terminal and run Ganache, a simulated Ethereum blockchain on your machine. Run the following command.
```
$ ganache
```
From the list of generated private keys, import the first one to MetaMask.

❗❗❗**Important**❗❗❗    
*Make sure metamask is connected to the same network (127.0.0.1 in this case) and port(8545 in this case) as the ganache RPC server.*

❗❗❗Now don't forget to execute `truffle migrate --network development` inside the folder `\truffle` in the project as follows:
```
$ cd truffle
$ truffle migrate --network development
# The `development` network points to Ganache, it's configured in truffle/truffle-config.js on line 45.(currently in 127.0.0.1:8545)
```



Start the react dev server.

```sh
$ cd client
$ npm start
```

# How to use
Use the buttons and inputs to interact with the smart contract, as seen in the course. After each interaction, open the console and see the event emissions from the contract's features. Feel free to modify the front-end as you wish and add more features. 

If the connection went as expected, you should see the network address as well as the address of the currently connected wallet. After deploying the contract with `$ truffle migrate` you should also see the contract address, as well as the rest of the front end.

### Note

* Note that the structure used is the same after doing `$ truffle unbox react` with the necessary changes to handle our new contracts. Use this repository also to study how the connections used work.

* If you want the front end to handle others contracts, just add a new component for that in `client\src\components\Demo\index.jsx` in `const demo`, following the class rules used in `client\src\components\Demo\Contract.jsx`. And make sure you have made the appropriate changes to `client\src\contexts\EthContext\EthProvider.jsx` to the correct `.json` generated after migrate.

* You can do this without ganache using just:
```
truffle development
```
but i didn't :)

## requirements
```
> truffle -v
Truffle v5.11.5 (core: 5.11.5)
Ganache v7.9.1
Solidity v0.5.16 (solc-js)
Node v18.20.5
Web3.js v1.10.0
Compiler version in truffle-config.js: version: 0.8.16
```

