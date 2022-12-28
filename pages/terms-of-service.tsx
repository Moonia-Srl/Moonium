import { NextPage } from 'next';
import useTranslation from '../hooks/useTranslation';

import SEO from '../components/SEO';

const TermsOfService: NextPage = () => {
 // Get a reference to the i18n translate function
  const { t } = useTranslation();

  return (
    <div id="tos" className="policy-page">
      <SEO title="Terms Of Service" />

      <main>
        <div className="header">
          {/* Page title */}
          <h1>{t('pages.terms-of-service.title')}</h1>
          <img alt="Site logo" src="favicon.png" />
        </div>

        {/* Page content */}
        <p dangerouslySetInnerHTML={{ __html: t('pages.terms-of-service.content') }} />
      </main>
    </div>
  );
};

export default TermsOfService;
