import { Button, Empty } from 'antd';
import { useCallback } from 'react';

import useTranslation from '../hooks/useTranslation';
import { NFT } from '../schema/interfaces';
import { seeNFtOnRarible } from '../schema/utils';

type CardProps = { nft: NFT; className?: string };

export const NFTCard = ({ nft, className }: CardProps) => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();

  // Open a new window on the NFT detail page in Rarible
  const go2Rarible = useCallback(() => seeNFtOnRarible(nft.tokenId), [nft.tokenId]);

  return (
    <div id="nft-card" className={className}>
      <h1>{`${nft.contract?.symbol ?? 'NFT'} ${nft.name}`}</h1>
      <img width={220} height={220} alt="NFT Image" src={nft.assetUrl} />
      <h3>{nft.contract?.name ?? 'Collection'}</h3>

      <Button type="primary" onClick={go2Rarible}>
        {t('components.nft.see')}
      </Button>
    </div>
  );
};

type ListProps = { nfts: Array<NFT> };

export const NFTList = ({ nfts }: ListProps) => (
  <div id="nft-list">
    {nfts.length === 0 ? <Empty /> : nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
  </div>
);
