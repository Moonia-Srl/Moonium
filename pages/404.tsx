import { Button } from 'antd';
import { NextPage } from 'next';
import Router from 'next/router';

import useTranslation from '../hooks/useTranslation';
import SEO from '../components/SEO';

const NotFound: NextPage = () => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();

  return (
    <div id="not-found">
      <SEO title="Not Found" />

      <main>
        <img alt="Not Found Image" src="not-found.svg" />
        <h1>{t('pages.not-found.title')}</h1>
        <h5>{t('pages.not-found.content')}</h5>
        <Button type="primary" onClick={() => Router.back()}>
          {t('pages.not-found.button')}
        </Button>
      </main>
    </div>
  );
};

export default NotFound;
