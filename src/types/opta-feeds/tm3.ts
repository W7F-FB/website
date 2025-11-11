// TM3 - Squad/Roster Feed
// Returns squad information including players, positions, nationalities, and shirt numbers

export interface TM3Response {
  teamSquads: TM3TeamSquads;
}

export interface TM3TeamSquads {
  lastUpdated?: string;
  squad: TM3Squad | TM3Squad[]; // Can be single squad or array
}

export interface TM3Squad {
  contestantId: string;
  contestantName: string;
  contestantShortName: string;
  contestantClubName: string;
  contestantCode: string;
  tournamentCalendarId: string;
  tournamentCalendarStartDate: string;
  tournamentCalendarEndDate: string;
  competitionName: string;
  competitionId: string;
  venueName: string;
  venueId: string;
  person: TM3Person | TM3Person[]; // Can be single person or array
}

export interface TM3Person {
  id: string;
  firstName?: string;
  lastName?: string;
  shortFirstName?: string;
  shortLastName?: string;
  gender?: string;
  matchName?: string;
  nationality?: string;
  nationalityId?: string;
  secondNationality?: string;
  secondNationalityId?: string;
  position?: TM3Position;
  type: string; // 'player' | 'coach' | 'assistant coach' | etc.
  placeOfBirth?: string;
  shirtNumber?: number;
  startDate?: string;
  endDate?: string;
  active?: 'yes' | 'no';
}

export type TM3Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Attacker';

