import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from '../utils/OneLine.json'

import TextArea from '../components/TextArea'
import Feed from '../components/Feed'
import ConnectWallet from '../components/ConnectWallet'
import { CONTRACT_ADDRESS } from "../utils/constants";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allEntries, setAllEntries] = useState([]);
  const contractAddress = CONTRACT_ADDRESS
  const contractABI = abi.abi;

  const getEntries = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const oneLineContract = new ethers.Contract(contractAddress, contractABI, signer);
        const entries = await oneLineContract.getAllEntries();

        const entriesCleaned = entries.map(entry => {
          return {
            address: entry.author,
            timestamp: new Date(entry.timestamp * 1000).toDateString().split(' ').slice(1,3).join(' '),
            message: entry.message,
            mood: entry.mood
          };
        });

        setAllEntries(entriesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let oneLineContract;

    const onNewEntry = (from, timestamp, message, mood) => {
      console.log("NewEntry", from, timestamp, message, mood);
      setAllEntries(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000).toDateString().split(' ').slice(1,3).join(' '),
          message: message,
          mood: mood
        },
      ]);
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      oneLineContract = new ethers.Contract(contractAddress, contractABI, signer);
      oneLineContract.on('NewEntry', onNewEntry);
    }
  
    return () => {
      if (oneLineContract) {
        oneLineContract.off('NewEntry', onNewEntry);
      }
    };
  }, [])

  useEffect(() => {
    const onLoadPage = async () => {
      await checkIfWalletIsConnected();
      await getEntries();
    }
    
    onLoadPage();
  }, [])
  
  return (

    <>
      <main className="max-w-lg mx-auto pt-10 pb-12 px-4 lg:pb-16">
          <div className="space-y-6">
            <div>
              <h1 className="text-lg leading-6 font-medium text-gray-900">One ETH a Day Journal</h1>
              <p className="mt-1 text-sm text-gray-500">
                gm! Write your one line a day for a chance to win some ETH :)
              </p>
            </div>
            {currentAccount ? <TextArea /> : <ConnectWallet connect={connectWallet} />}

            {allEntries ? <Feed entries={allEntries} /> : "Loading..."}
          </div>
      </main>
    </>
  );
}
