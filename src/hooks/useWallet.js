import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useWallet(){
    const [account , setAccount] = useState(null);
    const [chainId , setChainId] = useState(null);
    const connectWallet = async () =>{
        if(!window.ethereum){
            alert("Please install MetaMask to use this feature.");
            return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts",[]);
        const network = await provider.getNetwork();
        setAccount(accounts[0]);
        setChainId(Number(network.chainId));
    }
    useEffect(()=>{
        if(!window.ethereum) return;
        window.ethereum.on("accountsChanged",(account)=>{setAccount(account[0] || null)});
        window.ethereum.on("chainChanged",(chainId)=>{setChainId(Number(chainId))});
    },[]);

    return {account , chainId , isConnected : !! account , connectWallet}

}