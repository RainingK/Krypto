import { ethers } from "ethers";
import { contactAddress, contractABI } from "../utils/constants";
import React, { ChangeEvent, useEffect, useState } from "react";

const { ethereum } = window;

const getEthereumContract = () => {
	const provider = new ethers.providers.Web3Provider( ethereum );
	const signer = provider.getSigner();
	const transactionContract = new ethers.Contract( contactAddress, contractABI, signer );

	console.log( transactionContract )

	return transactionContract;
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
	handleChange: ( e: ChangeEvent<HTMLInputElement>, name: string ) => void,
	sendTransaction: () => void,
	transactions: any[],
	isLoading: boolean,
};

export const TransactionContext = React.createContext<TransactionContextType>({
	connectWallet: async () => {
		throw new Error( "connectWallet function not yet implemented" );
	},
	currentAccount: '',
	formData: { addressTo: '', amount: '', keyword: '', message: '' },
	setFormData: {},
	handleChange: ( e, name ) => { },
	sendTransaction: () => { },
	transactions: [],
	isLoading: false,
});

export const TransactionProvider = ({children}: any) => {
	const [ currentAccount, setCurrentAccount ] = useState( '' );
	const [ formData, setFormData ] = useState( { addressTo: '', amount: '', keyword: '', message: '' } );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ transactionCount, setTransactionCount ] = useState( localStorage.getItem( 'transactionCount' ) );
	const [ transactions, setTransactions ] = useState( [] );

	const handleChange = ( e: ChangeEvent<HTMLInputElement>, name: string ) => {
		setFormData( ( prevState ) => ( { ...prevState, [ name ]: e.target.value } ) );
	}

	const getAllTransactions = async () => {
		try {
			if ( !ethereum ) {
				return alert( "Please install MetaMask" );
			}

			const transactionContract = getEthereumContract();
			const availableTransactions = await transactionContract.getAllTransactions();

			const structuredTransactions = availableTransactions.map( ( transaction: any ) => ( {
				addressTo: transaction.receiver,
				addressFrom: transaction.sender,
				timestamp: new Date( transaction.timestamp.toNumber() * 1000 ).toLocaleString(),
				message: transaction.message,
				keyword: transaction.keyword,
				amount: parseInt( transaction.amount._hex ) / ( 10 ** 18 )
			} ) );

			setTransactions( structuredTransactions );
			console.log( availableTransactions );
			console.log( structuredTransactions );
		} catch ( error ) {
			console.error( error );
			throw new Error( "No Ethereum Object" );
		}
	}

	const checkIfWalletIsConnect = async () => {
		try {
			if ( !ethereum ) {
				alert( "MetaMask not detected." );
				return;
			}

			const accounts = await ethereum.request( { method: 'eth_accounts' } );

			if ( accounts.length > 0 ) {
				setCurrentAccount( accounts[ 0 ] );

				getAllTransactions();
			} else {
				console.log( 'No Accounts Found' );
			}
		} catch ( error ) {
			console.error( error );
			throw new Error( "No Ethereum Object" );
		}
	}

	const checkIfTransactionExist = async () => {
		try {
			const transactionContract = getEthereumContract();
			const transactionCount = await transactionContract.getTransactionCount();

			window.localStorage.setItem( 'transactionCount', transactionCount );
		} catch ( error ) {
			console.error( error );
			throw new Error( "No Ethereum Object" );
		}
	}

	const connectWallet = async () => {
		try {
			if ( !ethereum ) {
				alert( "MetaMask not detected." );
				return;
			}

			const accounts = await ethereum.request( { method: 'eth_requestAccounts' } );

			setCurrentAccount( accounts[ 0 ] );
		} catch ( error ) {
			console.error( error );
			throw new Error( "No Ethereum Object" );
		}
	}

	const sendTransaction = async () => {
		try {
			if ( !ethereum ) {
				alert( "MetaMask not detected." );
				return;
			}

				// Get data from the form
				const { addressTo, amount, keyword, message } = formData;

				const transactionContract = getEthereumContract();
				const parsedAmount = ethers.utils.parseEther( amount );

				await ethereum.request( {
					method: 'eth_sendTransaction',
					params: [ {
						from: currentAccount,
						to: addressTo,
						gas: '0x5208', // 21000 GWEI
						value: parsedAmount._hex
					} ]
				} );

				const transactionHash = await transactionContract.addToBlockchain( addressTo, parsedAmount, message, keyword );

				setIsLoading( true );
				console.log( `Loading - ${ transactionHash.hash }` );
				await transactionHash.wait();
				setIsLoading( false );
				console.log( 'Success' );

				const transactionCount = await transactionContract.getTransactionCount();

			setTransactionCount( transactionCount.toNumber() );
		} catch ( error ) {
			console.error( error );
			throw new Error( "There is no ethereum object" );
		}
	}

	useEffect( () => {
		checkIfWalletIsConnect();
		checkIfTransactionExist();
	}, [] );

	return (
		<TransactionContext.Provider value={ { connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading } }>
			{ children }
		</TransactionContext.Provider>
	)
}
