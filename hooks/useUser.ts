import { notification } from 'antd';
import { useMemo } from 'react';
import useSWR from 'swr';

import { useWeb3 } from '../context/web3';
import useTranslation, { TFunc } from '../hooks/useTranslation';
import { ApiUrl } from '../schema/const';
import { Endpoint } from '../schema/enum';
import { User } from '../schema/interfaces';

/**
 * Returns the SWR key (for cache and to avoid double fetching)
 * @param {string|undefined} wallet
 * @returns {string|undefined}
 */
const getKey = (wallet?: string) => {
  // Returns the SWR key (that is also the endpoint to be fetched)
  if (!!wallet) return `${ApiUrl}${Endpoint.Users}/${wallet}`;
};

/**
 * Updates or insert a new user record in the database
 * @param {User} user - The updated user data
 * @returns {Promise<User>} - The updated user record
 */
const upsertUser = async (user: Partial<User>, t: TFunc): Promise<User> => {
  // Creates the header object
  const headers = { 'Content-Type': 'application/json' };
  // Serializes the user to be updated in the body
  const body = JSON.stringify(user);

  // Makes the API call and parses the response's body
  const res = await fetch(`${ApiUrl}${Endpoint.Users}`, { method: 'POST', headers, body });

  // If the API call failed then an error is throw
  if (!res.ok) throw 'errors.api_call_failed';

  // Else shows notification to user and returns the payload/body/user to the caller
  notification.success({ message: t('success.title'), description: t('success.update_complete') });
  return await res.json();
};

/**
 * Custom hook to manage the user data "globally"
 * @returns The updated user data as well as mutator and other data
 */
const useUser = () => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Retrieves the current user wallet and blockchain
  const { wallet } = useWeb3();
  // Data fetching status (success or failure)
  const { data, error, mutate: swrMutate } = useSWR<User>(getKey(wallet));

  // Determines the translation key for the occurred error
  const errorKey = useMemo(() => {
    return t(typeof error === 'string' ? error : 'errors.api_call_failed');
  }, [error, t]);

  // Custom mutate function to be provided
  const mutate = async (patch: Partial<User>) => {
    // Creates a patched user with the updated fields
    const patched = { wallet, ...data, ...patch } as User;
    // Provides some optimistic data to be used in the moment
    const options = { optimisticData: patched, rollbackOnError: true };
    swrMutate(upsertUser(patched, t), options);
  };

  console.log('BP__ useUser', data, error); // TODO REMOVE

  return { user: data, isLoading: !error && !data, error: errorKey, mutate };
};

export default useUser;
