import React, { useState } from "react";
import { ethers } from "ethers";
import nftABI from "../ABI/NFTGallery.json"; // use ERC721 ABI

function NFTGallery() {
  const CONTRACT_ADDRESS = "0x94750cE55123D165F639849FcD0fE74A1809b150";
  const MARKETPLACE_ADDRESS = "0x8e6b97e6a04f8FcaD240a04F7Fd5c9294cF178cC";
  const [nfts, setNfts] = useState([]);
  const [account, setAccount] = useState("");
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };
  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, nftABI, signer);
  };

  const ipfsToHttp = (url) => url.replace("ipfs://", "https://ipfs.io/ipfs/");

  const fetchMyNFTs = async () => {
    const contract = await getContract();
    const total = await contract.totalSupply();

    let items = [];

    for (let tokenId = 1; tokenId <= Number(total); tokenId++) {
      const owner = await contract.ownerOf(tokenId);

      // 🔥 THIS IS THE FILTER
      if (owner.toLowerCase() === account.toLowerCase()) {
        const tokenURI = await contract.tokenURI(tokenId);
        const res = await fetch(ipfsToHttp(tokenURI));
        const meta = await res.json();

        items.push({
          tokenId,
          name: meta.name,
          description: meta.description,
          image: ipfsToHttp(meta.image),
        });
      }
    }

    setNfts(items);
  };
  const approveMarketplace = async () => {
    const contract = await getContract();
    const tx = await contract.setApprovalForAll(
      MARKETPLACE_ADDRESS,
      true
    );
    await tx.wait();
    alert("Marketplace Approved");
  };

  const mintNFT = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.mint(account);
      await tx.wait();
      alert("NFT Minted Successfully!");
    } catch (error) {
      console.error(error);
      alert("Mint failed");
    }
  };
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">My NFTs</h2>

      <button
        onClick={connectWallet}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {!account ? "Connect Wallet" : "Wallet Connected"}
      </button>

      <button
        onClick={fetchMyNFTs}
        className={`${
          !account ? "hidden" : ""
        } bg-purple-600 text-white px-4 py-2 rounded mb-6 ml-4`}
      >
        Load My NFTs
      </button>
      <button
        onClick={approveMarketplace}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6 ml-4"
      >
        Approve Marketplace
      </button>
      <button
        onClick={mintNFT}
       className={`${
          !account ? "hidden" : ""
        } bg-green-600 text-white px-4 py-2 rounded mb-6 ml-4`}
      >
        Mint NFT
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
        {nfts.map((nft) => (
          <div
            key={nft.tokenId}
            className="border  rounded-xl p-4 shadow hover:scale-105 transition"
          >
            {nft.length == 0 ? (
              <p>No NFTs found</p>
            ) : (
              <>
                <div className="">
                  {" "}
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="rounded mb-3 w-full h-64 object-cover"
                  />
                </div>
                <h3 className="font-bold">{nft.name}</h3>
                <p className="text-sm text-gray-600">{nft.description}</p>
                <p className="text-xs mt-2">Token ID: {nft.tokenId}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {/* <a href="/marketplace" className="hover:text-blue-400 underline pt-6">Go to Marketplace</a> */}
    </div>
  );
}

export default NFTGallery;
