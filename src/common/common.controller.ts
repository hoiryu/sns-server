import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CommonService } from '~common/common.service';
import { IsPublic } from '~common/decorators/is-public.decorator';

@Controller('common')
export class CommonController {
	constructor(private readonly commonService: CommonService) {}

	@ApiOperation({ summary: '이미지 업로드' })
	@ApiOkResponse({
		type: () => ({
			filename: String,
		}),
	})
	@Post('image')
	@IsPublic()
	@UseInterceptors(FileInterceptor('image'))
	postImage(@UploadedFile() { filename }: Express.Multer.File) {
		return {
			filename,
		};
	}
}
