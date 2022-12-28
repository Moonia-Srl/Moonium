import { Card, Spin } from 'antd';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useTranslation from '../hooks/useTranslation';

import CMSHeader from '../components/Header';
import SEO from '../components/SEO';
import UserForm from '../components/Users';
import { useWeb3 } from '../context/web3';
import useUser from '../hooks/useUser';
import { Routes } from '../schema/enum';

const MePage: NextPage = () => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Gets a reference to the internal router
  const router = useRouter();
  // Retrieves the user's wallet from Web3 context
  const { blockchain, wallet } = useWeb3();
  // Retrieves the user's wallet from Web3 context
  const { user, isLoading, mutate } = useUser();

  //Redirects the user to the home page when the wallet isn't connected
  useEffect(() => {
    if (!blockchain || !wallet) router.push(Routes.Home);
  }, [blockchain, router, wallet]);

  return (
    <div id="me" className="page">
      <SEO title="My Profile" />
      <CMSHeader />

      <main>
        <div>
          <h1>{t('pages.me.title')}</h1>
          <h5>{t('pages.me.description')}</h5>
        </div>

        <Card>
          <Spin size="large" spinning={isLoading}>
            <UserForm init={user} onSubmit={mutate} />
          </Spin>
        </Card>
      </main>
    </div>
  );
};

export default MePage;
