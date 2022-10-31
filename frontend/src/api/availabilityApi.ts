import axios, { AxiosResponse } from 'axios';

import { config } from '../config';
import { Availability } from '../database/availability';
import { Meeting } from '../database/meeting';

const BASE_URL = config.api.baseUrl;

/**
 * AvailabilityApiContextType provides an API for interacting with the current
 * signed-in user's availabilities.
 */
export type AvailabilityApiContextType = {
    /**
     * setAvailability saves and returns the provided Availability in the database.
     * @param availability The Availability to save.
     * @returns An AxiosResponse containing the Availability as saved in the database.
     */
    setAvailability: (
        availability: Availability
    ) => Promise<AxiosResponse<Availability, any>>;

    /**
     * getAvailabilities returns a list of the currently signed-in user's availabilities matching the provided
     * GetAvailabilityRequest object.
     * @param req The request to use when searching for availabilities.
     * @returns A list of availabilities.
     */
    // getAvailabilities: (req: GetAvailabilitiesRequest) => Promise<Availability[]>;

    /**
     * deleteAvailability deletes the provided availability from the database.
     * @param availability The availability to delete.
     * @returns An AxiosResponse containing the deleted availability.
     */
    deleteAvailability: (
        availability: Availability
    ) => Promise<AxiosResponse<Availability, any>>;

    /**
     * getPublicAvailabilities returns a list of public availabilities matching the provided
     * GetAvailabilityRequest object.
     * @param req The request to use when searching for availabilities.
     * @returns A list of availabilities matching the provided request.
     */
    // getPublicAvailabilities: (req: GetAvailabilitiesRequest) => Promise<Availability[]>;

    /**
     * Books the provided availability at the provided start times.
     * @param availability The availability that the user wants to book.
     * @param startTime The time the user wants the meeting to start.
     * @param type The type of meeting the user wants to book.
     * @returns An AxiosResponse containing the created session.
     */
    bookAvailability: (
        availability: Availability,
        startTime: Date,
        type: string
    ) => Promise<AxiosResponse<Meeting, any>>;
};

/**
 * setAvailability saves and returns the provided Availability in the database.
 * @param idToken The id token of the current signed-in user.
 * @param availability The Availability to save.
 * @returns An AxiosResponse containing the Availability as saved in the database.
 */
export function setAvailability(idToken: string, availability: Availability) {
    return axios.put<Availability>(BASE_URL + '/availability', availability, {
        headers: {
            Authorization: 'Bearer ' + idToken,
        },
    });
}

// export interface GetAvailabilitiesRequest {
//     startDate?: string;
//     endDate?: string;
//     school?: string;
//     class?: string;
//     limit?: number;
//     startKey?: string;
//     location?: AvailabilityLocation;
// }

// interface GetAvailabilitiesResponse {
//     availabilities: Availability[];
//     lastEvaluatedKey: string;
// }

/**
 * getAvailabilities returns a list of the currently signed-in user's availabilities matching the provided
 * GetAvailabilityRequest object.
 * @param idToken The id token of the current signed-in user.
 * @param req The request to use when searching for availabilities.
 * @returns A list of availabilities.
 */
// export async function getAvailabilities(idToken: string, req: GetAvailabilitiesRequest) {
//     let params = { ...req };
//     const result: Availability[] = [];

//     do {
//         const resp = await axios.get<GetAvailabilitiesResponse>(
//             BASE_URL + '/availability',
//             {
//                 params,
//                 headers: {
//                     Authorization: 'Bearer ' + idToken,
//                 },
//             }
//         );

//         result.push(...resp.data.availabilities);
//         params.startKey = resp.data.lastEvaluatedKey;
//     } while (params.startKey);

//     return result;
// }

/**
 * deleteAvailability deletes the provided availability from the database.
 * @param idToken The id token of the current signed-in user.
 * @param availability The availability to delete.
 * @returns An AxiosResponse containing the deleted availability.
 */
export function deleteAvailability(idToken: string, availability: Availability) {
    return axios.delete<Availability>(BASE_URL + `/availability/${availability.id}`, {
        headers: {
            Authorization: 'Bearer ' + idToken,
        },
    });
}

/**
 * getPublicAvailabilities returns a list of public availabilities matching the provided
 * GetAvailabilityRequest object.
 * @param idToken The id token of the current signed-in user.
 * @param req The request to use when searching for availabilities.
 * @returns A list of availabilities matching the provided request.
 */
// export async function getPublicAvailabilities(
//     idToken: string,
//     req: GetAvailabilitiesRequest
// ) {
//     let params = { ...req };
//     const result: Availability[] = [];
//     do {
//         const resp = await axios.get<GetAvailabilitiesResponse>(
//             BASE_URL + '/public/availability',
//             {
//                 params,
//                 headers:
//                     idToken.length > 0
//                         ? { Authorization: 'Bearer ' + idToken }
//                         : undefined,
//             }
//         );

//         result.push(...resp.data.availabilities);
//         params.startKey = resp.data.lastEvaluatedKey;
//     } while (params.startKey);

//     return result;
// }

/**
 * Books the provided availability at the provided start time.
 * @param idToken The id token of the current signed-in user.
 * @param availability The availability that the user wants to book.
 * @param startTime The time the user wants the meeting to start.
 * @param type The type of meeting the user wants to book
 * @returns An AxiosResponse containing the created meeting.
 */
export function bookAvailability(
    idToken: string,
    availability: Availability,
    startTime: Date,
    type: string
) {
    return axios.put<Meeting>(
        BASE_URL + '/availability/book',
        {
            owner: availability.owner,
            id: availability.id,
            startTime: startTime.toISOString(),
            type: type,
        },
        {
            headers: { Authorization: 'Bearer ' + idToken },
        }
    );
}
