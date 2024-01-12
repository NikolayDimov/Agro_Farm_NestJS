import { CreateFarmDto } from './dtos/create-farm.dto';
import { Farm } from './farm.entity';
import { Country } from '../country/country.entity';
import { uuid } from 'uuid';

export function mapCreateFarmDtoToFarm(createFarmDto: CreateFarmDto, country: Country): Farm {
  const id = uuid.v4(); // Generate a unique ID for the farm

  return {
    id,
    name: createFarmDto.name,
    country,
    created: new Date(),
    updated: new Date(),
    deleted: new Date(),
    fields: [],
  };
}
