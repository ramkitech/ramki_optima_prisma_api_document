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
import { AdminRole, OrganisationRole, Status, TripType } from 'src/core/EnumsApp';

//Other Models

const URL = 'users/user_organisation';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// UserOrganisation Interface
export interface UserOrganisation extends Record<string, unknown> {
  // Primary Fields
  user_organisation_id: string;

  name: string;
  designation: string;
  organisation_role: OrganisationRole;

  trip_type: TripType;

  username: string;
  mobile: string;
  email: string;
  password: string

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


// ✅ UserOrganisation Create/Update Schema
export const UserOrganisationSchema = z.object({
  name: stringMandatory('Name', 3, 100),
  designation: stringMandatory('Designation', 3, 100),
  organisation_role: enumMandatory(
    'Organisation Role',
    OrganisationRole,
    OrganisationRole.Admin,
  ),
  username: stringMandatory('User Name', 2, 20),
  email: stringMandatory('Email', 3, 100),
  mobile: stringMandatory('Mobile', 2, 10),
  password: stringMandatory('Password', 6, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserOrganisationDTO = z.infer<typeof UserOrganisationSchema>;

// ✅ UserOrganisation Query Schema
export const UserOrganisationQuerySchema = BaseQuerySchema.extend({
  user_organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_role: enumArrayOptional(
    'Organisation Role',
    OrganisationRole,
    getAllEnums(OrganisationRole),
  ),
});
export type UserOrganisationQueryDTO = z.infer<
  typeof UserOrganisationQuerySchema
>;

// Convert existing data to a payload structure
export const toUserOrganisationPayload = (row: UserOrganisation): UserOrganisationDTO => ({
  name: row.name,
  designation: row.designation,
  status: Status.Active,
  organisation_role: OrganisationRole.Admin,
  username: row.username,
  email: row.email,
  mobile: row.mobile,
  password: row.password
});

// Generate a new payload with default values
export const newUserOrganisationPayload = (): UserOrganisationDTO => ({
  name: '',
  designation: '',
  status: Status.Active,
  organisation_role: OrganisationRole.Admin,
  username: '',
  email: '',
  mobile: '',
  password: ''
});

// API Methods
export const findUserOrganisation = async (data: UserOrganisationQueryDTO): Promise<FBR<UserOrganisation[]>> => {
  return apiPost<FBR<UserOrganisation[]>, UserOrganisationQueryDTO>(ENDPOINTS.find, data);
};

export const createUserOrganisation = async (data: UserOrganisationDTO): Promise<SBR> => {
  return apiPost<SBR, UserOrganisationDTO>(ENDPOINTS.create, data);
};

export const updateUserOrganisation = async (id: string, data: UserOrganisationDTO): Promise<SBR> => {
  return apiPatch<SBR, UserOrganisationDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserOrganisation = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};