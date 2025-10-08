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
import { AllowLogin, OrganisationRole, Status, UserTransporterType } from 'src/core/EnumsApp';
import { Trip } from '../trip/trip_service';

//Other Models

const URL = 'users/user_transporter';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// UserTransporter Interface
export interface UserTransporter extends Record<string, unknown> {
  // Primary Fields
  user_transporter_id: string;

  transporter_type: UserTransporterType;
  transporter_code: string;
  transporter_name: string;
  transporter_combined_name: string;
  transporter_mobile: string;
  transporter_email: string;
  transporter_cc_email: string;
  allow_login: AllowLogin;

  username: string;
  password: string;

  gstin?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent

  // Relations - Child
  trips: Trip[];
  // FTLDispatchInvoice: FTLDispatchInvoice[];
  // FTLDispatchTrip: FTLDispatchTrip[];
  // PTLShipment: PTLShipment[];

  // Count
  _count?: {
    trips: number;
    FTLDispatchInvoice: number;
    FTLDispatchTrip: number;
    PTLShipment: number;
  };
}

// ✅ UserTransporter Create/Update Schema
export const UserTransporterSchema = z.object({
  transporter_type: enumMandatory(
    'UserTransporterType',
    UserTransporterType,
    UserTransporterType.FTL,
  ),
  transporter_code: stringMandatory('Transporter Code', 3, 100),
  transporter_name: stringMandatory('Transporter Name', 3, 100),
  transporter_combined_name: stringMandatory(
    'Transporter Combined Name',
    3,
    100,
  ),
  transporter_mobile: stringMandatory('Transporter Mobile', 3, 10),
  transporter_email: stringMandatory('Transporter Email', 3, 100),
  transporter_cc_email: stringMandatory('Transporter CC Email', 3, 100),
  allow_login: enumMandatory('AllowLogin', AllowLogin, AllowLogin.No),
  username: stringMandatory('User Name', 2, 20),
  password: stringMandatory('Password', 6, 10),
  gstin: stringMandatory('GSTIN', 0, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserTransporterDTO = z.infer<typeof UserTransporterSchema>;

// ✅ UserTransporter Query Schema
export const UserTransporterQuerySchema = BaseQuerySchema.extend({
  user_transporter_ids: multi_select_optional('UserTransporter'), // ✅ Multi-selection -> UserTransporter
  transporter_type: enumArrayOptional(
    'UserTransporterType',
    UserTransporterType,
    getAllEnums(UserTransporterType),
  ),
  allow_login: enumArrayOptional(
    'AllowLogin',
    AllowLogin,
    getAllEnums(AllowLogin),
  ),
});
export type UserTransporterQueryDTO = z.infer<
  typeof UserTransporterQuerySchema
>;


// Convert existing data to a payload structure
export const toUserTransporterPayload = (row: UserTransporter): UserTransporterDTO => ({
  status: Status.Active,
  transporter_type: UserTransporterType.FTL,
  allow_login: AllowLogin.Yes,
  transporter_code: row.transporter_code,
  transporter_name: row.transporter_name,
  transporter_combined_name: row.transporter_combined_name,
  transporter_mobile: row.transporter_mobile,
  transporter_email: row.transporter_email,
  transporter_cc_email: row.transporter_cc_email,
  username: row.username,
  password: row.password,
  gstin: row.gstin || '',
});

// Generate a new payload with default values
export const newUserTransporterPayload = (): UserTransporterDTO => ({
  status: Status.Active,
  transporter_type: UserTransporterType.FTL,
  allow_login: AllowLogin.Yes,
  transporter_code: '',
  transporter_name: '',
  transporter_combined_name: '',
  transporter_mobile: '',
  transporter_email: '',
  transporter_cc_email: '',
  username: '',
  password: '',
  gstin: ''
});

// API Methods
export const findUserTransporter = async (data: UserTransporterQueryDTO): Promise<FBR<UserTransporter[]>> => {
  return apiPost<FBR<UserTransporter[]>, UserTransporterQueryDTO>(ENDPOINTS.find, data);
};

export const createUserTransporter = async (data: UserTransporterDTO): Promise<SBR> => {
  return apiPost<SBR, UserTransporterDTO>(ENDPOINTS.create, data);
};

export const updateUserTransporter = async (id: string, data: UserTransporterDTO): Promise<SBR> => {
  return apiPatch<SBR, UserTransporterDTO>(ENDPOINTS.update(id), data);
};

export const deleteUserTransporter = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};