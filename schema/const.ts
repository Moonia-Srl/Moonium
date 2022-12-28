import { Routes } from './enum';
import { Link } from './interfaces';
/**
 * SEO default param for tag
 * @constant
 * @param title - Default page title in the browsers
 * @param creator - The name of the site creator/owner
 * @param description - A brief description of the site
 * @param site_url - The URL at which the site is accessible
 * @param logo - The relative path (from /public) to the site logo
 * @param favicon - The relative path (from /public) to the favicon image
 * @param locale - The filename of the locale file to be used for i18n
 */
export const Metadata = {
  title: 'Moonium',
  creator: 'Moonia Srl',
  description: 'The goto platform to manage your NFT community',
  site_url: 'https://www.moonia.it',
  logo: '/logo.png',
  favicon: '/favicon.png'
};

/**
 * Base url for API service to which all request must be made
 * @constant @type {string}
 */
export const ApiUrl = process.env.NEXT_PUBLIC_MOONIUM_API ?? '';

/**
 * Regex used to determine project slug from URL (window.location).
 * Supported URL are:  {something}.{project_slug}.{domain}
 * @constant @type {RegExp}
 */
export const DomainUrlRegex = /(\w*)(\.)(\S*)(\.)(\w*)/gm;

/**
 * Links to be shown in the navbar
 * @constant @type {Array<Link>}
 */
export const NavLinks: Array<Link> = [
  { route: Routes.Home, tKey: 'home' },
  { route: Routes.Me, tKey: 'profile' }
];
