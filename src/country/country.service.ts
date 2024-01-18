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
import { UserRole } from "../auth/dtos/role.enum";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private countryRepository: Repository<Country>,
  ) {}

  async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
    const errors = await validate(createCountryDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const { name } = createCountryDto;
    const newCountry = this.countryRepository.create({ name });
    return await this.countryRepository.save(newCountry);
  }

  async findAll(): Promise<Country[]> {
    const country = await this.countryRepository
      .createQueryBuilder("country")
      .andWhere("country.deleted IS NULL")
      .getMany();

    if (!country.length) {
      throw new NotFoundException("No country found");
    }

    return country;
  }

  async findByName(name: string): Promise<Country | undefined> {
    return this.countryRepository
      .createQueryBuilder("country")
      .where("country.name = :name", { name })
      .getOne();
  }

  async findOneByName(name: string): Promise<Country> {
    const country = await this.countryRepository.findOne({ where: { name } });
    return country;
  }

  async findOne(
    id: string,
    options?: { relations?: string[] },
  ): Promise<Country> {
    if (!id) {
      return null;
    }

    return await this.countryRepository.findOne({
      where: { id },
      relations: options?.relations,
    });
  }

  async findById(id: string): Promise<Country> {
    const country = await this.countryRepository
      .createQueryBuilder("country")
      .andWhere("country.id = :id", { id })
      .andWhere("country.deleted IS NULL")
      .getOne();

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }

  async updateCountry(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    // First Option for find
    //const country = await this.findById(id);

    // Second Option for find
    // const country = await this.countryRepository.findOne({
    //   where: { id },
    // });

    // Third Option for find
    const country = await this.countryRepository.findOneBy({ id });

    if (updateCountryDto.name) {
      country.name = updateCountryDto.name;
    }

    return await this.countryRepository.save(country);
  }

  async deleteCountryById(
    id: string,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingCountry = await this.countryRepository.findOneBy({ id });

    if (!existingCountry) {
      throw new NotFoundException(`Country with id ${id} not found`);
    }

    // Soft delete using the softDelete method
    await this.countryRepository.softDelete({ id });
    //await this.countryRepository.softRemove({ id });

    return {
      id,
      name: existingCountry.name,
      message: `Successfully soft-deleted Country with id ${id} and name ${existingCountry.name}`,
    };
  }

  async permanentlyDeleteCountryByIdForOwner(
    id: string,
    userRole: UserRole,
  ): Promise<{ id: string; name: string; message: string }> {
    const existingCountry = await this.countryRepository.findOneBy({ id });

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
  }
}
