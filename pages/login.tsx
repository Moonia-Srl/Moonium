import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Form, notification } from 'antd';
import type { NextPage } from 'next';
import Router from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useTranslation from '../hooks/useTranslation';

import SEO from '../components/SEO';
import { useAuth } from '../context/auth';
import useProject from '../hooks/useProject';
import { Metadata } from '../schema/const';
import { Routes } from '../schema/enum';
import { LoginForm, LoginFormSchema } from '../schema/form';

const MePage: NextPage = () => {
 // Get a reference to the i18n translate function
  const { t } = useTranslation();
  // Get a reference to the current project
  const { project } = useProject();
  // Get the auth admin and helper methods from the context
  const { admin, signIn, loading, error } = useAuth();

  // prettier-ignore
  const { formState: { errors }, handleSubmit, register } = useForm<LoginForm>({
    // React Hook Form configuration
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(LoginFormSchema(t))
  });

  /**
   * Opens an error notification if authentication has failed
   */
  useEffect(() => {
    if (!!error) notification.error({ message: t('errors.title'), description: error });
    if (admin !== null) Router.push(Routes.Admin);
  }, [admin, error, t]);

  return (
    <div id="login" className="page">
      <SEO title="Login" />

      <main>
        <Card>
          <Form size="large" layout="vertical">
            <Col xs={24} className="header">
              <img alt="Site logo" src={project?.env.logo ?? Metadata.logo} />
              <h1>{t('pages.login.title')}</h1>
            </Col>

            <Form.Item
              label={t('pages.login.form.email')}
              validateStatus={errors.email && 'error'}
              help={errors.email?.message}
            >
              <input className="ant-input ant-input-lg" {...register('email')} />
            </Form.Item>

            <Form.Item
              label={t('pages.login.form.password')}
              validateStatus={errors.password && 'error'}
              help={errors.password?.message}
            >
              <input type="password" className="ant-input ant-input-lg" {...register('password')} />
            </Form.Item>

            <div className="footer">
              <Button loading={loading} type="primary" onClick={handleSubmit(signIn)}>
                {t('pages.login.form.submit')}
              </Button>
            </div>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default MePage;
