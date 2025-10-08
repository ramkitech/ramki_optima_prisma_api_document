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
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status } from 'src/core/EnumsApp';

//Other Models
import { MasterPlant } from './master_plant.service';
import { MasterRegion } from './master_region.service';
import { MasterCity } from './master_city.service';

const URL = 'master/state';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterState Interface
export interface MasterState extends Record<string, unknown> {
  // Primary Fields
  master_state_id: string;

  state_name: string;
  state_code: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  master_region_id: string;
  MasterRegion?: MasterRegion;

  // Relations - Child
  MasterCity: MasterCity[];
  MasterPlant: MasterPlant[];
  // MasterTollPlaza: MasterTollPlaza[];
  // MasterLandmark: MasterLandmark[];
  // MasterPincode: MasterPincode[];
  // UserDealer: UserDealer[];
  // FTLDispatchInvoice: FTLDispatchInvoice[];
  // PTLShipment: PTLShipment[];

  // Count
  _count?: {
    MasterCity: number;
    MasterPlant: number;
    MasterTollPlaza: number;
    MasterLandmark: number;
    MasterPincode: number;
    UserDealer: number;
    FTLDispatchInvoice: number;
    PTLShipment: number;
  };
}


// ✅ MasterState Create/Update Schema
export const MasterStateSchema = z.object({
  master_region_id: single_select_mandatory('MasterRegion'), // ✅ Single-selection -> MasterRegion
  state_name: stringMandatory('State Name', 3, 100),
  state_code: stringMandatory('State Code', 2, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterStateDTO = z.infer<typeof MasterStateSchema>;

// ✅ MasterState Query Schema
export const MasterStateQuerySchema = BaseQuerySchema.extend({
  master_region_ids: multi_select_optional('MasterRegion'), // ✅ Multi-selection -> MasterRegion
  master_state_ids: multi_select_optional('MasterState'), // ✅ Multi-selection -> MasterState
});
export type MasterStateQueryDTO = z.infer<typeof MasterStateQuerySchema>;

// Convert existing data to a payload structure
export const toMasterStatePayload = (row: MasterState): MasterStateDTO => ({
  master_region_id: row.master_region_id,
  state_name: row.state_name,
  state_code: row.state_code,
  status: Status.Active
});

// Generate a new payload with default values
export const newMasterStatePayload = (): MasterStateDTO => ({
  master_region_id: '',
  state_name: '',
  state_code: '',
  status: Status.Active
});

// API Methods
export const findMasterState = async (data: MasterStateQueryDTO): Promise<FBR<MasterState[]>> => {
  return apiPost<FBR<MasterState[]>, MasterStateQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterState = async (data: MasterStateDTO): Promise<SBR> => {
  return apiPost<SBR, MasterStateDTO>(ENDPOINTS.create, data);
};

export const updateMasterState = async (id: string, data: MasterStateDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterStateDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterState = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


