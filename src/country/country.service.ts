import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Country } from "./country.entity";
import { CreateCountryDto } from "./dtos/create-country.dto";

@Injectable()
export class CountryService {
  constructor(@InjectRepository(Country) private repo: Repository<Country>) {}

  async findByName(name: string): Promise<Country | undefined> {
    return this.repo
      .createQueryBuilder("country")
      .where("country.name = :name", { name })
      .getOne();
  }

  //   async findOne(countryId: number): Promise<Country | null> {
  //     return await this.repo.findOne({ where: { id: Number(countryId) } );
  //   }

  async createCountry(createCountryDto: CreateCountryDto): Promise<Country> {
    const { name } = createCountryDto;

    const newCountry = this.repo.create({ name });
    return this.repo.save(newCountry);
  }
}
