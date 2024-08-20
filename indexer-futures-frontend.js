import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ABI for the Indexer Futures Contract
const contractABI = [
  "function stake(uint256 amount) public",
  "function createFuture(address buyer, uint256 amount, uint256 duration) public",
  "function cancelFuture(address indexer) public",
  "function settleFuture(address buyer) public",
  "function getConsensusPoi(bytes32 subgraphId, uint256 blockNumber) public view returns (bytes32, uint256)",
  "function isIndexerCompliant(address indexer) public view returns (bool)",
  "event FutureCreated(address indexed indexer, address indexed buyer, uint256 amount, uint256 duration)",
  "event FutureCancelled(address indexed indexer, address indexed buyer, uint256 amount)",
  "event FutureSettled(address indexed indexer, address indexed buyer, uint256 amount)",
  "event IndexerStaked(address indexed indexer, uint256 amount)",
];

// Replace with your deployed contract address
const contractAddress = "0x...";

/**
 * IndexerFuturesApp Component
 * 
 * This component provides a user interface for interacting with the Indexer Futures Contract.
 * It allows users to connect their wallet, stake GRT, create/cancel/settle futures, and check POIs.
 */
export default function IndexerFuturesApp() {
  // State variables
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [futureAmount, setFutureAmount] = useState('');
  const [futureDuration, setFutureDuration] = useState('');
  const [indexerAddress, setIndexerAddress] = useState('');
  const [subgraphId, setSubgraphId] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [consensusPoi, setConsensusPoi] = useState(null);
  const [isCompliant, setIsCompliant] = useState(null);
  const [notification, setNotification] = useState(null);

  // Initialize ethers and contract on component mount
  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }

        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
        });
      }
    };

    init();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      setNotification({ type: 'success', message: 'Wallet connected successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to connect wallet: ' + error.message });
    }
  };

  // Stake GRT function
  const stake = async () => {
    try {
      const tx = await contract.stake(ethers.utils.parseEther(stakeAmount));
      await tx.wait();
      setNotification({ type: 'success', message: `Staked ${stakeAmount} GRT successfully!` });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to stake: ' + error.message });
    }
  };

  // Create future function
  const createFuture = async () => {
    try {
      const tx = await contract.createFuture(
        buyerAddress,
        ethers.utils.parseEther(futureAmount),
        ethers.BigNumber.from(futureDuration)
      );
      await tx.wait();
      setNotification({ type: 'success', message: 'Future created successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to create future: ' + error.message });
    }
  };

  // Cancel future function
  const cancelFuture = async () => {
    try {
      const tx = await contract.cancelFuture(indexerAddress);
      await tx.wait();
      setNotification({ type: 'success', message: 'Future cancelled successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to cancel future: ' + error.message });
    }
  };

  // Settle future function
  const settleFuture = async () => {
    try {
      const tx = await contract.settleFuture(buyerAddress);
      await tx.wait();
      setNotification({ type: 'success', message: 'Future settled successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to settle future: ' + error.message });
    }
  };

  // Get consensus POI function
  const getConsensusPoi = async () => {
    try {
      const result = await contract.getConsensusPoi(subgraphId, ethers.BigNumber.from(blockNumber));
      setConsensusPoi({ poi: result[0], stake: ethers.utils.formatEther(result[1]) });
      setNotification({ type: 'success', message: 'Consensus POI retrieved successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to get consensus POI: ' + error.message });
    }
  };

  // Check indexer compliance function
  const checkIndexerCompliance = async () => {
    try {
      const result = await contract.isIndexerCompliant(indexerAddress);
      setIsCompliant(result);
      setNotification({ type: 'success', message: 'Indexer compliance checked successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to check indexer compliance: ' + error.message });
    }
  };

  // Render UI components
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Indexer Futures dApp</h1>
      
      {!account && (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}

      {account && (
        <div className="mb-4">
          <p>Connected Account: {account}</p>
        </div>
      )}

      {notification && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <StakeCard stakeAmount={stakeAmount} setStakeAmount={setStakeAmount} stake={stake} />
        <CreateFutureCard 
          buyerAddress={buyerAddress} 
          setBuyerAddress={setBuyerAddress}
          futureAmount={futureAmount}
          setFutureAmount={setFutureAmount}
          futureDuration={futureDuration}
          setFutureDuration={setFutureDuration}
          createFuture={createFuture}
        />
        <CancelFutureCard 
          indexerAddress={indexerAddress} 
          setIndexerAddress={setIndexerAddress}
          cancelFuture={cancelFuture}
        />
        <SettleFutureCard 
          buyerAddress={buyerAddress}
          setBuyerAddress={setBuyerAddress}
          settleFuture={settleFuture}
        />
        <GetConsensusPOICard 
          subgraphId={subgraphId}
          setSubgraphId={setSubgraphId}
          blockNumber={blockNumber}
          setBlockNumber={setBlockNumber}
          getConsensusPoi={getConsensusPoi}
          consensusPoi={consensusPoi}
        />
        <CheckIndexerComplianceCard 
          indexerAddress={indexerAddress}
          setIndexerAddress={setIndexerAddress}
          checkIndexerCompliance={checkIndexerCompliance}
          isCompliant={isCompliant}
        />
      </div>
    </div>
  );
}

// Stake Card Component
function StakeCard({ stakeAmount, setStakeAmount, stake }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stake GRT</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Amount to stake"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
        <Button onClick={stake} className="mt-2">Stake</Button>
      </CardContent>
    </Card>
  );
}

// Create Future Card Component
function CreateFutureCard({ buyerAddress, setBuyerAddress, futureAmount, setFutureAmount, futureDuration, setFutureDuration, createFuture }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Future</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Buyer address"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Amount"
          value={futureAmount}
          onChange={(e) => setFutureAmount(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Duration"
          value={futureDuration}
          onChange={(e) => setFutureDuration(e.target.value)}
          className="mb-2"
        />
        <Button onClick={createFuture}>Create Future</Button>
      </CardContent>
    </Card>
  );
}

// Cancel Future Card Component
function CancelFutureCard({ indexerAddress, setIndexerAddress, cancelFuture }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancel Future</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Indexer address"
          value={indexerAddress}
          onChange={(e) => setIndexerAddress(e.target.value)}
          className="mb-2"
        />
        <Button onClick={cancelFuture}>Cancel Future</Button>
      </CardContent>
    </Card>
  );
}

// Settle Future Card Component
function SettleFutureCard({ buyerAddress, setBuyerAddress, settleFuture }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settle Future</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Buyer address"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
          className="mb-2"
        />
        <Button onClick={settleFuture}>Settle Future</Button>
      </CardContent>
    </Card>
  );
}

// Get Consensus POI Card Component
function GetConsensusPOICard({ subgraphId, setSubgraphId, blockNumber, setBlockNumber, getConsensusPoi, consensusPoi }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Consensus POI</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Subgraph ID"
          value={subgraphId}
          onChange={(e) => setSubgraphId(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Block number"
          value={blockNumber}
          onChange={(e) => setBlockNumber(e.target.value)}
          className="mb-2"
        />
        <Button onClick={getConsensusPoi}>Get Consensus POI</Button>
        {consensusPoi && (
          <div className="mt-2">
            <p>POI: {consensusPoi.poi}</p>
            <p>Stake: {consensusPoi.stake} GRT</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Check Indexer Compliance Card Component
function CheckIndexerComplianceCard({ indexerAddress, setIndexerAddress, checkIndexerCompliance, isCompliant }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Indexer Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Indexer address"
          value={indexerAddress}
          onChange={(e) => setIndexerAddress(e.target.value)}
          className="mb-2"
        />
        <Button onClick={checkIndexerCompliance}>Check Compliance</Button>
        {isCompliant !== null && (
          <p className="mt-2">Indexer is {isCompliant ? 'compliant' : 'not compliant'}</p>
        )}
      </CardContent>
    </Card>
  );
}
