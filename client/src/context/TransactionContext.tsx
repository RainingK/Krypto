import { ethers } from "ethers";
import { contactAddress, contractABI } from "../utils/constants";
import React, { ChangeEvent, useEffect, useState } from "react";

const { ethereum } = window;

const getEthereumContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contactAddress, contractABI, signer);

    return transactionContract
}

type FormDataType = {
    addressTo: string;
    amount: string;
    keyword: string;
    message: string;
};

export type TransactionContextType = {
    connectWallet: () => Promise<void>,
    currentAccount: string,
    formData: FormDataType,
    setFormData: {},
    handleChange: (e: ChangeEvent<HTMLInputElement>, name: string) => void,
    sendTransaction: () => void,
};
  
export const TransactionContext = React.createContext<TransactionContextType>({
    connectWallet: async () => {
        throw new Error("connectWallet function not yet implemented");
    },
    currentAccount: '',
    formData: {addressTo: '', amount: '', keyword: '', message: ''},
    setFormData: {},
    handleChange: (e, name) => {},
    sendTransaction: () => {},
});

export const TransactionProvider = ({children}: any) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});

    const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const checkIfWalletIsConnect = async () => {
        try {
            if (!ethereum) {
                alert("MetaMask not detected.");
                return;
            }
            
            const accounts = await ethereum.request({method: 'eth_accounts'});
            
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0]);
                console.log(accounts[0]);
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

    const sendTransaction = () => {
        try {
            if (!ethereum) {
                alert("MetaMask not detected.");
                return;
            }

            // Get data from the form
            const { addressTo, amount, keyword, message } = formData;

            const transactionContract = getEthereumContract();
        } catch (error) {
            console.error(error);
            throw new Error("There is no ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnect();
    }, []);

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}