import {  useState } from "react";
import { ethers } from "ethers";
import erc20ABI from "../ABI/ERC20.json";

const CONTRACT_ADDRESS = "0x0B8b8994dFDEB3bA0008977Fba1E0a8Ded196394";

export default function ERC20Card() {
  const [account, setAccount] = useState("");
  const [name, setName] = useState("-");
  const [symbol, setSymbol] = useState("-");
  const [balance, setBalance] = useState("0");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, erc20ABI, signer);
  };

  const connectWallet = async () => {
    const [acc] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(acc);
  };

  const fetchTokenData = async () => {
    const contract = await getContract();

    const [n, s, b] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.balanceOf(account),
    ]);

    setName(n);
    setSymbol(s);
    setBalance(ethers.formatUnits(b, 18));
  };

  const transferToken = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.transfer(to, ethers.parseUnits(amount, 18));
      await tx.wait();
      fetchTokenData();
      setTo("");
      setAmount("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Transaction failed. Please check the console for details.");
      console.error(err);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold mb-4">ERC20 Token</h2>

      {!account ? (
        <button
          onClick={connectWallet}
          className="w-full rounded-xl bg-indigo-600 py-2 font-medium hover:bg-indigo-500"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="space-y-1 text-sm text-slate-300 mb-4">
            <p>
              <span className="text-slate-400">Name:</span> {name}
            </p>
            <p>
              <span className="text-slate-400">Symbol:</span> {symbol}
            </p>
            <p>
              <span className="text-slate-400">Balance:</span> {balance}
            </p>
          </div>

          <button
            onClick={fetchTokenData}
            className="mb-4 w-full rounded-xl bg-slate-800 py-2 text-sm hover:bg-slate-700"
          >
            Refresh Data
          </button>
         
          <div className="space-y-3">
            <input
              placeholder="Recipient address"
              value={to}
              className="w-full rounded-lg bg-black/40 p-2 text-sm outline-none"
              onChange={(e) => setTo(e.target.value)}
            />

            <input
              placeholder="Amount"
              type="number"
              value={amount}
              className="w-full rounded-lg bg-black/40 p-2 text-sm outline-none"
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              onClick={transferToken}
              className="w-full rounded-xl bg-emerald-600 py-2 font-medium hover:bg-emerald-500"
            >
              Send Tokens
            </button>
             {success && (
            <div className="mb-4 rounded-lg bg-emerald-900/40 border border-emerald-500 p-2 text-sm text-emerald-300">
              ✅ Transfer successful!
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}
