import { ethers } from "ethers";
import React, { useState } from "react";
import erc20abi from "../ABI/ERC20.json";

function ERC20() {
  const CONTRACT_ADDRESS = "0x0B8b8994dFDEB3bA0008977Fba1E0a8Ded196394";
  const [account, setAccount] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [balance, setBalance] = useState(0);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };
  const getContract = async () => {
    // const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await new ethers.BrowserProvider(
      window.ethereum
    ).getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, erc20abi, signer);
  };
  const FetchName = async () => {
    const contract = await getContract();
    const tokenName = await contract.name();
    setName(tokenName);
  };
  const FetchSymbol = async () => {
    const contract = await getContract();
    const tokenSymbol = await contract.symbol();
    setSymbol(tokenSymbol);
  };
  const FetchBalance = async () => {
    const contract = await getContract();
    const tokenBalance = await contract.balanceOf(account);
    setBalance(ethers.formatUnits(tokenBalance, 18));
  };
  const transferToken = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.transfer(
        transferAddress,
        ethers.parseUnits(transferAmount.toString(), 18)
      );
      await tx.wait();
      alert("Transfer Successful");
      const bal = await contract.balanceOf(
        transferAddress
      );
      console.log(ethers.formatUnits(bal, 18));
    } catch (err) {
      console.error(err);
      alert("Transfer Failed");
    }
  };
  return (
    <>
      <div className="pl-4">
        <button
          onClick={connectWallet}
          className="bg-blue-500 mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
        <p>Connected Account: {account ? account : "Not Connect"}</p>
        <br />
        <button
          onClick={FetchName}
          className="bg-blue-500 mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Name
        </button>
        <p>Name: {name ? name : "No Name"}</p>
        <br />
        <button
          onClick={FetchSymbol}
          className="bg-blue-500 mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Symbol
        </button>
        <p>Symbol: {symbol ? symbol : "No Symbol"}</p>
        <br />
        <button
          onClick={FetchBalance}
          className="bg-blue-500 mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Total Balance
        </button>
        <p>Total Balance: {balance ? balance : "Not Connect"}</p>
        <br />
        <br />
        <p className="font-bold mb-5">Transfer Tokens</p>
        <input
          type="text"
          placeholder="Enter Address"
          onChange={(e) => setTransferAddress(e.target.value)}
          className="border-2 mr-2 p-2 rounded"
        />
        <input
          type="number"
          placeholder="Enter Amount"
          onChange={(e) => setTransferAmount(e.target.value)}
          className="border-2 mr-2 p-2 rounded"
        />
        <button
          onClick={transferToken}
          className="bg-blue-500 mb-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Transfer
        </button>
      </div>
    </>
  );
}

export default ERC20;
