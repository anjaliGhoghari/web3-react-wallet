import { useWallet } from "../hooks/useWallet";

export default function WalletCard() {
  const { account, chainId, isConnected, connectWallet } = useWallet();

  return (
    <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg backdrop-blur">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Wallet
      </h2>

      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full rounded-lg bg-indigo-600 py-2 px-3 font-medium text-white hover:bg-indigo-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <span className="text-slate-400">Account:</span><br />
            <span className="break-all">{account}</span>
          </p>

          <p>
            <span className="text-slate-400">Chain ID:</span> {chainId}
          </p>
        </div>
      )}
    </div>
  );
}
