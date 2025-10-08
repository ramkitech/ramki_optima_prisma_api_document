// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status } from 'src/core/EnumsApp';

//Other Models
import { Trip } from '../trip/trip_service';
import { MasterPlant } from './master_plant.service';
import { MasterState } from './master_state.service';

const URL = 'master/region';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterRegion Interface
export interface MasterRegion extends Record<string, unknown> {
  // Primary Fields
  master_region_id: string;

  region_name: string;
  region_code: string;
  circle_name: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent

  // Relations - Child
  MasterStates: MasterState[];
  MasterPlants: MasterPlant[];
  // MasterPincodes: MasterPincode[];
  // UserDealers: UserDealer[];
  // FTLDispatchInvoice: FTLDispatchInvoice[];
  // PTLShipment: PTLShipment[];

  // Count
  _count?: {
    MasterStates: number;
    MasterPlants: number;
    MasterPincodes: number;
    UserDealers: number;
    FTLDispatchInvoice: number;
    PTLShipment: number;
  };
}

// ✅ MasterRegion Create/Update Schema
export const MasterRegionSchema = z.object({
  region_name: stringMandatory('Region Name', 3, 100),
  region_code: stringMandatory('Region Code', 3, 100),
  circle_name: stringMandatory('Circle Name', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterRegionDTO = z.infer<typeof MasterRegionSchema>;

// ✅ MasterRegion Query Schema
export const MasterRegionQuerySchema = BaseQuerySchema.extend({
  master_region_ids: multi_select_optional('MasterRegion'), // ✅ Multi-selection -> MasterRegion
});
export type MasterRegionQueryDTO = z.infer<typeof MasterRegionQuerySchema>;

// Convert existing data to a payload structure
export const toMasterRegionPayload = (row: MasterRegion): MasterRegionDTO => ({
  region_name: row.region_name,
  region_code: row.region_code,
  circle_name: row.circle_name,
  status: Status.Active
});

// Generate a new payload with default values
export const newMasterRegionPayload = (): MasterRegionDTO => ({
  region_name: '',
  region_code: '',
  circle_name: '',
  status: Status.Active
});

// API Methods
export const findMasterRegion = async (data: MasterRegionQueryDTO): Promise<FBR<MasterRegion[]>> => {
  return apiPost<FBR<MasterRegion[]>, MasterRegionQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterRegion = async (data: MasterRegionDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRegionDTO>(ENDPOINTS.create, data);
};

export const updateMasterRegion = async (id: string, data: MasterRegionDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterRegionDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterRegion = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


