// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  enumMandatory,
  stringMandatory,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status } from 'src/core/EnumsApp';

//Other Models

const URL = 'master/delay_reason';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterDelayReason Interface
export interface MasterDelayReason extends Record<string, unknown> {
  // Primary Fields
  master_delay_reason_id: string;

  reason_code: string;
  reason_name: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent

  // Relations - Child
  // ftl_dispatch_invoices: FTLDispatchInvoice[];

  // Count
  _count?: {
    ftl_dispatch_invoices: number;
  };
}

// ✅ MasterDelayReason Create/Update Schema
export const MasterDelayReasonSchema = z.object({
  reason_code: stringMandatory('Reason Code', 3, 100),
  reason_name: stringMandatory('Reason Name', 3, 100),
  description: stringMandatory('Description', 3, 200),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDelayReasonDTO = z.infer<typeof MasterDelayReasonSchema>;

// ✅ MasterDelayReason Query Schema
export const MasterDelayReasonQuerySchema = BaseQuerySchema.extend({
  master_delay_reason_ids: z.array(z.string()).optional(),
});
export type MasterDelayReasonQueryDTO = z.infer<
  typeof MasterDelayReasonQuerySchema
>;


// Convert existing data to a payload structure
export const toMasterDelayReasonPayload = (row: MasterDelayReason): MasterDelayReasonDTO => ({
  reason_code: row.reason_code,
  reason_name: row.reason_name,
  description: row.description || '',
  status: Status.Active
});

// Generate a new payload with default values
export const newMasterDelayReasonPayload = (): MasterDelayReasonDTO => ({
  reason_code: '',
  reason_name: '',
  description: '',
  status: Status.Active
});

// API Methods
export const findMasterDelayReason = async (data: MasterDelayReasonQueryDTO): Promise<FBR<MasterDelayReason[]>> => {
  return apiPost<FBR<MasterDelayReason[]>, MasterDelayReasonQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDelayReason = async (data: MasterDelayReasonDTO): Promise<SBR> => {
  return apiPost<SBR, MasterDelayReasonDTO>(ENDPOINTS.create, data);
};

export const updateMasterDelayReason = async (id: string, data: MasterDelayReasonDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterDelayReasonDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterDelayReason = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


