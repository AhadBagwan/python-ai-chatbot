"""Image processing service for AhadNova AI."""
from PIL import Image
import io
import base64
from typing import Tuple, Optional


class ImageService:
    """Service for processing uploaded images."""
    
    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    MAX_DIMENSION = 4096
    
    @staticmethod
    def validate_image(content_type: str, size: int) -> Tuple[bool, Optional[str]]:
        """Validate image type and size."""
        if content_type not in ImageService.ALLOWED_TYPES:
            return False, f"Invalid image type. Allowed: {', '.join(ImageService.ALLOWED_TYPES)}"
        
        if size > ImageService.MAX_SIZE:
            return False, f"Image too large. Maximum size: {ImageService.MAX_SIZE // (1024*1024)}MB"
        
        return True, None
    
    @staticmethod
    def process_image(image_data: bytes) -> bytes:
        """Process and optimize image for API."""
        try:
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary (handles PNG transparency)
            if image.mode in ('RGBA', 'P'):
                image = image.convert('RGB')
            
            # Resize if too large
            if max(image.size) > ImageService.MAX_DIMENSION:
                ratio = ImageService.MAX_DIMENSION / max(image.size)
                new_size = tuple(int(dim * ratio) for dim in image.size)
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Optimize and convert to bytes
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=85, optimize=True)
            return output.getvalue()
            
        except Exception as e:
            raise ValueError(f"Failed to process image: {str(e)}")
    
    @staticmethod
    def to_base64(image_data: bytes) -> str:
        """Convert image bytes to base64 string."""
        return base64.b64encode(image_data).decode('utf-8')
    
    @staticmethod
    def from_base64(base64_string: str) -> bytes:
        """Convert base64 string to image bytes."""
        return base64.b64decode(base64_string)


image_service = ImageService()
