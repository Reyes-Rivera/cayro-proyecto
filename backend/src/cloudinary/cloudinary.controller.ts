import { Controller, Delete, Query, Res, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Response } from 'express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Delete()
  async deleteByUrl(@Query('url') imageUrl: string, @Res() res: Response) {
    if (!imageUrl) {
      throw new BadRequestException('Missing image URL');
    }

    const publicId = this.extractPublicIdFromUrl(imageUrl);

    const result = await this.cloudinaryService.deleteImage(publicId);
    return res.status(200).json({
      message: 'Image deleted successfully',
      publicId,
      result,
    });
  }

  private extractPublicIdFromUrl(url: string): string {
    try {
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex === -1) throw new Error('Invalid Cloudinary URL');

      const path = url.substring(uploadIndex + '/upload/'.length);
      const parts = path.split('/');
      const fileName = parts[parts.length - 1];

      return fileName.replace(/\.[^/.]+$/, ''); 
    } catch (e) {
      throw new BadRequestException('Invalid Cloudinary URL format');
    }
  }
}
