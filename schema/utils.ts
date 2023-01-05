import Router from 'next/router';
import { Blockchain, Routes } from './enum';

/**
 * Helper function that start a download on the user browser of a specified file
 * @param data - The file data/content
 * @param type - The file MIME type
 * @param filename - The file name when downloading
 */
export const downloadFile = (data: string | Buffer, type: string, filename: string) => {
  // Converts the data to a Blob object
  const blob = new Blob([data], { type });

  // Creates a DOM <a> element with the blob data and desired filename
  const anchor = window.document.createElement('a');
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = filename;

  // Appends the <a> to the body and clicks it, then removes it
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

/**
 * Based on the multichain id generates the correct Rarible URL and
 * open a new blank window to that URL.
 * ! NOTE: This function doesn't support Tezos yet
 * @param multichainId - E.g ETHEREUM:{ContractAddress}:{TokenId}
 */
export const seeNFtOnRarible = (multichainId: string) => {
  // Common base URL to the Rarible NFT details page
  const NFtDetailPage = `${process.env.NEXT_PUBLIC_RARIBLE_URL}/token`;
  // Retrieves the blockchain in which the NFT "resides"
  const [blockchain] = multichainId.split(':');

  if (blockchain === Blockchain.Sol) {
    // Splits the multichain address to blockchain and token id
    const [_, tokenId] = multichainId.split(':');
    // Creates an interpolated SOLANA-specific URL
    const url = `${NFtDetailPage}/solana/${tokenId}`;
    // Opens another window at the given URL
    return window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (blockchain === Blockchain.Eth) {
    // Splits the multichain address to blockchain and token id
    const [_, collection, tokenId] = multichainId.split(':');
    // Creates an interpolated generic-URL based on on the contract address and token id
    const url = `${NFtDetailPage}/${collection}:${tokenId}`;
    // Opens another window at the given URL
    return window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (blockchain === Blockchain.Pol) {
    // Splits the multichain address to blockchain and token id
    const [_, collection, tokenId] = multichainId.split(':');
    // Creates an interpolated generic-URL based on on the contract address and token id
    const url = `${NFtDetailPage}/polygon/${collection}:${tokenId}`;
    // Opens another window at the given URL
    return window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Default for blockchains not supported
  return Router.push(Routes.NotFound);
};
