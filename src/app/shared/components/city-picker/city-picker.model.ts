export interface CityPickerColumn {
  name?: string;
  code?: string;
  pcode?: string;
  children?: Array<CityPickerColumn>;
}
