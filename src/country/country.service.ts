import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Country } from "./country.entity";
import { CreateCountryDto } from "./dtos/create-country.dto";
import { UpdateCountryDto } from "./dtos/update-country.dto";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {}

  async createCountry(createCropDto: CreateCountryDto): Promise<Country> {
    const { name } = createCropDto;

    const newCrop = this.countryRepository.create({ name });
    return this.countryRepository.save(newCrop);
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
    updateCropDto: UpdateCountryDto,
  ): Promise<Country> {
    const crop = await this.findById(id);

    if (updateCropDto.name) {
      crop.name = updateCropDto.name;
    }

    return this.countryRepository.save(crop);
  }

  async deleteCountryById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    try {
      // findOneOrFail expects an object with a "where" property
      const country = await this.countryRepository.findOneOrFail({
        where: { id },
      });
      const { name } = country;
      // Soft delete by setting the "deleted" property
      country.deleted = new Date();
      await this.countryRepository.save(country);
      return {
        id,
        name,
        message: `Successfully deleted Country with id ${id} and name ${name}`,
      };
    } catch (error) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }
  }
}
