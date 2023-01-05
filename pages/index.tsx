import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Alert, Row, Skeleton } from 'antd';
import { NextPage } from 'next';
import { useMemo } from 'react';
import useSWR from 'swr';

import ConnectWallet from '../components/ConnectWallet';
import Header from '../components/Header';
import { NFTList } from '../components/NFTs';
import SEO from '../components/SEO';
import { useWeb3 } from '../context/web3';
import useProject from '../hooks/useProject';
import useTranslation from '../hooks/useTranslation';
import useUser from '../hooks/useUser';
import { ApiUrl } from '../schema/const';
import { Endpoint } from '../schema/enum';
import { Project } from '../schema/interfaces';

const getKey = (wallet?: string, project?: Project) => {
  // If one of them is not provided then the API call isn' made (falsy key)
  if (!wallet || !project) return undefined;

  // Extracts the list of project-related Smart Contract's addresses
  const sm_addresses = project.contracts.map((c) => c.address);

  // Creates the query string with the desired constraints
  const query = RequestQueryBuilder.create()
    // Filter out the NFT not owned by the current users
    .setFilter({ field: 'owner_wallet', operator: CondOperator.EQUALS, value: wallet })
    // Filter out the NFTs not related to current project's Smart Contract
    .setFilter({ field: 'contract.address', operator: CondOperator.IN, value: sm_addresses })
    .setJoin({ field: 'contract' })
    // Sort by addition date (newest -> oldest)
    .sortBy({ field: 'created_at', order: 'ASC' })
    .query(false);

  // Returns the SWR key (that is also the endpoint to be fetched)
  return `${ApiUrl}${Endpoint.NFTs}?${query}`;
};

const MyNFTPage: NextPage = () => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Get a reference to the multichain address of the user
  const { wallet } = useWeb3();
  // Get a reference to the project environment
  const { project } = useProject();
  // Pulls the NFTs owned by the current wallet
  const { data: NFTs, error } = useSWR(getKey(wallet, project));
  // Pull as well the data available on the WS about the user
  const { user } = useUser();

  // Memoized version of the alert content (to avoid rerender)
  const AlertContent = useMemo(
    () => <div dangerouslySetInnerHTML={{ __html: t('pages.my-nft.alert_message') }} />,
    [t]
  );

  // Memoized version of the page content (to avoid rerender)
  const PageContent = useMemo(() => {
    // If no wallet is provided a "Connect your wallet" element is rendered
    if (!wallet) return <ConnectWallet />;

    // Else a list of NFTs is rendered with Spinner and (eventually) Empty
    return !NFTs && !error ? <Skeleton active /> : <NFTList nfts={NFTs} />;
  }, [NFTs, error, wallet]);

  return (
    <div id="my-nft" className="page">
      <SEO title="My NFT" />
      <Header />

      <main>
        <div>
          {/* Page title */}
          <h1>{t('pages.my-nft.title')}</h1>
          <h5>{t('pages.my-nft.description', { pName: project?.name })}</h5>
        </div>

        {/* Reminder to complete the profile  */}
        {wallet && !user && <Alert type="warning" description={AlertContent} />}

        {/* Based on if the wallet is connected or not, shows a "Connect" card or the NFT list */}
        <Row justify="center">{PageContent}</Row>
      </main>
    </div>
  );
};

export default MyNFTPage;
