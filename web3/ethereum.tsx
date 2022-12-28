import { Dispatch, SetStateAction } from 'react';
import { Web3Info } from '../context/web3';
import { TFunc } from '../hooks/useTranslation';
import { Blockchain } from '../schema/enum';

/**
 * Helper function to trigger a connection to Metamask, returning an updated
 * state by setting up all the information available at the moment of setup
 * @param {TFunction} t - The translator function
 * @returns {Promise<Web3Info>}
 */
const connect = async (t: TFunc): Promise<Web3Info> => {
  const { ethereum } = window as any;

  // Checks for dependencies to be correctly initialized
  if (!ethereum && !ethereum?.isMetaMask) throw t('errors.no_metamask');

  // Asks the user to select the Metamask wallet to be used
  const [wallet] = await ethereum.request({ method: 'eth_requestAccounts' });
  // Retrieves the chain id (Ethereum mainnet, Rinkeby testnet, Polygon Mumbai and so on...)
  const chainId = await ethereum.request({ method: 'eth_chainId' });

  // Returns the updated data with wallet and chainId
  return { blockchain: Blockchain.Eth, wallet: `${Blockchain.Eth}:${wallet}`, chainId };
};

/**
 * Attach wallet specific event listener, returns a cleanup function to remove
 * said listener onUnmount.
 * ! NOTE: Must be used inside a useEffect
 * @param {Dispatch<SetStateAction<Web3Info | null>>} mutate - Mutate the state
 * @returns {() => void} - The cleanup function
 */
const attachListener = (mutate: Dispatch<SetStateAction<Web3Info | null>>) => {
  const { ethereum } = window as any;

  // Event handlers for chain (testnet, mainnet, ..) changes made in Metamask extension
  const onChainChange = (newChainId: string) =>
    mutate((prev) => ({ ...prev, chainId: newChainId }));

  // Event handlers for wallet changes made in Metamask extension
  const onWalletChange = ([wallet]: string[]) =>
    mutate((prev) => ({ ...prev, wallet: `${Blockchain.Eth}:${wallet}` }));

  // Function to be executed during mount, adds event listeners that updates the data state
  ethereum?.on('chainChanged', onChainChange);
  ethereum?.on('accountsChanged', onWalletChange);

  // Function to be executed during unmount to remove the listeners
  return () => {
    ethereum?.removeListener('chainChanged', onChainChange);
    ethereum?.removeListener('accountsChanged', onWalletChange);
  };
};

/**
 * Helper function to trigger a disconnection from Metamask, returning an updated
 * state by removing all the information available at the moment of setup
 * @param {TFunction} t - The translator function
 * @returns {Promise<Web3Info>}
 */
const disconnect = async (t: TFunc): Promise<Web3Info> => {
  const { ethereum } = window as any;

  // Checks for dependencies to be correctly initialized.
  if (!ethereum || !ethereum.isMetaMask) throw t('errors.no_metamask');

  // Retrieves the user connected wallet
  const [wallet] = await ethereum.request({ method: 'eth_requestAccounts' });

  // If no wallet hasn't been connected there's no point in disconnect something
  if (!wallet) throw t('errors.cant_disconnect');

  // Returns the default data, with no wallet connected or chain specified
  return { blockchain: undefined, wallet: undefined, chainId: undefined };
};

export const ethereum = { connect, disconnect, attachListener };
