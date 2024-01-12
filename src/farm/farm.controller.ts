import { Controller, Post, Body, UseGuards, Patch, Param, Get, Delete, Query, UsePipes, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateFarmDto } from "./dtos/create-farm.dto";
import { FarmService } from "./farm.service";
import { AuthGuard } from "../guards/auth.guard";
import { Serialize } from "../interceptors/serialize.interceptor";
import { AdminGuard } from "../guards/admin.guards";
import { ValidationPipe } from "../pipe/validation_uuid";
import { FarmDto } from "./dtos/farm.dto";
import { Farm } from "./farm.entity";
import { CountryService } from "../country/country.service";
import { plainToClass } from "class-transformer";
import { v4 as uuidv4 } from "uuid";

@Controller("farm")
export class FarmController {
    constructor(
        private farmService: FarmService,
        private countryService: CountryService
    ) {}

    @Post("/createFarm")
    async createFarm(@Body() createFarmDto: CreateFarmDto) {
        return this.farmService.createFarm(createFarmDto);
    }


    @Get("getAll")
    async getAllFarms(): Promise<{ data?: any; error?: string }> {
        try {
            const farms = await this.farmService.findAll();

            // Transforming the data before returning
            const transformedFarms = farms.map((farm) => ({
                id: farm.id,
                name: farm.name,
                created: farm.created,
                updated: farm.updated,
                deleted: farm.deleted,
                country: {
                    id: farm.country.id,
                    name: farm.country.name,
                    created: farm.country.created,
                    updated: farm.country.updated,
                    deleted: farm.country.deleted,
                },
            }));

            return { data: transformedFarms };
        } catch (error) {
            console.error("Error fetching farms:", error);

            if (error instanceof NotFoundException) {
                return { error: "No farms found" };
            }

            return { error: "An error occurred while fetching farms" };
        }
    }

    @Get(':id')
    async getFarmById(@Param('id') id: string) {
      try {
        const farm = await this.farmService.findById(id);
  
        const transformedFarm = {
          id: farm.id,
          name: farm.name,
          created: farm.created,
          updated: farm.updated,
          deleted: farm.deleted,
          country: {
            id: farm.country.id,
            name: farm.country.name,
            created: farm.country.created,
            updated: farm.country.updated,
            deleted: farm.country.deleted,
          },
          fields: [], 
        };
  
        return { data: transformedFarm };
      } catch (error) {
        console.error('Error fetching farm by ID:', error);
        throw new NotFoundException('Farm not found');
      }
    }


    @Delete(':id')
    async deleteFarmById(@Param('id') id: string): Promise<void> {
      await this.farmService.deleteFarmById(id);
    }
}
