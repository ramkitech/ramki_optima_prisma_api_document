// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  enumArrayOptional,
  getAllEnums,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { AdminRole, Status } from 'src/core/EnumsApp';

//Other Models

const URL = 'users/admin';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// UserAdmin Interface
export interface UserAdmin extends Record<string, unknown> {
  // Primary Fields
  user_admin_id: string;

  name: string;
  designation: string;
  role: AdminRole;
  username: string;
  mobile: string;
  email: string;
  password: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  // Relations - Child

  // Count
  _count?: {

  };
}

// ✅ UserAdmin Create/Update Schema
export const UserAdminSchema = z.object({
  name: stringMandatory('Name', 3, 100),
  designation: stringMandatory('Designation', 3, 100),
  role: enumMandatory('Role', AdminRole, AdminRole.MasterAdmin),

  username: stringMandatory('User Name', 2, 20),
  email: stringMandatory('Email', 2, 100),
  mobile: stringMandatory('Mobile', 2, 10),
  password: stringMandatory('Password', 6, 10),

  status: enumMandatory('Status', Status, Status.Active),
});
export type UserAdminDTO = z.infer<typeof UserAdminSchema>;

// ✅ UserAdmin Query Schema
export const UserAdminQuerySchema = BaseQuerySchema.extend({
  user_admin_ids: multi_select_optional('UserAdmin'), // ✅ Multi-Selection -> UserAdmin
  admin_role: enumArrayOptional(
    'Admin Role',
    AdminRole,
    getAllEnums(AdminRole),
  ),
});
export type UserAdminQueryDTO = z.infer<typeof UserAdminQuerySchema>;

// Convert existing data to a payload structure
export const toUserAdminPayload = (row: UserAdmin): UserAdminDTO => ({
  name: row.name,
  designation: row.designation,
  username: row.username,
  status: Status.Active,
  role: AdminRole.MasterAdmin,
  email: row.email,
  mobile: row.mobile,
  password: row.password
});

// Generate a new payload with default values
export const newUserAdminPayload = (): UserAdminDTO => ({
  name: '',
  designation: '',
  username: '',
  status: Status.Active,
  role: AdminRole.MasterAdmin,
  email: '',
  mobile: '',
  password: ''
});

// API Methods
export const findUserAdmin = async (data: UserAdminQueryDTO): Promise<FBR<UserAdmin[]>> => {
  return apiPost<FBR<UserAdmin[]>, UserAdminQueryDTO>(ENDPOINTS.find, data);
};

export const createUserAdmin = async (data: UserAdminDTO): Promise<SBR> => {
  return apiPost<SBR, UserAdminDTO>(ENDPOINTS.create, data);
};

export const updateUserAdmin = async (id: string, data: UserAdminDTO): Promise<SBR> => {
  return apiPatch<SBR, UserAdminDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserAdmin = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};