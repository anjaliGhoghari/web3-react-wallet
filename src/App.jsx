import { N } from "ethers";
import ERC20Card from "./components/ERC20Card";
import NFTCard from "./components/NFTCard";
import NFTGallery from "./components/NFTGallery";
import WalletCard from "./components/WalletCard";
import NFTMarketPlace from "./components/NFTMarketPlace";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">Web3 Dashboard</h1>

          <span className="text-sm text-slate-400">React + Ethers.js</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WalletCard />
          <ERC20Card />
          <NFTCard/>
         
        </div>
      </main>
      <div className="mx-auto max-w-7xl px-6 py-10"><NFTGallery/>
      {/* <NFTMarketPlace/> */}
      
      </div>
      
      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm text-slate-500">
          Built by Anjali ✨
        </div>
      </footer>
    </div>
  );
}
