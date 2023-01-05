import { get } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import DefaultLocale from '../public/locales/en.json';
import ItalianLocale from '../public/locales/it.json';

export type TFunc = (tKey: string, iObj?: Record<string, string | number>) => string;
export type Interpolation = Record<string, unknown>;

const useTranslation = () => {
  const [locale, setLocale] = useState(DefaultLocale);

  // A function that mimics the i18n translate function
  const t = useCallback(
    (tKey: string, iObj: Interpolation = {}) => {
      // Retrieves the translation
      const translation = get(locale, tKey) || tKey;
      // Interpolates with eventual dynamic parameters and returns
      return Object.entries(iObj).reduce((t, [k, v]) => t.replace(`{{${k}}}`, v), translation);
    },
    [locale]
  );

  // When mounting the hook determines which one is the locale and uses it
  useEffect(() => setLocale(navigator.language === 'it' ? ItalianLocale : DefaultLocale), []);

  return { t };
};

export default useTranslation;
