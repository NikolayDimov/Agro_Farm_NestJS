export class FarmAllDto {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  deleted: Date;
  country: {
    id: number;
    name: string;
    created: Date;
    updated: Date;
    deleted: Date;
  };
  //   fields: {
  //     name: string;
  //   };
}
