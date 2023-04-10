import { ethers } from "ethers";
import { contactAddress, contractABI } from "../utils/constants";
import React, { useEffect, useState } from "react";

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contactAddress, contractABI);

    console.log(provider, signer, transactionContract);
}

export type TransactionContextType = {
    connectWallet: () => Promise<void>,
    currentAccount: string,
};
  
export const TransactionContext = React.createContext<TransactionContextType>({
    connectWallet: async () => {
        throw new Error("connectWallet function not yet implemented");
    },
    currentAccount: '',
});

export const TransactionProvider = ({children}: any) => {
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnect = async () => {
        try {
            if (!ethereum) {
                alert("MetaMask not detected.");
                return;
            }
            
            const accounts = await ethereum.request({method: 'eth_accounts'});
            
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log('No Accounts Found');
            }
        } catch (error) {
            console.error(error);
            throw new Error("No Ethereum Object");
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) {
                alert("MetaMask not detected.");
                return;
            }
    
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
            throw new Error("No Ethereum Object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnect();
    }, []);

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount}}>
            {children}
        </TransactionContext.Provider>
    )
}