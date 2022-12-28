/**
 * A list of all the blockchains supported by Moonium
 * @enum @alias Blockchain
 */
export enum Blockchain {
  Eth = 'ETHEREUM',
  Sol = 'SOLANA'
}

/**
 * A list of all the REST API endpoint available on the WS
 * @enum @alias Endpoint
 */
export enum Endpoint {
  Admin = '/admins',
  Projects = '/projects',
  Users = '/users',
  NFTs = '/nfts',

  AuthLogin = '/auth/login',
  AuthRefresh = '/auth/refresh'
}

/**
 * A list of available routes on the client side WebApp
 * @enum @alias Routes
 */
export enum Routes {
  Home = '/',
  Me = '/me',

  Admin = '/admin',
  Login = '/login',

  NotFound = '/404',
  CookiePolicy = 'cookie-policy',
  PrivacyPolicy = 'privacy-policy',
  TermsOfService = 'terms-of-service'
}
