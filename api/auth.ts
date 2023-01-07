import { ApiUrl } from '../schema/const';
import { Endpoint } from '../schema/enum';
import { Admin, Login } from '../schema/interfaces';

/**
 * Retrieves a specific admin from the Database/WebService
 * @param {string} id - The admin identifier
 * @returns {Promise<Admin>}
 */
export const getAdminById = async (id: string): Promise<Admin> => {
  // Makes the API call and parses the response's body
  const res = await fetch(`${ApiUrl}${Endpoint.Admin}/${id}`);

  // If the API call failed then an error is throw
  if (res.status !== 200) throw 'errors.not_found';
  const admin = await res.json();

  // Checks that the API returned at least one project
  if (!admin) throw 'errors.not_found';

  return admin;
};

/**
 * Tries to authenticate the user with the credentials provided
 * @param {Login} credentials - Email and password
 * @returns {Promise<Admin>} - The authenticated admin
 */
export const login = async (credentials: Login): Promise<Admin> => {
  // Creates the header object
  const headers = { 'Content-Type': 'application/json' };
  // Serializes the user to be updated in the body
  const body = JSON.stringify(credentials);

  // Makes the API call and parses the response's body
  const res = await fetch(`${ApiUrl}${Endpoint.AuthLogin}`, { method: 'POST', headers, body });
  // If the API call failed then an error is throw
  if (res.status !== 201) throw 'errors.auth_failed';
  const { access, refresh, payload } = await res.json();

  // Checks that the API returned the correct payload
  if (!access || !refresh || !payload) throw 'errors.auth_failed';

  // Saves locally the access token and refresh token
  localStorage.setItem('AccessToken', access);
  localStorage.setItem('RefreshToken', refresh);

  // Returns the authenticated Admin
  return payload;
};

/**
 * Tries to refresh the AccessToken with the RefreshToken if available
 * @returns {Promise<Admin>} - The authenticate admin
 */
export const refresh = async (): Promise<Admin> => {
  // Tries to retrieve the RefreshToken from the local storage
  const prevRT = localStorage.getItem('RefreshToken');
  if (prevRT === null) throw 'errors.token_expired';

  // Creates the header object
  const headers = { 'Content-Type': 'application/json' };
  // Serializes the user to be updated in the body
  const body = JSON.stringify({ refreshToken: prevRT });

  // Makes the API call and parses the response's body
  const res = await fetch(`${ApiUrl}${Endpoint.AuthRefresh}`, { method: 'POST', headers, body });
  // If the API call failed then an error is throw
  if (res.status !== 201) throw 'errors.token_expired';
  const { access, refresh, payload } = await res.json();

  // Checks that the API returned the correct payload
  if (!access || !refresh || !payload) throw 'errors.token_expired';

  // Saves locally the access token and refresh token
  localStorage.setItem('AccessToken', access);
  localStorage.setItem('RefreshToken', refresh);

  // Returns the authenticated Admin
  return payload;
};

/**
 * Logout the current authenticated user by removing the Access and
 * Refresh token from the local storage of the browser
 */
export const logout = () => {
  localStorage.removeItem('AccessToken');
  localStorage.removeItem('RefreshToken');
};
