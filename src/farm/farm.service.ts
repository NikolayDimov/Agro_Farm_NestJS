import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Farm } from "./farm.entity";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { FarmDto } from "./dtos/farm.dto";
import { CountryService } from '../country/country.service';
import { mapCreateFarmDtoToFarm } from './mapper'; 
import { Country } from '../country/country.entity';
import { DeepPartial } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class FarmService {
    constructor(@InjectRepository(Farm) private farmRepository: Repository<Farm>,
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
    ) {}

    

    // Work with 
    // {
    //     "name": "Farm Varna",
    //     "countryId": "a793df9e-660f-450c-ad09-7698d3703b73"
    //   }

    // async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
    //     const { name, countryId } = createFarmDto;
    
    //     const isValidCountry = await this.validateCountryExistence(countryId);
    
    //     if (!isValidCountry) {
    //       throw new Error('Invalid countryId. Country does not exist.');
    //     }
    
    //     const newFarm = this.farmRepository.create({
    //       name,
    //       country: { id: countryId as unknown as number } as Country, // Explicit cast to handle the type discrepancy
    //     });
    
    //     return this.farmRepository.save(newFarm);
    //   }
    
    //   private async validateCountryExistence(countryId: string): Promise<boolean> {
    //     const country = await this.countryRepository.findOne({ where: { id: countryId as any } });
    //     return !!country;
    //   }
      

    async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
        const { name, countryName } = createFarmDto;
    
        const country = await this.countryRepository.findOne({ where: { name: countryName } });
    
        if (!country) {
          throw new Error(`Country with name ${countryName} not found.`);
        }
    
        const newFarm = this.farmRepository.create({
          name,
          country,
        });
    
        return this.farmRepository.save(newFarm);
      }
      

    // async findAll(): Promise<Farm[]> {
    //     // Use the farmRepository to fetch all farms
    //     const farms = await this.farmRepository.find();

    //     if (!farms.length) {
    //         throw new NotFoundException("No farms found");
    //     }

    //     return farms;
    // }

    // async findAll(): Promise<Farm[]> {
    //     // Use the farmRepository to fetch all farms with the associated country
    //     const farms = await this.farmRepository.find({ relations: ['country'] });
    
    //     if (!farms.length) {
    //       throw new NotFoundException("No farms found");
    //     }
    
    //     return farms;
    //   }


    async findAll(): Promise<Farm[]> {
        try {
          const farms = await this.farmRepository
            .createQueryBuilder('farm')
            .leftJoinAndSelect('farm.country', 'country') // Ensure proper join with country
            .andWhere('farm.deleted IS NULL') // Add a condition for non-deleted farms
            .getMany();
    
          if (!farms.length) {
            throw new NotFoundException("No farms found");
          }
    
          console.log('Fetched Farms:', farms);
    
          return farms;
        } catch (error) {
          console.error('Error fetching farms:', error);
          throw error; // Rethrow the error for further debugging
        }
      }
      

    // async findById(id: string): Promise<Farm> {
    //     // Use the farmRepository to find a farm by its ID
    //     const farm = await this.farmRepository.findOne({ where: { id: Number(id) } });

    //     if (!farm) {
    //         throw new NotFoundException(`Farm with id ${id} not found`);
    //     }

    //     return farm;
    // }

    // farm.service.ts

    async findById(id: string): Promise<Farm> {
        try {
          // Use the farmRepository to find a farm by its ID with the associated country
          const farm = await this.farmRepository
            .createQueryBuilder('farm')
            .leftJoinAndSelect('farm.country', 'country') // Ensure proper join with country
            .andWhere('farm.id = :id', { id })
            .andWhere('farm.deleted IS NULL') // Add a condition for non-deleted farms
            .getOne();
    
          if (!farm) {
            throw new NotFoundException(`Farm with ID ${id} not found`);
          }
    
          return farm;
        } catch (error) {
          console.error('Error fetching farm by ID:', error);
          throw error; // Rethrow the error for further debugging
        }
      }
      
  
}
