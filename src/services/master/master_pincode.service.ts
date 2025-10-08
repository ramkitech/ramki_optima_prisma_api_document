// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringMandatory,
  enumArrayOptional,
  getAllEnums,
  doubleOptionalLatLng,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { LandmarkType, Status, VehicleType } from 'src/core/EnumsApp';

//Other Models
import { MasterState } from './master_state.service';
import { MasterRegion } from './master_region.service';
import { MasterCity } from './master_city.service';

const URL = 'master/pincode';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterPincode Interface
export interface MasterPincode extends Record<string, unknown> {
  // Primary Fields
  master_pincode_id: string;

  pincode: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  master_region_id: string;
  MasterRegion?: MasterRegion;

  master_state_id: string;
  MasterState?: MasterState;

  master_city_id: string;
  MasterCity?: MasterCity;

  // Relations - Child

  // Count
  _count?: {
   
  };
}


// ✅ MasterPincode Create/Update Schema
export const MasterPincodeSchema = z.object({
  master_region_id: single_select_mandatory('MasterRegion'), // ✅ Single-selection -> MasterRegion
  master_state_id: single_select_mandatory('MasterState'), // ✅ Single-selection -> MasterState
  master_city_id: single_select_mandatory('MasterCity'), // ✅ Single-selection -> MasterCity
  pincode: z.number().min(100000, { message: 'Invalid Pincode' }),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterPincodeDTO = z.infer<typeof MasterPincodeSchema>;

// ✅ MasterPincode Query Schema
export const MasterPincodeQuerySchema = BaseQuerySchema.extend({
  master_region_ids: multi_select_optional('MasterRegion'), // ✅ Multi-selection -> MasterRegion
  master_state_ids: multi_select_optional('MasterState'), // ✅ Multi-selection -> MasterState
  master_city_ids: multi_select_optional('MasterCity'), // ✅ Multi-selection -> MasterCity
  master_pincode_ids: multi_select_optional('MasterPincode'), // ✅ Multi-selection -> MasterPincode
});
export type MasterPincodeQueryDTO = z.infer<typeof MasterPincodeQuerySchema>;


// Convert existing data to a payload structure
export const toMasterPincodePayload = (row: MasterPincode): MasterPincodeDTO => ({
  master_region_id: row.master_region_id,
  master_state_id: row.master_state_id,
  master_city_id: row.master_city_id,
  pincode: row.pincode,
  status: Status.Active
});

// Generate a new payload with default values
export const newMasterPincodePayload = (): MasterPincodeDTO => ({
  master_region_id: '',
  master_state_id: '',
  master_city_id: '',
  pincode: 0,
  status: Status.Active
});

// API Methods
export const findMasterPincode = async (data: MasterPincodeQueryDTO): Promise<FBR<MasterPincode[]>> => {
  return apiPost<FBR<MasterPincode[]>, MasterPincodeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterPincode = async (data: MasterPincodeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterPincodeDTO>(ENDPOINTS.create, data);
};

export const updateMasterPincode = async (id: string, data: MasterPincodeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterPincodeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterPincode = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


