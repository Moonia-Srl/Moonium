import { object, SchemaOf, string } from 'yup';
import { TFunc } from '../hooks/useTranslation';

/**
 * Regex to be matched for password validation in Moonium
 * @constant
 */
const PSW_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([#?!@$%^&*-]|[]]|[[]|[_])).{10,}$/;

/**
 * Regex to be matched for phone number validation in Moonium.
 * Handles both with or without prefix as well as with or without "+" before prefix.
 * @constant
 */
const PHONE_REGEX = /(\+*)(\d{1,4})( ?)(\d{3,3})( ?)(\d{3,3})( ?)(\d{4,4})|(^$)/;

/**
 * Information needed  in order to authenticate a user on the platform
 * @typedef {LoginForm}
 * @field email - The user's email
 * @field password - The login password
 */
export type LoginForm = { email: string; password: string };

/**
 * Validation schema to be satisfied by the data available in teh form
 * @function
 * @param {TFunction} t - Translate function to translate error messages
 * @returns {SchemaOf<LoginForm>}
 */
export const LoginFormSchema = (t: TFunc): SchemaOf<LoginForm> =>
  object().shape({
    email: string()
      .required(t('forms.errors.required'))
      .email(t('forms.errors.invalid_email'))
      .trim(),
    password: string()
      .required(t('forms.errors.required'))
      .matches(PSW_REGEX, t('forms.errors.invalid_psw'))
  });

/**
 * Information needed  in order to authenticate a user on the platform
 * @typedef {UserInfo}
 * @field name - The user's name
 * @field surname - The user's surname
 * @field email - The user's email
 * @field phone - The user's phone number
 */
export type UserInfo = { name: string; surname: string; email: string; phone: string };

/**
 * Validation schema to be satisfied by the data available in teh form
 * @function
 * @param {TFunction} t - Translate function to translate error messages
 * @returns {SchemaOf<UserInfo>}
 */
export const UserFormSchema = (t: TFunc): SchemaOf<UserInfo> =>
  object().shape({
    name: string().required(t('forms.errors.required')).trim(),
    surname: string().required(t('forms.errors.required')).trim(),
    email: string()
      .required(t('forms.errors.required'))
      .email(t('forms.errors.invalid_email'))
      .trim(),
    phone: string()
      .required(t('forms.errors.required'))
      .matches(PHONE_REGEX, t('forms.errors.invalid_phone'))
      .trim()
  });
