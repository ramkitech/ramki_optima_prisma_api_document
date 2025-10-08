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
import { MasterRegion } from './master_region.service';
import { MasterState } from './master_state.service';
import { MasterCity } from './master_city.service';

const URL = 'master/plant';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterPlant Interface
export interface MasterPlant extends Record<string, unknown> {
  // Primary Fields
  master_plant_id: string;

  plant_name: string;
  plant_code: string;
  plant_address: string; 

  latitude?: number;
  longitude?: number;

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
  // MasterSTT: MasterSTT[];
  // MasterSTTPincode: MasterSTTPincode[];
  // Trips: Trip[];
  // FTLDispatchInvoice: FTLDispatchInvoice[];
  // FTLDispatchTrip: FTLDispatchTrip[];
  // PTLShipment: PTLShipment[];

  // Count
  _count?: {
    MasterSTT: number;
    MasterSTTPincode: number;
    Trips: number;
    FTLDispatchInvoice: number;
    FTLDispatchTrip: number;
    PTLShipment: number;
  };
}

// ✅ MasterPlant Create/Update Schema
export const MasterPlantSchema = z.object({
  master_region_id: single_select_mandatory('MasterRegion'), // ✅ Single-selection -> MasterRegion
  master_state_id: single_select_mandatory('MasterState'), // ✅ Single-selection -> MasterState
  master_city_id: single_select_mandatory('MasterCity'), // ✅ Single-selection -> MasterCity
  plant_name: stringMandatory('Plant Name', 3, 100),
  plant_code: stringMandatory('Plant code', 3, 100),
  plant_address: stringMandatory('Plant Address', 3, 100),

  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterPlantDTO = z.infer<typeof MasterPlantSchema>;

// ✅ MasterPlant Query Schema
export const MasterPlantQuerySchema = BaseQuerySchema.extend({
  master_region_ids: multi_select_optional('MasterRegion'), // ✅ Multi-selection -> MasterRegion
  master_state_ids: multi_select_optional('MasterState'), // ✅ Multi-selection -> MasterState
  master_city_ids: multi_select_optional('MasterCity'), // ✅ Multi-selection -> MasterCity
  master_plant_ids: multi_select_optional('MasterPlant'), // ✅ Multi-selection -> MasterPlant
});
export type MasterPlantQueryDTO = z.infer<typeof MasterPlantQuerySchema>;

// Convert existing data to a payload structure
export const toMasterPlantPayload = (row: MasterPlant): MasterPlantDTO => ({
  master_region_id: row.master_region_id,
  master_state_id: row.master_state_id,
  master_city_id: row.master_city_id,
  plant_name: row.plant_name,
  plant_code: row.plant_code,
  plant_address: row.plant_address,
  status: Status.Active
});

// Generate a new payload with default values
export const newMasterPlantPayload = (): MasterPlantDTO => ({
  master_region_id: '',
  master_state_id: '',
  master_city_id: '',
  plant_name: '',
  plant_code: '',
  plant_address: '',
  status: Status.Active
});

// API Methods
export const findMasterPlant = async (data: MasterPlantQueryDTO): Promise<FBR<MasterPlant[]>> => {
  return apiPost<FBR<MasterPlant[]>, MasterPlantQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterPlant = async (data: MasterPlantDTO): Promise<SBR> => {
  return apiPost<SBR, MasterPlantDTO>(ENDPOINTS.create, data);
};

export const updateMasterPlant = async (id: string, data: MasterPlantDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterPlantDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterPlant = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


