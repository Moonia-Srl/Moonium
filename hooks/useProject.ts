import { RequestQueryBuilder } from '@nestjsx/crud-request';
import Router from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import useTranslation from '../hooks/useTranslation';
import { ApiUrl, DomainUrlRegex } from '../schema/const';
import { Endpoint, Routes } from '../schema/enum';
import { Project } from '../schema/interfaces';

const getKey = (slug?: string) => {
  // Creates the query string with the desired constraints
  const query = RequestQueryBuilder.create().setJoin({ field: 'contracts' }).query(false);
  // Returns the SWR key (that is also the endpoint to be fetched)
  if (!!slug) return `${ApiUrl}${Endpoint.Projects}/${slug}?${query}`;
};

const useProject = () => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Internal state with the current project slug
  const [slug, setSlug] = useState('');
  // Data fetching exit status (success or fail)
  const { data, error } = useSWR<Project>(getKey(slug));

  // Determines the translation key for the occurred error
  const errorKey = useMemo(() => {
    return t(typeof error === 'string' ? error : 'errors.api_call_failed');
  }, [error, t]);

  // onMount determines which project slug use to fetch the needed data
  useEffect(() => {
    // If we're in development then we fetch a default environment
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') setSlug('moonia-dev');
    // If we're in staging then we fetch the environment based on the first param
    else if (process.env.NEXT_PUBLIC_NODE_ENV === 'staging')
      setSlug(window.location.hostname.replace(DomainUrlRegex, '$1'));
    // Fetches the project by the project slug in the URL
    else setSlug(window.location.hostname.replace(DomainUrlRegex, '$3'));
  }, []);

  // Whenever the project changes the app theme is updated as well
  useEffect(() => {
    const themeColor = data?.env.color ?? '#fbc88c';
    document.documentElement.style.setProperty('--primary-color', themeColor);
  }, [data]);

  // Redirects to 404 page if the project can't be fetched
  if (!!error && window.location.pathname !== Routes.NotFound) Router.push(Routes.NotFound);

  return { project: data, isLoading: !error && !data, error: errorKey };
};

export default useProject;
