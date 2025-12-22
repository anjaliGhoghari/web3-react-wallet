import ERC20 from "./assets/components/ERC20";
import SimpleNFT from "./assets/components/SimpleNFT";
import WalletCard from "./components/WalletCard";


function App() {
 
  
  return (
   
    <>
    {/* <p className="text-xl p-4  uppercase font-bold font-serif">Simple NFT</p>
    <SimpleNFT/>
    <p className="text-xl p-4  uppercase font-bold font-serif">ERC20</p>
    <ERC20/> */}
     <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <WalletCard/>
    </div>
    </>
  );
}

export default App;
