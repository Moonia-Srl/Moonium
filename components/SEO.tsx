import Head from 'next/head';

import { Metadata } from '../schema/const';

interface Props {
  title?: string;
  description?: string;
}

const SEO = ({ title, description }: Props) => (
  <Head>
    {/* General */}
    <title>{title ?? Metadata.title}</title>
    <link rel="icon" href={Metadata.favicon} />
    <meta name="description" content={description ?? Metadata.description} />

    {/* Twitter */}
    <meta name="twitter:title" content={title ?? Metadata.title} />
    <meta name="twitter:site" content={Metadata.site_url} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:description" content={description ?? Metadata.description} />
    <meta name="twitter:creator" content={Metadata.creator} />
    <meta name="twitter:image" content={Metadata.logo} />

    {/* OpenGraph/Facebook */}
    <meta property="og:title" content={title ?? Metadata.title} />
    <meta property="og:image" content={Metadata.logo} />
    <meta property="og:url" content={Metadata.site_url} />
    <meta property="og:site_name" content={title ?? Metadata.title} />
    <meta property="og:type" content={description ?? Metadata.description} />
    <meta property="og:description" content={description ?? Metadata.description} />

    {/* Metamask */}
    <link rel="shortcut icon" href={Metadata.logo} />
  </Head>
);

export default SEO;
