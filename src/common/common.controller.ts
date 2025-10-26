import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CommonService } from '~common/common.service';
import { IsPublic } from '~common/decorators/is-public.decorator';

@Controller('common')
export class CommonController {
	constructor(private readonly commonService: CommonService) {}

	@ApiOperation({ summary: '이미지들 업로드' })
	@ApiOkResponse({
		type: () => ({
			files: String,
		}),
		isArray: true,
	})
	@Post('images')
	@IsPublic()
	@UseInterceptors(FilesInterceptor('images', 10))
	postImage(@UploadedFiles() files: Express.Multer.File[]) {
		return { files: files.map(f => f.filename) };
	}
}
