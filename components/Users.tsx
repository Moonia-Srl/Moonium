import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import useTranslation from '../hooks/useTranslation';
import { UserFormSchema, UserInfo } from '../schema/form';
import { User } from '../schema/interfaces';

type FormProps = {
  init?: Partial<User>;
  onSubmit: (patch: Partial<User>) => void | Promise<void>;
};

const UserForm = ({ init, onSubmit }: FormProps) => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();

  // prettier-ignore
  const { formState: { errors }, handleSubmit, register, reset } = useForm<UserInfo>({
    // React Hook Form configuration
    mode: 'onChange',
    defaultValues: { name: '', surname: '', email: '', phone: '' },
    resolver: yupResolver(UserFormSchema(t))
  });

  // Updates the form data when the "init" prop (the seed of the form) changes data
  useEffect(() => (!!init ? reset(init) : undefined), [init, reset]);

  return (
    <Form size="large" layout="vertical">
      <div className="header">
        <h5>{t('pages.me.form.title')}</h5>
      </div>

      <Form.Item
        label={t('pages.me.form.name')}
        validateStatus={errors.name && 'error'}
        help={errors.name?.message}
      >
        <input className="ant-input ant-input-lg" {...register('name')} />
      </Form.Item>

      <Form.Item
        label={t('pages.me.form.surname')}
        validateStatus={errors.surname && 'error'}
        help={errors.surname?.message}
      >
        <input className="ant-input ant-input-lg" {...register('surname')} />
      </Form.Item>

      <Form.Item
        label={t('pages.me.form.email')}
        validateStatus={errors.email && 'error'}
        help={errors.email?.message}
      >
        <input className="ant-input ant-input-lg" {...register('email')} />
      </Form.Item>

      <Form.Item
        label={t('pages.me.form.phone')}
        validateStatus={errors.phone && 'error'}
        help={errors.phone?.message}
      >
        <input className="ant-input ant-input-lg" {...register('phone')} />
      </Form.Item>

      <div className="footer">
        <Button type="primary" onClick={handleSubmit(onSubmit)}>
          {t('pages.me.form.submit')}
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
