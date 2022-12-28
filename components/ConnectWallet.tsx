import { Button, Card, Modal } from 'antd';
import { useCallback } from 'react';

import { useWeb3 } from '../context/web3';
import useTranslation from '../hooks/useTranslation';
import { Blockchain } from '../schema/enum';

const ConnectWallet = () => {
 // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Retrieves the user's wallet address
  const { connect } = useWeb3();

  /**
   * Opens a confirmation modal that the user must confirm
   */
  const openConfirmModal = useCallback(
    (bc: Blockchain) =>
      Modal.confirm({
        closable: true,
        title: t('components.connect_wallet.modal.title'),
        content: (
          <div
            dangerouslySetInnerHTML={{ __html: t('components.connect_wallet.modal.description') }}
          />
        ),
        cancelText: t('components.connect_wallet.modal.cancel'),
        okText: t('components.connect_wallet.modal.accept'),
        onOk: () => connect(bc)
      }),
    [connect, t]
  );

  return (
    <Card className="wallet-login">
      <h1>{t('components.connect_wallet.title')}</h1>
      <h6>{t('components.connect_wallet.message')}</h6>
      <Button
        type="primary"
        icon={<img alt="Metamask logo" src="/metamask.png" />}
        onClick={() => openConfirmModal(Blockchain.Eth)}
      >
        {t('components.connect_wallet.metamask')}
      </Button>
      <Button
        type="primary"
        icon={<img alt="Phantom logo" src="/phantom.png" />}
        onClick={() => openConfirmModal(Blockchain.Sol)}
      >
        {t('components.connect_wallet.phantom')}
      </Button>
    </Card>
  );
};

export default ConnectWallet;
