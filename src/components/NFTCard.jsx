import React, { useState } from 'react'
import { ethers } from 'ethers'
import nftABI from "../ABI/SimpleNFT.json"

function NFTCard() {
   const [account, setAccount] = useState("");
  const [name, setName] = useState("-");
  const [symbol, setSymbol] = useState("-");
  const [total, setTotal] = useState(0);
  const [lastMinted, setLastMinted] = useState("-");
  const [success, setSuccess] = useState("");
    const CONTRACT_ADDRESS = "0x9200F6a12238e3BD13f90F11F1673891B3A397cC";
    const switchToSepolia = async () => {
        try {
            await window.ethereum.request({

                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    const getContract = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return new ethers.Contract(CONTRACT_ADDRESS, nftABI, signer);
    }               
    const connectWallet = async () => {
        await switchToSepolia();
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
    };    
     const fetchNFTData = async () => {
    const contract = await getContract();

    const [n, s, t] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalNFTs(),
    ]);

    setName(n);
    setSymbol(s);
    setTotal(Number(t));
  };

  const mintNFT = async () => {
    const contract = await getContract();
    const tx = await contract.mint(account);
    const receipt = await tx.wait();

    const tokenId = parseInt(
      receipt.logs[0].topics[3],
      16
    );

    setLastMinted(tokenId);
    setSuccess("true");
    setTimeout(() => setSuccess(false), 3000);
    fetchNFTData();
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold mb-4">NFT Collection</h2>

      {!account ? (
        <button
          onClick={connectWallet}
          className="w-full rounded-xl bg-indigo-600 py-2 font-medium hover:bg-indigo-500"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="text-sm text-slate-300 space-y-1 mb-4">
            <p><span className="text-slate-400">Name:</span> {name}</p>
            <p><span className="text-slate-400">Symbol:</span> {symbol}</p>
            <p><span className="text-slate-400">Total Minted:</span> {total}</p>
            <p><span className="text-slate-400">Last Minted ID:</span> {lastMinted}</p>
          </div>

          <button
            onClick={fetchNFTData}
            className="mb-3 w-full rounded-xl bg-slate-800 py-2 text-sm hover:bg-slate-700"
          >
            Refresh Data
          </button>

          <button
            onClick={mintNFT}
            className="w-full rounded-xl bg-emerald-600 py-2 font-medium hover:bg-emerald-500"
          >
            Mint NFT
          </button>
           {success && (
            <div className="mb-4 mt-2 rounded-lg bg-emerald-900/40 border border-emerald-500 p-2 text-sm text-emerald-300">
              ✅ Transfer successful!
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NFTCard