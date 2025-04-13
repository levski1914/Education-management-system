import { Test, TestingModule } from '@nestjs/testing';
import { StudentFilesController } from './student-files.controller';

describe('StudentFilesController', () => {
  let controller: StudentFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentFilesController],
    }).compile();

    controller = module.get<StudentFilesController>(StudentFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
