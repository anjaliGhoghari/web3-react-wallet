import React, { useState } from "react";
import { ethers } from "ethers";
import marketABI from "../ABI/Marketplace.json";
import nftABI from "../ABI/NFTGallery.json";

function NFTMarketplace() {
  const MARKETPLACE_ADDRESS = "0x8e6b97e6a04f8FcaD240a04F7Fd5c9294cF178cC";
  const NFT_ADDRESS = "0x73dcBaF8af486d4510C92170E4736334c7045fb8";

  const [items, setItems] = useState([]);

  const getProviderSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const getMarketplace = async () => {
    const { signer } = await getProviderSigner();
    return new ethers.Contract(MARKETPLACE_ADDRESS, marketABI, signer);
  };

  const getNFTContract = async () => {
    const { signer } = await getProviderSigner();
    return new ethers.Contract(NFT_ADDRESS, nftABI, signer);
  };

  const fetchListings = async () => {
    const marketplace = await getMarketplace();
    const nft = await getNFTContract();

    const total = await nft.totalSupply();
    let tempItems = [];

    for (let tokenId = 1; tokenId <= Number(total); tokenId++) {
      const listing = await marketplace.listings(tokenId);


      if (listing.active) {
        tempItems.push({
          tokenId,
          price: ethers.formatEther(listing.price),
          seller: listing.seller,
        });
      }
    }

    setItems(tempItems);
  };

  const buyNFT = async (tokenId, price) => {
    try {
      const marketplace = await getMarketplace();

      const tx = await marketplace.buyNFT(tokenId, {
        value: ethers.parseEther(price),
      });

      await tx.wait();
      alert("NFT Purchased Successfully");
      fetchListings(); // refresh UI
    } catch (err) {
      console.error(err);
      alert("Purchase failed");
    }
  };

  return (
    <div className="mt-14 px-6">
      <h2 className="text-2xl font-bold mb-6">NFT Marketplace</h2>

      <button
        onClick={fetchListings}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-6"
      >
        Load Listings
      </button>

      {items.length === 0 && (
        <p className="text-gray-500">No active listings</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.tokenId}
            className="border rounded-xl p-4 shadow"
          >
            <p className="font-semibold">Token ID: {item.tokenId}</p>
            <p className="text-gray-600">Price: {item.price} ETH</p>

            <button
              onClick={() => buyNFT(item.tokenId, item.price)}
              className="bg-purple-600 text-white px-4 py-2 rounded mt-3 w-full"
            >
              Buy NFT
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NFTMarketplace;
