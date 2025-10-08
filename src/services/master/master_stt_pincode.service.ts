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
  numberMandatory,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status, TransportType } from 'src/core/EnumsApp';

//Other Models
import { MasterPlant } from './master_plant.service';

const URL = 'master/stt_pincode';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterSTTPincode Interface
export interface MasterSTTPincode extends Record<string, unknown> {
  // Primary Fields
  master_stt_pincode_id: string;

  pincode: number;
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

  // Relations - Child

  // Count
  _count?: {
   
  };
}

// ✅ MasterSTTPincode Create/Update Schema
export const MasterSTTPincodeSchema = z.object({
  master_plant_id: single_select_mandatory('MasterPlant'), // ✅ Single-selection -> MasterPlant
  pincode: numberMandatory('Pincode'),
  transport_type: enumMandatory(
    'Transport Type',
    TransportType,
    TransportType.FTL,
  ),
  FTL_STT: numberOptional('FTL_STT'),
  PTL_STT: numberOptional('PTL_STT'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterSTTPincodeDTO = z.infer<typeof MasterSTTPincodeSchema>;

// ✅ MasterSTTPincode Query Schema
export const MasterSTTPincodeQuerySchema = BaseQuerySchema.extend({
  master_plant_ids: multi_select_optional('MasterPlant'), // ✅ Multi-selection -> MasterPlant
  master_stt_pincode_ids: multi_select_optional('MasterSTTPincode'), // ✅ Multi-selection -> MasterSTTPincode
  transport_type: enumArrayOptional(
    'Transport Type',
    TransportType,
    getAllEnums(TransportType),
  ),
});
export type MasterSTTPincodeQueryDTO = z.infer<
  typeof MasterSTTPincodeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterSTTPincodePayload = (row: MasterSTTPincode): MasterSTTPincodeDTO => ({
  master_plant_id: row.master_plant_id,
  status: Status.Active,
  transport_type: TransportType.FTL,
  FTL_STT: row.FTL_STT,
  PTL_STT: row.PTL_STT,
  pincode: row.pincode
});

// Generate a new payload with default values
export const newMasterSTTPincodePayload = (): MasterSTTPincodeDTO => ({
  master_plant_id: '',
  status: Status.Active,
  transport_type: TransportType.FTL,
  FTL_STT: 0,
  PTL_STT: 0,
  pincode: 0
});

// API Methods
export const findMasterSTTPincode = async (data: MasterSTTPincodeQueryDTO): Promise<FBR<MasterSTTPincode[]>> => {
  return apiPost<FBR<MasterSTTPincode[]>, MasterSTTPincodeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterSTTPincode = async (data: MasterSTTPincodeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterSTTPincodeDTO>(ENDPOINTS.create, data);
};

export const updateMasterSTTPincode = async (id: string, data: MasterSTTPincodeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterSTTPincodeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterSTTPincode = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


