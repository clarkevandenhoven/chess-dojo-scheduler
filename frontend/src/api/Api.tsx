import { createContext, ReactNode, useContext, useMemo } from 'react';

import { useAuth } from '../auth/Auth';

import { User } from '../database/user';
import { Event } from '../database/event';
import { Requirement, TimelineEntry } from '../database/requirement';

import {
    AdminApiContextType,
    adminListUsers,
    adminGetStatistics,
    adminListRequirements,
} from './adminApi';
import {
    UserApiContextType,
    getUser,
    getUserPublic,
    listUsersByCohort,
    searchUsers,
    updateUser,
    updateUserProgress,
    graduate,
    updateUserTimeline,
    getUserStatistics,
    checkUserAccess,
    listUserTimeline,
} from './userApi';
import {
    GameApiContextType,
    CreateGameRequest,
    createGame,
    getGame,
    listGamesByCohort,
    listGamesByOwner,
    listFeaturedGames,
    createComment,
    featureGame,
    updateGame,
    deleteGame,
    listGamesByOpening,
} from './gameApi';
import {
    RequirementApiContextType,
    getRequirement,
    listRequirements,
    setRequirement,
} from './requirementApi';
import {
    GraduationApiContextType,
    listGraduationsByCohort,
    listGraduationsByOwner,
    listGraduationsByDate,
} from './graduationApi';
import {
    bookEvent,
    cancelEvent,
    deleteEvent,
    EventApiContextType,
    getEvent,
    listEvents,
    setEvent,
} from './eventApi';
import { getCourse, listCourses, OpeningApiContextType } from './openingApi';
import {
    getLeaderboard,
    OpenClassicalRegistrationRequest,
    registerForOpenClassical,
    TimeControl,
    TimePeriod,
    TournamentApiContextType,
} from './tournamentApi';
import { TournamentType } from '../database/tournament';
import {
    NotificationApiContextType,
    listNotifications,
    deleteNotification,
} from './notificationApi';

/**
 * ApiContextType defines the interface of the API as available through ApiProvider.
 */
type ApiContextType = AdminApiContextType &
    UserApiContextType &
    EventApiContextType &
    GameApiContextType &
    RequirementApiContextType &
    GraduationApiContextType &
    OpeningApiContextType &
    TournamentApiContextType &
    NotificationApiContextType;

const ApiContext = createContext<ApiContextType>(null!);

/**
 * @returns The current ApiContext value.
 */
export function useApi() {
    return useContext(ApiContext);
}

/**
 * ApiProvider provides access to API calls. It implements the ApiContextType interface.
 * ApiProvider must be a child of AuthProvider.
 * @param param0 React props. The only used prop is children.
 * @returns An ApiContext.Provider wrapping the provided children.
 */
export function ApiProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();
    const idToken = auth.user?.cognitoUser?.session?.idToken.jwtToken ?? '';

    const value = useMemo(() => {
        return {
            adminListUsers: (startKey?: string) => adminListUsers(idToken, startKey),
            adminGetStatistics: () => adminGetStatistics(idToken),
            adminListRequirements: (startKey?: string) =>
                adminListRequirements(idToken, startKey),

            checkUserAccess: () => checkUserAccess(idToken),
            getUser: () => getUser(idToken),
            getUserPublic: (username: string) => getUserPublic(username),
            listUserTimeline: (owner: string, startKey?: string) =>
                listUserTimeline(idToken, owner, startKey),
            listUsersByCohort: (cohort: string, startKey?: string) =>
                listUsersByCohort(idToken, cohort, startKey),
            searchUsers,
            updateUser: (update: Partial<User>, autopickCohort?: boolean) =>
                updateUser(idToken, update, auth.updateUser, autopickCohort),
            updateUserProgress: (
                cohort: string,
                requirementId: string,
                incrementalCount: number,
                incrementalMinutesSpent: number
            ) =>
                updateUserProgress(
                    idToken,
                    cohort,
                    requirementId,
                    incrementalCount,
                    incrementalMinutesSpent,
                    auth.updateUser
                ),
            updateUserTimeline: (
                requirementId: string,
                cohort: string,
                updated: TimelineEntry[],
                deleted: TimelineEntry[],
                count: number,
                minutesSpent: number
            ) =>
                updateUserTimeline(
                    idToken,
                    requirementId,
                    cohort,
                    updated,
                    deleted,
                    count,
                    minutesSpent,
                    auth.updateUser
                ),
            graduate: (comments: string) => graduate(idToken, comments, auth.updateUser),
            getUserStatistics: () => getUserStatistics(),

            bookEvent: (id: string, startTime?: Date, type?: string) =>
                bookEvent(idToken, id, startTime, type),
            cancelEvent: (id: string) => cancelEvent(idToken, id),
            deleteEvent: (id: string) => deleteEvent(idToken, id),
            getEvent: (id: string) => getEvent(idToken, id),
            listEvents: (startKey?: string) => listEvents(idToken, startKey),
            setEvent: (event: Event) => setEvent(idToken, event),

            createGame: (req: CreateGameRequest) => createGame(idToken, req),
            getGame: (cohort: string, id: string) => getGame(idToken, cohort, id),
            featureGame: (cohort: string, id: string, featured: string) =>
                featureGame(idToken, cohort, id, featured),
            updateGame: (cohort: string, id: string, req: CreateGameRequest) =>
                updateGame(idToken, cohort, id, req),
            deleteGame: (cohort: string, id: string) => deleteGame(idToken, cohort, id),
            listGamesByCohort: (
                cohort: string,
                startKey?: string,
                startDate?: string,
                endDate?: string
            ) => listGamesByCohort(idToken, cohort, startKey, startDate, endDate),
            listGamesByOwner: (
                owner?: string,
                startKey?: string,
                startDate?: string,
                endDate?: string,
                player?: string,
                color?: string
            ) =>
                listGamesByOwner(
                    idToken,
                    owner,
                    startKey,
                    startDate,
                    endDate,
                    player,
                    color
                ),
            listGamesByOpening: (
                eco: string,
                startKey?: string,
                startDate?: string,
                endDate?: string
            ) => listGamesByOpening(idToken, eco, startKey, startDate, endDate),
            listFeaturedGames: (startKey?: string) =>
                listFeaturedGames(idToken, startKey),
            createComment: (cohort: string, id: string, content: string) =>
                createComment(idToken, auth.user!, cohort, id, content),

            getRequirement: (id: string) => getRequirement(idToken, id),
            listRequirements: (
                cohort: string,
                scoreboardOnly: boolean,
                startKey?: string
            ) => listRequirements(idToken, cohort, scoreboardOnly, startKey),
            setRequirement: (requirement: Requirement) =>
                setRequirement(idToken, requirement),

            listGraduationsByCohort: (cohort: string, startKey?: string) =>
                listGraduationsByCohort(idToken, cohort, startKey),
            listGraduationsByOwner: (username: string, startKey?: string) =>
                listGraduationsByOwner(idToken, username, startKey),
            listGraduationsByDate: (startKey?: string) =>
                listGraduationsByDate(idToken, startKey),

            getCourse: (id: string) => getCourse(idToken, id),
            listCourses: (startKey?: string) => listCourses(idToken, startKey),

            getLeaderboard: (
                timePeriod: TimePeriod,
                tournamentType: TournamentType,
                timeControl: TimeControl,
                date: string
            ) => getLeaderboard(timePeriod, tournamentType, timeControl, date),
            registerForOpenClassical: (req: OpenClassicalRegistrationRequest) =>
                registerForOpenClassical(idToken, req),

            listNotifications: (startKey?: string) =>
                listNotifications(idToken, startKey),
            deleteNotification: (id: string) => deleteNotification(idToken, id),
        };
    }, [idToken, auth.user, auth.updateUser]);

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
