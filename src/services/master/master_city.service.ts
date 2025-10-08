// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  doubleOptionalLatLng,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status } from 'src/core/EnumsApp';

//Other Models
import { MasterPlant } from './master_plant.service';
import { MasterState } from './master_state.service';

const URL = 'master/city';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterCity Interface
export interface MasterCity extends Record<string, unknown> {
  // Primary Fields
  master_city_id: string;

  city_name: string;
  city_code: string;

  latitude?: number;
  longitude?: number;
  radius_km?: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  master_state_id: string;
  MasterState?: MasterState;

  // Relations - Child
  MasterPlants: MasterPlant[];
  // MasterSTT: MasterSTT[];
  // MasterVehicles: MasterVehicle[];
  // MasterTollPlazas: MasterTollPlaza[];
  // MasterPincodes: MasterPincode[];
  // UserDealers: UserDealer[];
  // FTLDispatchInvoice: FTLDispatchInvoice[];
  // PTLShipment: PTLShipment[];

  // Count
  _count?: {
    MasterPlants: number;
    MasterSTT: number;
    MasterVehicles: number;
    MasterTollPlazas: number;
    MasterPincodes: number;
    UserDealers: number;
    FTLDispatchInvoice: number;
    PTLShipment: number;
  };
}

// ✅ MasterCity Create/Update Schema
export const MasterCitySchema = z.object({
  master_state_id: single_select_mandatory('MasterState'), // ✅ Single-selection -> MasterState
  city_name: stringMandatory('City Name', 3, 100),
  city_code: stringMandatory('City Code', 2, 100),
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  radius_km: z.number().optional(),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterCityDTO = z.infer<typeof MasterCitySchema>;

// ✅ MasterCity Query Schema
export const MasterCityQuerySchema = BaseQuerySchema.extend({
  master_state_ids: multi_select_optional('MasterState'), // ✅ Multi-selection -> MasterState
  master_city_ids: multi_select_optional('MasterCity'), // ✅ Multi-selection -> MasterCity
});
export type MasterCityQueryDTO = z.infer<typeof MasterCityQuerySchema>;

// Convert existing data to a payload structure
export const toMasterCityPayload = (row: MasterCity): MasterCityDTO => ({
  master_state_id: row.master_state_id,
  city_name: row.city_name,
  city_code: row.city_code,
  status: Status.Active
});

// Generate a new payload with default values
export const newMasterCityPayload = (): MasterCityDTO => ({
  master_state_id: '',
  city_name: '',
  city_code: '',
  status: Status.Active
});

// API Methods
export const findMasterCity = async (data: MasterCityQueryDTO): Promise<FBR<MasterCity[]>> => {
  return apiPost<FBR<MasterCity[]>, MasterCityQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterCity = async (data: MasterCityDTO): Promise<SBR> => {
  return apiPost<SBR, MasterCityDTO>(ENDPOINTS.create, data);
};

export const updateMasterCity = async (id: string, data: MasterCityDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterCityDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterCity = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


