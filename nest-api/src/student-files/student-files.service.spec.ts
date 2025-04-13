import { Test, TestingModule } from '@nestjs/testing';
import { StudentFilesService } from './student-files.service';

describe('StudentFilesService', () => {
  let service: StudentFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentFilesService],
    }).compile();

    service = module.get<StudentFilesService>(StudentFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
