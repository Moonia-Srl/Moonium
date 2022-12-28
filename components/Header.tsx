import { Button, Drawer, Popover } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useAuth } from '../context/auth';
import { useWeb3 } from '../context/web3';
import useProject from '../hooks/useProject';
import useTranslation from '../hooks/useTranslation';
import { Metadata, NavLinks } from '../schema/const';
import { Routes } from '../schema/enum';

const Header = () => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Gets a reference to the internal router
  const router = useRouter();
  // Retrieves the project environment from the WebService
  const { project } = useProject();
  // Retrieves the current authenticated admin
  const { admin, signOut } = useAuth();
  // Retrieves the disconnect function from Web3 context
  const { blockchain, wallet, disconnect } = useWeb3();

  // Determine which logo to be shown
  const logo = project?.env.logo ?? Metadata.logo;
  // Bool that represents if the user is connected
  const isWalletConnected = !!blockchain && !!wallet;
  // Bool that represents if the user is connected
  const isAuthenticated = !!admin;

  // Responsive breakpoint for medium size screen
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  // When in "sm" mode an hamburger menu is shown, this state is used to open it
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Popover detail content
  const PopoverContent = (
    <>
      <Button type="link" onClick={() => router.push(Routes.Me)}>
        {t('components.header.popover.profile')}
      </Button>
      {isWalletConnected && (
        <Button type="link" onClick={() => disconnect(blockchain)}>
          {t('components.header.popover.disconnect')}
        </Button>
      )}
      {isAuthenticated && (
        <Button type="link" onClick={signOut}>
          {t('components.header.popover.logout')}
        </Button>
      )}
    </>
  );

  return (
    <header id="header">
      {(isWalletConnected || isAuthenticated) && (
        <i className="ri ri-menu-fill" onClick={toggleDrawer} />
      )}

      <Drawer closable placement="left" visible={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        {NavLinks.map(({ route, tKey }) => (
          <Button type="link" key={route} onClick={() => router.push(route)}>
            {t(`components.header.drawer.${tKey}`)}
          </Button>
        ))}

        <img alt="Site logo" src={logo} />
      </Drawer>

      <img className="logo" alt="Site logp" src={logo} onClick={() => router.push(Routes.Home)} />

      {(isWalletConnected || isAuthenticated) && (
        <Popover content={PopoverContent}>
          <img className="avatar" alt="Avatar image" src="/avatar.png" />
        </Popover>
      )}
    </header>
  );
};

export default Header;
