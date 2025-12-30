import cloudinary
import cloudinary.uploader
import os

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
    secure=True
)

def upload_to_cloudinary(file, folder="functionhall/hall_photos"):
    """
    Upload a file to Cloudinary
    
    Args:
        file: File object from Flask request
        folder: Cloudinary folder path
    
    Returns:
        dict: Upload result with 'url' and 'public_id'
    """
    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image",
            use_filename=True,
            unique_filename=True,
            overwrite=False
        )
        
        return {
            'success': True,
            'url': result.get('secure_url'),
            'public_id': result.get('public_id')
        }
    except Exception as e:
        print(f"❌ Cloudinary upload error: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

def delete_from_cloudinary(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: Cloudinary public ID of the image
    
    Returns:
        dict: Deletion result
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            'success': True,
            'result': result
        }
    except Exception as e:
        print(f"❌ Cloudinary delete error: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }
