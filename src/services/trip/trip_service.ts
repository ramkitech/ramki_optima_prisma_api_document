// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  multi_select_optional,
  single_select_mandatory,
  enumArrayOptional,
  getAllEnums,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

//Enums

//Other Models
import { Status, TripStatus, YesNo } from 'src/core/EnumsApp';


const URL = 'trip';

const ENDPOINTS = {
  find: `${URL}/search`,
  create_trip: `${URL}/create_trip`,
  end_trip: `${URL}/end_trip`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Trip Interface
export interface Trip extends Record<string, unknown> {
  // Primary Fields
  trip_id: string;

  trip_status: TripStatus;

  trip_date: string;
  start_date_time: string;
  end_date_time: string;
  duration: number;
  duration_s: string;

  is_processed: YesNo;
  gps_packets_count: number;
  have_gps_trip_data: YesNo;
  trip_distance: number;
  deviation: YesNo;
  trip_remarks: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;
  
  Trip?: Trip;

  // Relations - Child

  // Count
  _count?: {
  };
}

// ✅ Trip Create Schema
export const CreateTripSchema = z.object({
  beat_id: single_select_mandatory('Master Beat'), // ✅ Single-selection -> Trip
  user_Patrolman_id: single_select_mandatory('User PatrolMan'), // ✅ Single-selection -> UserPatrolMan
});
export type CreateTripDTO = z.infer<typeof CreateTripSchema>;

// ✅ Trip End Schema
export const EndTripSchema = z.object({
  trip_id: single_select_mandatory('Trip'), // ✅ Single-selection -> Trip
});
export type EndTripDTO = z.infer<typeof EndTripSchema>;

// ✅ Trip Query Schema
export const TripQuerySchema = BaseQuerySchema.extend({
  user_Patrolman_ids: multi_select_optional('UserPatrolman'), // ✅ Multi-Selection -> UserPatrolman
  division_ids: multi_select_optional('MasterDivision'), // ✅ Multi-selection -> MasterDivision
  sub_division_ids: multi_select_optional('MasterSubDivision'), // ✅ Multi-selection -> MasterSubDivision
  section_ids: multi_select_optional('MasterSection'), // ✅ Multi-selection -> MasterSection
  sub_section_ids: multi_select_optional('MasterSubSection'), // ✅ Multi-selection -> MasterSubSection
  beat_ids: multi_select_optional('Trip'), // ✅ Multi-selection -> Trip
  trip_ids: multi_select_optional('Trip'), // ✅ Multi-selection -> Trip
  trip_status: enumArrayOptional(
    'Trip Status',
    TripStatus,
    getAllEnums(TripStatus),
  ),
  is_processed: enumArrayOptional('Is Processed', YesNo, getAllEnums(YesNo)),
  have_gps_trip_data: enumArrayOptional(
    'Have GPS Trip Data',
    YesNo,
    getAllEnums(YesNo),
  ),
  deviation: enumArrayOptional('Deviation', YesNo, getAllEnums(YesNo)),
});
export type TripQueryDTO = z.infer<typeof TripQuerySchema>;

// Convert existing data to a payload structure
export const toTripPayload = (row: Trip): EndTripDTO => ({
  trip_id: row.trip_id,
});

// Generate a new payload with default values
export const newTripPayload = (): CreateTripDTO => ({
  beat_id: '',
  user_Patrolman_id: ''
});

// API Methods
export const findTrip = async (data: TripQueryDTO): Promise<FBR<Trip[]>> => {
  return apiPost<FBR<Trip[]>, TripQueryDTO>(ENDPOINTS.find, data);
};

export const createTrip = async (data: CreateTripDTO): Promise<SBR> => {
  return apiPost<SBR, CreateTripDTO>(ENDPOINTS.create_trip, data);
};

export const endTrip = async (id: string, data: EndTripDTO): Promise<SBR> => {
  return apiPatch<SBR, EndTripDTO>(ENDPOINTS.end_trip, data);
};

export const deleteTrip = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};


