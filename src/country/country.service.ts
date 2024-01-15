import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { validate } from "class-validator";
import { Country } from "./country.entity";
import { CreateCountryDto } from "./dtos/create-country.dto";
import { UpdateCountryDto } from "./dtos/update-country.dto";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {}

  async createCountry(createCropDto: CreateCountryDto): Promise<Country> {
    const errors = await validate(createCropDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const { name } = createCropDto;
      const newCrop = this.countryRepository.create({ name });
      return await this.countryRepository.save(newCrop);
    } catch (error) {
      throw new BadRequestException("Error creating Country: " + error.message);
    }
  }

  async findAll(): Promise<Country[]> {
    try {
      const country = await this.countryRepository
        .createQueryBuilder("country")
        .andWhere("country.deleted IS NULL")
        .getMany();

      if (!country.length) {
        throw new NotFoundException("No country found");
      }

      return country;
    } catch (error) {
      console.error("Error fetching country:", error);
      throw error;
    }
  }

  async findByName(name: string): Promise<Country | undefined> {
    return this.countryRepository
      .createQueryBuilder("country")
      .where("country.name = :name", { name })
      .getOne();
  }

  async findById(id: string): Promise<Country> {
    try {
      const country = await this.countryRepository
        .createQueryBuilder("country")
        .andWhere("country.id = :id", { id })
        .andWhere("country.deleted IS NULL")
        .getOne();

      if (!country) {
        throw new NotFoundException(`Country with ID ${id} not found`);
      }

      return country;
    } catch (error) {
      console.error("Error fetching country by ID:", error);
      throw error;
    }
  }

  async updateCountry(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    try {
      const country = await this.findById(id);

      if (updateCountryDto.name) {
        country.name = updateCountryDto.name;
      }

      return await this.countryRepository.save(country);
    } catch (error) {
      // console.error(`Error updating country with ID ${id}:`, error);
      throw new NotFoundException("Failed to update country");
    }
  }

  // async deleteCountryById(
  //   id: string,
  // ): Promise<{ id: string; name: string; message: string }> {
  //   try {
  //     // findOneOrFail expects an object with a "where" property
  //     const country = await this.countryRepository.findOneOrFail({
  //       where: { id },
  //     });
  //     const { name } = country;
  //     // Soft delete by setting the "deleted" property
  //     country.deleted = new Date();
  //     await this.countryRepository.save(country);
  //     return {
  //       id,
  //       name,
  //       message: `Successfully deleted Country with id ${id} and name ${name}`,
  //     };
  //   } catch (error) {
  //     throw new NotFoundException(`Country with id ${id} not found`);
  //   }
  // }

  async deleteCountryById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      // Check if the country exists
      const existingCountry = await this.countryRepository.findOne({
        where: { id },
      });

      if (!existingCountry) {
        throw new NotFoundException(`Country with id ${id} not found`);
      }

      // Soft delete using the softDelete method
      await this.countryRepository.softDelete(id);

      return {
        id,
        name: existingCountry.name,
        message: `Successfully soft-deleted Country with id ${id} and name ${existingCountry.name}`,
      };
    } catch (error) {
      // Handle EntityNotFoundError specifically
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Country with id ${id} not found`);
      }

      throw new NotFoundException(`Country with id ${id} not found`);
    }
  }

  async permanentlyDeleteCountryByIdForOwner(
    id: string,
    userRole: UserRole, // Assuming you pass the user's role to the service method
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      // Check if the country exists
      const existingCountry = await this.countryRepository.findOne({
        where: { id },
      });

      if (!existingCountry) {
        throw new NotFoundException(`Country with id ${id} not found`);
      }

      // Check if the user has the necessary role (OWNER) to perform the permanent delete
      if (userRole !== UserRole.OWNER) {
        throw new NotFoundException("User does not have the required role");
      }

      // Perform the permanent delete
      await this.countryRepository.remove(existingCountry);

      return {
        id,
        name: existingCountry.name,
        message: `Successfully permanently deleted Country with id ${id} and name ${existingCountry.name}`,
      };
    } catch (error) {
      // Handle EntityNotFoundError specifically
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Country with id ${id} not found`);
      }

      throw new NotFoundException(
        `Failed to permanently delete country with id ${id}`,
      );
    }
  }
}
