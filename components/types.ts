export type Station = {
  name: string;
  lon: number;
  lat: number;
  id: number;
};

export type StationNotes = {
  key: string;
  priority: string;
  text: string;
};

interface StationDetailsBase {
  train: string;
  stopId: number;
  stopName: string;
  lat: string;
  lon: string;
  type: string;
  operator: string;
  notes: StationNotes[];
}
interface StationDetailsDeparture extends StationDetailsBase {
  depTime: string;
  arrTime?: never;
}
interface StationDetailsArrival extends StationDetailsBase {
  depTime?: never;
  arrTime: string;
}
export type StationDetails = StationDetailsDeparture | StationDetailsArrival;

export type TrainDetails = StationDetails[];

export type Train = {
  boardId: number;
  dateTime: string;
  detailsId: string;
  direction: string;
  name: string;
  stopId: number;
  stopName: string;
  track: string;
  type: string;
  details?: TrainDetails;
};

export type TrainWithDetails = {
  boardId: number;
  dateTime: string;
  detailsId: string;
  direction: string;
  name: string;
  stopId: number;
  stopName: string;
  track: string;
  type: string;
  details: TrainDetails;
};

export type ApiCredentials = {
  id: string;
  secret: string;
};
