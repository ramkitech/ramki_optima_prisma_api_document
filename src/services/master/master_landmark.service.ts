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

const URL = 'master/landmark';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterLandmark Interface
export interface MasterLandmark extends Record<string, unknown> {
  // Primary Fields
  master_landmark_id: string;

  landmark_name: string;
  landmark_code: string;
  landmark_type: LandmarkType;

  address: string;
  latitude?: number;
  longitude?: number;
  google_location?: string;
  pincode: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  master_state_id: string;
  MasterState?: MasterState;

  // Relations - Child

  // Count
  _count?: {
   
  };
}

// ✅ MasterLandmark Create/Update Schema
export const MasterLandmarkSchema = z.object({
  master_state_id: single_select_mandatory('MasterState'), // ✅ Single-selection -> MasterState
  landmark_name: stringMandatory('Landmark Name', 3, 100),
  landmark_code: stringMandatory('Landmark Code', 2, 100),
  landmark_type: enumMandatory(
    'Landmark Type',
    LandmarkType,
    LandmarkType.PlantGate,
  ),
  address: stringMandatory('Address', 3, 100),
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: z.string().optional(),
  pincode: z.number().optional(),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterLandmarkDTO = z.infer<typeof MasterLandmarkSchema>;

// ✅ MasterLandmark Query Schema
export const MasterLandmarkQuerySchema = BaseQuerySchema.extend({
  master_state_ids: multi_select_optional('MasterState'), // ✅ Multi-selection -> MasterState
  master_landmark_ids: multi_select_optional('MasterLandmark'), // ✅ Multi-selection -> MasterLandmark
  landmark_type: enumArrayOptional(
    'Landmark Type',
    LandmarkType,
    getAllEnums(LandmarkType),
  ),
});
export type MasterLandmarkQueryDTO = z.infer<typeof MasterLandmarkQuerySchema>;

// Convert existing data to a payload structure
export const toMasterLandmarkPayload = (row: MasterLandmark): MasterLandmarkDTO => ({
  master_state_id: row.master_state_id,
  landmark_name: row.landmark_name,
  landmark_code: row.landmark_code,
  status: Status.Active,
  landmark_type: LandmarkType.PlantGate,
  address: row.address
});

// Generate a new payload with default values
export const newMasterLandmarkPayload = (): MasterLandmarkDTO => ({
  master_state_id: '',
  landmark_name: '',
  landmark_code: '',
  status: Status.Active,
  landmark_type: LandmarkType.PlantGate,
  address: ''
});

// API Methods
export const findMasterLandmark = async (data: MasterLandmarkQueryDTO): Promise<FBR<MasterLandmark[]>> => {
  return apiPost<FBR<MasterLandmark[]>, MasterLandmarkQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterLandmark = async (data: MasterLandmarkDTO): Promise<SBR> => {
  return apiPost<SBR, MasterLandmarkDTO>(ENDPOINTS.create, data);
};

export const updateMasterLandmark = async (id: string, data: MasterLandmarkDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterLandmarkDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterLandmark = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


