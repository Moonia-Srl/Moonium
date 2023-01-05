import { notification } from 'antd';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import useTranslation from '../hooks/useTranslation';
import { Blockchain } from '../schema/enum';
import { ethereum } from '../web3/ethereum';
import { solana } from '../web3/solana';

export interface Web3Info {
  wallet?: string;
  chainId?: string;
  blockchain?: Blockchain;
}

type Web3Context = Web3Info & {
  connect: (blockchain: Blockchain) => Promise<void>;
  disconnect: (blockchain: Blockchain) => Promise<void>;
};

const Web3Ctx = createContext<Web3Context | null>(null);

/**
 * Custom hook to retrieve and interact with the Web3 Context
 * @returns {Web3Context}
 */
export const useWeb3 = () => {
  // Retrieves the data for the Web3 context in the hierarchy
  const value = useContext(Web3Ctx);
  // If the context hasn't been initialized returns an error
  if (value == null) throw new Error('useWeb3 must be used inside an Web3Provider');
  return value; // Else the context value
};

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  // Retrieves a reference to the TFunc by i18n
  const { t } = useTranslation();
  // Data state to save chain id and wallet address, this can be changed also from Metamask
  const [data, setData] = useState<Web3Info | null>(null);

  console.log('BP__ useWeb3', data);

  /**
   * Handles the correct connection/disconnection from the wallet provider
   * @function
   * @param {Web3Info} info - The new updated infos
   */
  const onSuccess = (info: Web3Info) => {
    // Sets the current data in the state and removes the stale cache
    setData(info), localStorage.removeItem('wallet-info');

    // If the new data is not a zero value object then saves the new data in storage
    if (info.blockchain && info.chainId && info.wallet)
      localStorage.setItem('wallet-info', JSON.stringify(info));
  };

  /**
   * Handles error during connection to the wallet provider
   * @function
   * @param {unknown} err
   */
  const onError = (err: unknown) => {
    const msg = { message: t('errors.title'), description: `${err}` };
    notification.error(msg);
  };

  /**
   * Connect the user to the desired blockchain wallet, the sub function
   * called checks that a provider exist and if not found throw an error.
   * @function @async
   * @param {Blockchain} blockchain - The desired blockchain/wallet connect
   */
  const dispatchConnect = async (blockchain: Blockchain) => {
    switch (blockchain) {
      case Blockchain.Eth:
        return ethereum.connect(t).then(onSuccess).catch(onError);
      case Blockchain.Sol:
        return solana.connect(t).then(onSuccess).catch(onError);
      default:
        throw Error(t('errors.unsupported_blockchain'));
    }
  };

  /**
   * Disconnect the user from the desired blockchain wallet, the sub function
   * called checks that a connected wallet exist and if not found throw an error.
   * @function @async
   * @param {Blockchain} blockchain - The desired blockchain/wallet to disconnect
   */
  const dispatchDisconnect = async (blockchain: Blockchain) => {
    // Sets the current data in the state and removes the stale cache
    localStorage.removeItem('wallet-info');
    setData({ blockchain: undefined, chainId: undefined, wallet: undefined });

    switch (blockchain) {
      case Blockchain.Eth:
        return ethereum.disconnect(t).then(() => { }); //.then(onSuccess).catch(onError);
      case Blockchain.Sol:
        return solana.disconnect(t).then(() => { }); //.then(onSuccess).catch(onError);
      default:
        throw Error(t('errors.unsupported_blockchain'));
    }
  };

  /**
   * onMount checks the local storage for a previous user session and eventually
   * restores it if available. If not a default/zero-value state is loaded.
   * @function
   */
  useEffect(() => {
    const cachedWallet = localStorage.getItem('wallet-info');
    if (cachedWallet !== null) setData(JSON.parse(cachedWallet));
    else setData({ blockchain: undefined, chainId: undefined, wallet: undefined });
  }, []);

  /**
   * When mounting the Web3 context attaches some event listeners to ethereum/solana,
   * at the same time returns a cleanup function to be used when unmounting the effect.
   * @function
   */
  useEffect(() => {
    switch (data?.blockchain) {
      case Blockchain.Eth:
        return ethereum.attachListener(setData);
      case Blockchain.Sol:
        return solana.attachListener(setData);
    }
  }, [data?.blockchain]);

  if (data === null) return <></>;

  return (
    <Web3Ctx.Provider value={{ ...data, connect: dispatchConnect, disconnect: dispatchDisconnect }}>
      {children}
    </Web3Ctx.Provider>
  );
};
