import { Dispatch, SetStateAction } from 'react';
import { Web3Info } from '../context/web3';
import { TFunc } from '../hooks/useTranslation';
import { Blockchain } from '../schema/enum';

/**
 * Helper function to trigger a connection to Solana, returning an updated
 * state by setting up all the information available at the moment of setup
 * @param {TFunction} t - The translator function
 * @returns {Promise<Web3Info>}
 */
const connect = async (t: TFunc): Promise<Web3Info> => {
  const { solana } = window as any;

  // Checks for dependencies to be correctly initialized
  if (!solana || !solana?.isPhantom) throw t('errors.no_phantom');

  // Asks the user to login with Phantom and extracts the wallet
  const { publicKey } = await solana.connect();

  // Returns the updated data with wallet and chainId
  // TODO retrieve chainId
  return {
    blockchain: Blockchain.Sol,
    wallet: `${Blockchain.Sol}:${publicKey.toString()}`,
    chainId: '-1'
  };
};

/**
 * Attach wallet specific event listener, returns a cleanup function to remove
 * said listener onUnmount.
 * ! NOTE: Must be used inside a useEffect
 * @param {Dispatch<SetStateAction<Web3Info | null>>} mutate - Mutate the state
 * @returns {() => void} - The cleanup function
 */
const attachListener = (mutate: Dispatch<SetStateAction<Web3Info | null>>) => {
  const { solana } = window as any;
  // TODO add event listener onMount and remove them onUnmount
  // Function to be executed during unmount to remove the listeners
  return () => {};
};

/**
 * Helper function to trigger a disconnection from Phantom, returning the updated
 * state by removing all the information available at the moment of setup
 * @param {TFunction} t - The translator function
 * @returns {Promise<Web3Info>}
 */
const disconnect = async (t: TFunc): Promise<Web3Info> => {
  const { solana } = window as any;

  // Checks for dependencies to be correctly initialized.
  if (!solana || !solana.isPhantom) throw t('errors.no_phantom');

  // If no wallet hasn't been connected there's no point in disconnect something
  if (!solana.isConnected) throw t('errors.cant_disconnect');

  // Returns the default data, with no wallet connected or chain specified
  return { blockchain: undefined, wallet: undefined, chainId: undefined };
};

export const solana = { connect, disconnect, attachListener };
