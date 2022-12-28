import { NextPage } from 'next';
import useTranslation from '../hooks/useTranslation';

import SEO from '../components/SEO';

const PrivacyPolicy: NextPage = () => {
 // Get a reference to the i18n translate function
  const { t } = useTranslation();

  return (
    <div id="privacy-policy" className="policy-page">
      <SEO title="Privacy Policy" />

      <main>
        <div className="header">
          {/* Page title */}
          <h1>{t('pages.privacy-policy.title')}</h1>
          <img alt="Site logo" src="favicon.png" />
        </div>

        {/* Page content */}
        <p dangerouslySetInnerHTML={{ __html: t('pages.privacy-policy.content') }} />
      </main>
    </div>
  );
};

export default PrivacyPolicy;
