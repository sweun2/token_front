import './styles/App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ATNToken from './utils/ATNToken.json';

const CONTRACT_ADDRESS ="0x0fc467Cf9Ad67709eF9d45c43dd6b7F1758f7B68";

const App=()=>{
    const [currentAccount, setCurrentAccount] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [toAmount, setToAmount] = useState("");





  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("metamask " );
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
    } else {
      console.log("No authorized account found")
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

      checkChainId();
      // String, hex code of the chainId of the Rinkebey test network
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
    } catch (error) {
      console.log(error)
    }
  }
  /// checkChainID
  const checkChainId= async ()=>{
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      var chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Network!");
      }
      // String, hex code of the chainId of the Rinkebey test network
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
    } catch (error) {
      console.log(error)
    }
  }
  
  
  
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ATNToken.abi, signer);

        connectedContract.on("Transfer", (from, amount) => {
          console.log(from, amount);
          alert(`토큰이 전송 (transfer) 되었어요! ${from}, 에서 ${amount} 만큼 보냈어요!`)
        });

        alert("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToTransfer = async () => {
    checkChainId();
    setupEventListener()
    const to = toAddress;
    const amount = ethers.utils.parseEther((toAmount).toString());
    alert("amount >>>>>>>> "+ amount)
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ATNToken.abi, signer);

        alert("Going to pop wallet now to pay gas...")
        let txn = await connectedContract.transfer(to, amount);

        alert("Mining...please wait.")
        await txn.wait();
        console.log(txn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const burnToken= async()=>{
    checkChainId();
    setupEventListener()
    const amount = ethers.utils.parseEther((toAmount).toString());
    alert("amount >>>>>>>> "+ amount)
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ATNToken.abi, signer);

        alert("Going to pop wallet now to pay gas...")
        var temp=await signer.getAddress();
        alert(temp)
        let txn = await connectedContract.burn(amount);

        alert("Mining...please wait.")
        await txn.wait();
        console.log(txn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      alert(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  })

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  
  const TransferUI = () => (
    <div>
          <input type="text" value={toAddress} placeholder='where to send' onChange={e => { setToAddress(e.target.value) }}></input>
          <input type="text" value={toAmount} placeholder='how much to send' onChange={(e) => setToAmount(e.target.value)}></input>
          <button onClick={askContractToTransfer} className="cta-button connect-wallet-button">
            Transfer
          </button>
          <button onClick={burnToken} className="cta-button connect-wallet-button">
            Burn
          </button>
    </div>
  )

  

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My ERC20 Token Transfer Web App</p>
          <p className="sub-text">
            Long Live Smiling Leo, Long Live DSRV!
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : TransferUI()}
        </div>
        
      </div>
    </div>
  );


}




export default App;
