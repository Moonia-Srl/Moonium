import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';
import { Button } from 'antd';
import type { NextPage } from 'next';
import Router from 'next/router';
import { useCallback, useEffect } from 'react';

import Header from '../components/Header';
import SEO from '../components/SEO';
import { useAuth } from '../context/auth';
import useProject from '../hooks/useProject';
import useTranslation from '../hooks/useTranslation';
import { ApiUrl } from '../schema/const';
import { Endpoint, Routes } from '../schema/enum';
import { downloadFile } from '../schema/utils';

/**
 * Return a csv export of all the NFT minted from the given contract as
 * well as the registered owner (if available).
 * @param {string[]} contracts - The project's contract addresses
 * @returns {string} - The csv encoded data about the owners
 */
export const exportNFTOwners = async (contracts: string[]) => {
  const headers = { Accept: 'text/csv' };

  // Creates the query string with the desired constraints
  const query = RequestQueryBuilder.create()
    .select(['name'])
    // Joins the registered owner data
    .setJoin({ field: 'contract', select: ['name', 'symbol'] })
    .setJoin({ field: 'owner', select: ['wallet', 'name', 'surname', 'email', 'phone'] })
    // Filter out the NFTs not related to current project's Smart Contract
    .setFilter({ field: 'contract.address', operator: CondOperator.IN, value: contracts })
    // Sort by addition date (newest -> oldest)
    .sortBy({ field: 'owner.wallet', order: 'ASC' })
    .query(false);

  // Makes the API call and parses the response's body
  const res = await fetch(`${ApiUrl}${Endpoint.NFTs}/export?${query}`, { headers });
  // If the API call failed then an error is throw
  if (res.status !== 200) throw 'errors.api_call_failed';
  const csvContent = await res.text();

  return csvContent;
};

const AdminHome: NextPage = () => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Retrieves the current authenticated admin if available
  const { project } = useProject();
  // Retrieves the current authenticated admin if available
  const { admin, loading } = useAuth();

  /**
   * Fetches the complete list of NFT owner from WS and starts the .csv download
   */
  const onBulkDownload = useCallback(async () => {
    const pContractsAddr = project?.contracts.map((c) => c.address) ?? [];
    // Obtains the list of owners and NFTs
    const csvContent = await exportNFTOwners(pContractsAddr);
    // Downloads the csv file on the user computer
    downloadFile(csvContent, 'text.csv', 'export.csv');
  }, [project?.contracts]);

  /**
   * Opens an error notification if authentication has failed
   */
  useEffect(() => {
    if (!loading && admin === null) Router.push(Routes.Login);
  }, [admin, loading]);

  return (
    <div id="admin" className="page">
      <SEO />
      <Header />

      <main>
        <div>
          {/* Page title */}
          <h1>{t('pages.admin.title')}</h1>
          <h5>{t('pages.admin.description')}</h5>
        </div>

        <Button type="primary" onClick={onBulkDownload}>
          {t('pages.admin.download')}
        </Button>
      </main>
    </div>
  );
};

export default AdminHome;
