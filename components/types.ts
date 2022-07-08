export type Station = {
  name: string;
  lon: number;
  lat: number;
  id: number;
}

export type StationNotes = {
  key: string,
  priority: string,
  text: string,
}

export type StationDetails = {
  train: string,
  stopId: number,
  stopName: string,
  lat: string,
  lon: string,
  depTime: string,
  type: string,
  operator: string,
  notes: StationNotes[],

}

export type TrainDetails = {

}

export type Train = {
  boardId: number,
  dateTime: string,
  detailsId: string,
  direction: string,
  name: string,
  stopId: number,
  stopName: string,
  track: string,
  type: string,
  details?: TrainDetails,
}