export type Country = "USA" | "Canada" | "Mexico";

export interface VenueData {
  id: string;
  name: string;
  city: string;
  country: Country;
  capacity: number;
  longitude: number;
  latitude: number;
  image: string;
}
