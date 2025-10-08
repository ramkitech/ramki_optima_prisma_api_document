// Axios
import { apiPost } from '../../core/apiCall';
import { BR, SBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
} from '../../zod_utils/zod_utils';

//Enums

//Other Models
import { UserAdmin } from './user_admin.service';

const URL = 'users/auth';

const ENDPOINTS = {
  admin_login: `${URL}/admin_login`,
  officer_login: `${URL}/officer_login`,
  patrolman_login: `${URL}/patrolman_login`,
  patrolman_signup: `${URL}/patrolman_signup`,
};

export interface AdminResponse extends Record<string, unknown> {
  access_token: string;
  user: UserAdmin;
}

export const LoginAdminSchema = z.object({
  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 10),
});
export type LoginAdminDTO = z.infer<typeof LoginAdminSchema>;

export const LoginOfficerSchema = z.object({
  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 10),
});
export type LoginOfficerDTO = z.infer<typeof LoginOfficerSchema>;

export const LoginPatrolmanSchema = z.object({
  identifier: stringMandatory('Identifier', 3, 100),
  password: stringMandatory('Password', 3, 10),
});
export type LoginPatrolmanDTO = z.infer<typeof LoginPatrolmanSchema>;

// API Methods
export const admin_login = async (data: LoginAdminDTO): Promise<BR<AdminResponse>> => {
  return apiPost<BR<AdminResponse>, LoginAdminDTO>(ENDPOINTS.admin_login, data);
};