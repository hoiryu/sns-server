import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from '~auth/guards/bearer-token.guard';
import { CommonService } from '~common/common.service';

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
	@UseGuards(AccessTokenGuard)
	@UseInterceptors(FileInterceptor('image'))
	postImage(@UploadedFile() { filename }: Express.Multer.File) {
		return {
			filename,
		};
	}
}
