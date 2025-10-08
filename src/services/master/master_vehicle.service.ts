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
  enumArrayOptional,
  getAllEnums,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums
import { Status, VehicleType } from 'src/core/EnumsApp';

//Other Models
import { MasterCity } from './master_city.service';
import { Trip } from '../trip/trip_service';

const URL = 'master/vehicle';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterVehicle Interface
export interface MasterVehicle extends Record<string, unknown> {
  // Primary Fields
  master_vehicle_id: string;

  vehicle_number: string;
  vehicle_type: VehicleType;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  master_city_id: string;
  MasterCity?: MasterCity;

  // Relations - Child
  Trips: Trip[];
  // FTLDispatchInvoice: FTLDispatchInvoice[];
  // FTLDispatchTrip: FTLDispatchTrip[];

  // Count
  _count?: {
    Trips: number;
    FTLDispatchInvoice: number;
    FTLDispatchTrip: number;
  };
}

// ✅ MasterVehicle Create/Update Schema
export const MasterVehicleSchema = z.object({
  master_city_id: single_select_mandatory('MasterCity'), // ✅ Single-selection -> MasterCity
  vehicle_number: stringMandatory('Vehicle Number', 3, 100),
  vehicle_type: enumMandatory('Vehicle Type', VehicleType, VehicleType.Truck),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleDTO = z.infer<typeof MasterVehicleSchema>;

// ✅ MasterVehicle Query Schema
export const MasterVehicleQuerySchema = BaseQuerySchema.extend({
  master_city_ids: multi_select_optional('MasterCity'), // ✅ Multi-selection -> MasterCity
  master_vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  vehicle_type: enumArrayOptional(
    'Vehicle Type',
    VehicleType,
    getAllEnums(VehicleType),
  ),
});
export type MasterVehicleQueryDTO = z.infer<typeof MasterVehicleQuerySchema>;

// Convert existing data to a payload structure
export const toMasterVehiclePayload = (row: MasterVehicle): MasterVehicleDTO => ({
  master_city_id: row.master_city_id,
  vehicle_number: row.vehicle_number,
  status: Status.Active,
  vehicle_type: VehicleType.Truck
});

// Generate a new payload with default values
export const newMasterVehiclePayload = (): MasterVehicleDTO => ({
  master_city_id: '',
  vehicle_number: '',
  status: Status.Active,
  vehicle_type: VehicleType.Truck
});

// API Methods
export const findMasterVehicle = async (data: MasterVehicleQueryDTO): Promise<FBR<MasterVehicle[]>> => {
  return apiPost<FBR<MasterVehicle[]>, MasterVehicleQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicle = async (data: MasterVehicleDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicle = async (id: string, data: MasterVehicleDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicle = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


