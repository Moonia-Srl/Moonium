import { NextPage } from 'next';

import SEO from '../components/SEO';
import useTranslation from '../hooks/useTranslation';

const CookiePolicy: NextPage = () => {
 // Get a reference to the i18n translate function
  const { t } = useTranslation();

  return (
    <div id="cookie-policy" className="policy-page">
      <SEO title="Cookie Policy" />

      <main>
        <div className="header">
          {/* Page title */}
          <h1>{t('pages.cookie-policy.title')}</h1>
          <img alt="Site logo" src="favicon.png" />
        </div>

        {/* Page content */}
        <p dangerouslySetInnerHTML={{ __html: t('pages.cookie-policy.content') }} />
      </main>
    </div>
  );
};

export default CookiePolicy;
