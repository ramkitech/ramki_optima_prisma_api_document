// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  numberOptional,
  stringMandatory,
  doubleOptionalLatLng,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status } from 'src/core/EnumsApp';

//Other Models
import { MasterCity } from './master_city.service';
import { MasterState } from './master_state.service';

const URL = 'master/toll_plaza';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterTollPlaza Interface
export interface MasterTollPlaza extends Record<string, unknown> {
  // Primary Fields
  master_toll_plaza_id: string;

  toll_plaza_name: string;
  toll_plaza_code: string;
  address: string;
  nh_no: number;

  latitude?: number;
  longitude?: number;
  location?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  master_city_id: string;
  MasterCity?: MasterCity;

  master_state_id: string;
  MasterState?: MasterState;

  // Relations - Child


  // Count
  _count?: {
    
  };
}

// ✅ MasterTollPlaza Create/Update Schema
export const MasterTollPlazaSchema = z.object({
  master_city_id: single_select_mandatory('MasterCity'), // ✅ Single-selection -> MasterPlant
  master_state_id: single_select_mandatory('MasterState'), // ✅ Single-selection -> MasterState
  toll_plaza_name: stringMandatory('Toll Plaza Name', 3, 100),
  toll_plaza_code: stringMandatory('Toll Plaza Code', 2, 100),
  address: stringMandatory('Address', 3, 100),
  nh_no: numberOptional('NH No'),
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  location: z.string().max(500).optional(),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTollPlazaDTO = z.infer<typeof MasterTollPlazaSchema>;

// ✅ MasterTollPlaza Query Schema
export const MasterTollPlazaQuerySchema = BaseQuerySchema.extend({
  master_city_ids: multi_select_optional('MasterCity'), // ✅ Multi-selection -> MasterCity
  master_state_ids: multi_select_optional('MasterState'), // ✅ Multi-selection -> MasterState
  master_toll_plaza_ids: multi_select_optional('MasterTollPlaza'), // ✅ Multi-selection -> MasterTollPlaza
});
export type MasterTollPlazaQueryDTO = z.infer<
  typeof MasterTollPlazaQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterTollPlazaPayload = (row: MasterTollPlaza): MasterTollPlazaDTO => ({
  master_city_id: row.master_city_id,
  master_state_id: row.master_state_id,
  toll_plaza_name: row.toll_plaza_name,
  toll_plaza_code: row.toll_plaza_code,
  address: row.address,
  status: Status.Active,
  nh_no: row.nh_no
});

// Generate a new payload with default values
export const newMasterTollPlazaPayload = (): MasterTollPlazaDTO => ({
  master_city_id: '',
  master_state_id: '',
  toll_plaza_name: '',
  toll_plaza_code: '',
  address: '',
  status: Status.Active,
  nh_no: 0
});

// API Methods
export const findMasterTollPlaza = async (data: MasterTollPlazaQueryDTO): Promise<FBR<MasterTollPlaza[]>> => {
  return apiPost<FBR<MasterTollPlaza[]>, MasterTollPlazaQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterTollPlaza = async (data: MasterTollPlazaDTO): Promise<SBR> => {
  return apiPost<SBR, MasterTollPlazaDTO>(ENDPOINTS.create, data);
};

export const updateMasterTollPlaza = async (id: string, data: MasterTollPlazaDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterTollPlazaDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTollPlaza = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


