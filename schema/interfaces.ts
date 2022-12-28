import { Routes } from './enum';

/**
 * NavBar/Footer link to section or other pages
 * @interface @alias Link
 */
export interface Link {
  route: Routes; // The destination route to be pushed
  tKey: string; // A translation key to retrieve the link name (should be in JSON locales)
}

/**
 * Represents the data available for a project admin
 * @interface @alias Admin
 */
export interface Admin {
  name: string;
  surname: string;
  email: string;
  project: Project;
}

/**
 * Represents the available data about a Smart Contract.
 * This interface is blockchain independent.
 * @interface @alias Contract
 */
export interface Contract {
  name: string; // The Smart Contract's name
  symbol: string; // The Smart Contract's symbol
  address: string; // The Smart Contract's multichain address

  abi?: string; // Smart Contract ABI (for interaction)

  nft: NFT[]; // The NFTs minted by the SmartContract
  project: Project; // The related project
}

/**
 * Represents the needed data in order to login (Admin only)
 * @interface @alias Login
 */
export interface Login {
  email: string; // The admin email
  password: string; // The admin password
}

/**
 * Represents the data available about a client project/environment
 * @interface @alias Project
 */
export interface Project {
  id: number; // The UUID of the client's project
  slug: string; // The slugify version of the project name
  name: string; // The project's name or title

  // The project subscription expiration date
  expire_at: Date;
  // The project env contains some customization params (color, assets, ...)
  env: { logo: string; color: string };

  admins: Admin[]; //Optional list of admins
  contracts: Contract[]; // Optional list of contracts
}

/**
 * Represents the data available about an NFT
 * @interface @alias NFT
 */
export interface NFT {
  name: string; // The name of the NFT
  supply: number; // Number of copies available (1 for ERC721)
  tokenId: string; //Multichain address + NFT ID

  assetUrl: string; // URL to retrieve the NFT asset
  metadata: Array<{ type: string; value: string }>; // NFTs metadata

  owner?: User; // The current owner if registered
  contract?: Contract; // The contract that minted the NFT
}

/**
 * Represents the data available about a registered User
 * @interface @alias User
 */
export interface User {
  wallet: string; // Each user is identified by its own wallet

  name: string; // The registered user's name
  surname: string; // The registered user's surname
  email: string; // The registered user's email
  phone: string; // The registered user's phone number

  nft: NFT[]; // The NFTs owned by the current user
}
