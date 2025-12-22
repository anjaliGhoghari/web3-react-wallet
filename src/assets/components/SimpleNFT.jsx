import { useState } from "react";
import { ethers } from "ethers";
import nftABI from "../ABI/SimpleNFT.json"
function SimpleNFT() {
    const [account, setAccount] = useState("");
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [name , setName] = useState("");
  const [symbol , setSymbol] = useState("");
  const [balance , setBalance] = useState(0);
  const [mintId , setMintId] = useState("");
  const CONTRACT_ADDRESS = "0x9200F6a12238e3BD13f90F11F1673891B3A397cC";
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, nftABI, signer);
  };

  const connectWallet = async () => {
    await switchToSepolia();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  const fetchTotalNFTs = async () => {
    const contract = await getContract();
    const total = await contract.totalNFTs();
    setTotalNFTs(Number(total));
  };

  const fetchName = async () => {
    const contract = await getContract();
    const nftName = await contract.name();
    setName(nftName);
  }
  const fetchSymbol = async () =>{
    const contract = await getContract();
    const symbol = await contract.symbol();
    setSymbol(symbol);
  }
  const fetchBalance = async () =>{
    const contract = await getContract();
    const balance = await contract.balanceOf(account);
    setBalance(Number(balance));
  }
  const mintNFT = async () => {
    try{
      const contract = await getContract();
      const tx = await contract.mint(account);
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt.logs[0].topics[3]);
      setMintId(Number(receipt.logs[0].topics[3]));
    }catch(error){
      console.error("Error minting NFT:", error);
      if (error.code === 4001) {
        alert("Transaction rejected by user.");
      } else {
        alert("An error occurred while minting the NFT.");
  }
}
  };
  return (
     <div style={{ padding: 20 }}>
      <h1>Web3 + React</h1>

      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      <br/>
      <button onClick={fetchTotalNFTs}>Fetch Total NFTs</button>
      <p>Total NFTs: {totalNFTs}</p>
      <br/>
      <button onClick={fetchName} >Fetch NFT Name</button>
      <p>NFT Name: {name}</p>
      <br/>
      <button onClick={fetchSymbol}>Fetch Symbol</button>
      <p>NFT Symbol: {symbol}</p>
      <br/>
      <button onClick={fetchBalance}>Fetch Balance</button>
      <p>NFT Balance : {balance}</p>
      <br/>
      <button onClick={mintNFT}>Mint NFT</button>
      <p>Minted NFT ID : {mintId}</p>
    </div>
  )
}

export default SimpleNFT