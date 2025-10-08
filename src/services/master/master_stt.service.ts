// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  enumArrayOptional,
  getAllEnums,
  numberOptional,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status, TransportType } from 'src/core/EnumsApp';

//Other Models
import { MasterPlant } from './master_plant.service';
import { MasterCity } from './master_city.service';

const URL = 'master/stt';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterSTT Interface
export interface MasterSTT extends Record<string, unknown> {
  // Primary Fields
  master_stt_id: string;

  transport_type: TransportType;
  FTL_STT: number;
  PTL_STT: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  master_plant_id: string;
  MasterPlant?: MasterPlant;

  master_city_id: string;
  MasterCity?: MasterCity;

  // Relations - Child

  // Count
  _count?: {
   
  };
}

// ✅ MasterSTT Create/Update Schema
export const MasterSTTSchema = z.object({
  master_plant_id: single_select_mandatory('MasterPlant'), // ✅ Single-selection -> MasterPlant
  master_city_id: single_select_mandatory('MasterCity'), // ✅ Single-selection -> MasterCity
  transport_type: enumMandatory(
    'Transport Type',
    TransportType,
    TransportType.FTL,
  ),
  FTL_STT: numberOptional('FTL_STT'),
  PTL_STT: numberOptional('PTL_STT'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSTTDTO = z.infer<typeof MasterSTTSchema>;

// ✅ MasterSTT Query Schema
export const MasterSTTQuerySchema = BaseQuerySchema.extend({
  master_plant_ids: multi_select_optional('MasterPlant'), // ✅ Multi-selection -> MasterPlant
  master_city_ids: multi_select_optional('MasterCity'), // ✅ Multi-selection -> MasterCity
  master_stt_ids: multi_select_optional('MasterSTT'), // ✅ Multi-selection -> MasterSTT
  transport_type: enumArrayOptional(
    'Transport Type',
    TransportType,
    getAllEnums(TransportType),
  ),
});
export type MasterSTTQueryDTO = z.infer<typeof MasterSTTQuerySchema>;

// Convert existing data to a payload structure
export const toMasterSTTPayload = (row: MasterSTT): MasterSTTDTO => ({
  master_plant_id: row.master_plant_id,
  master_city_id: row.master_city_id,
  status: Status.Active,
  transport_type: TransportType.FTL,
  FTL_STT: row.FTL_STT,
  PTL_STT: row.PTL_STT
});

// Generate a new payload with default values
export const newMasterSTTPayload = (): MasterSTTDTO => ({
  master_plant_id: '',
  master_city_id: '',
  status: Status.Active,
  transport_type: TransportType.FTL,
  FTL_STT: 0,
  PTL_STT: 0
});

// API Methods
export const findMasterSTT = async (data: MasterSTTQueryDTO): Promise<FBR<MasterSTT[]>> => {
  return apiPost<FBR<MasterSTT[]>, MasterSTTQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterSTT = async (data: MasterSTTDTO): Promise<SBR> => {
  return apiPost<SBR, MasterSTTDTO>(ENDPOINTS.create, data);
};

export const updateMasterSTT = async (id: string, data: MasterSTTDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterSTTDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSTT = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


