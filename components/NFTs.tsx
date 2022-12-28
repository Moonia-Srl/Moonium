import { Empty } from 'antd';
import { NFT } from '../schema/interfaces';

type CardProps = { nft: NFT; className?: string };

export const NFTCard = ({ nft, className }: CardProps) => (
  <div id="nft-card" className={className}>
    <h1>{nft.name}</h1>
    <img width={220} height={220} alt="NFT Image" src={nft.assetUrl} />
    <h3>{`${nft.contract?.name ?? 'ND'} (${nft.contract?.symbol ?? 'ND'})`}</h3>
  </div>
);

type ListProps = { nfts: Array<NFT> };

export const NFTList = ({ nfts }: ListProps) => (
  <div id="nft-list">
    {nfts.length === 0 ? <Empty /> : nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
  </div>
);
