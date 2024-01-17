import { Test, TestingModule } from "@nestjs/testing";
import { CultivationService } from "./test";

describe("CultivationService", () => {
  let service: CultivationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultivationService],
    }).compile();

    service = module.get<CultivationService>(CultivationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
