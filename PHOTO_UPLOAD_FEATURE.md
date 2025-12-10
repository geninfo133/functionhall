# Photo Upload Feature for Vendors

## Overview
Vendors can now add photo URLs when submitting a new hall for approval. The photos will be stored in the `HallPhoto` table and displayed on the frontend.

## Implementation Details

### 1. Frontend Changes (Vendor Dashboard)

**File**: `function_hall_frontend/app/vendor/dashboard/page.tsx`

**Changes Made**:
- Added `photos: [""]` to the form state to hold an array of photo URLs
- Created three helper functions:
  - `handlePhotoChange(index, value)`: Updates a specific photo URL
  - `addPhotoField()`: Adds a new empty photo input field
  - `removePhotoField(index)`: Removes a photo input field
- Added photo URL input section in the modal form with:
  - Dynamic input fields (can add up to 10 photos)
  - Remove button for each photo field
  - "Add Another Photo" button to add more fields
  - Validation hint about using hosted image URLs
- Updated the pending requests section to show photo count

**Form Fields**:
```tsx
<div>
  <label>Hall Photos (Image URLs)</label>
  {form.photos.map((photo, index) => (
    <input 
      type="url"
      value={photo}
      onChange={(e) => handlePhotoChange(index, e.target.value)}
      placeholder="https://example.com/image.jpg"
    />
  ))}
  <button onClick={addPhotoField}>+ Add Another Photo</button>
</div>
```

### 2. Backend Changes

**File**: `function_hall_backend/app/routes.py`

**Changes Made**:

1. **Import HallPhoto model**:
   ```python
   from app.models import ..., HallPhoto
   ```

2. **Include photos in HallChangeRequest** (`/api/halls` POST endpoint):
   ```python
   change_request = HallChangeRequest(
       vendor_id=vendor_id,
       action_type='add',
       new_data=json.dumps({
           ...existing_fields...,
           'photos': data.get('photos', [])
       }),
       status='pending'
   )
   ```

3. **Create HallPhoto records on approval** (`/api/admin/hall-requests/<id>/approve` endpoint):
   ```python
   if change_request.action_type == 'add':
       # Create new hall
       hall = FunctionHall(...)
       db.session.add(hall)
       db.session.flush()  # Get hall.id
       
       # Create photos if provided
       photos = new_data.get('photos', [])
       for photo_url in photos:
           if photo_url and photo_url.strip():  # Only add non-empty URLs
               hall_photo = HallPhoto(
                   hall_id=hall.id,
                   url=photo_url.strip()
               )
               db.session.add(hall_photo)
   ```

### 3. Admin Dashboard Changes

**File**: `function_hall_frontend/app/admin/hall-requests/page.tsx`

**Changes Made**:
- Added photo preview section for "add" requests
- Displays photo thumbnails in a 4-column grid
- Shows photo count
- Includes error handling for invalid image URLs

**Photo Display**:
```tsx
{request.new_data.photos && request.new_data.photos.length > 0 && (
  <div className="mt-3">
    <span className="font-medium">Photos ({photos.length}):</span>
    <div className="grid grid-cols-4 gap-2 mt-2">
      {photos.map((photo, idx) => (
        <img 
          src={photo} 
          alt={`Hall photo ${idx + 1}`}
          className="w-full h-24 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
          }}
        />
      ))}
    </div>
  </div>
)}
```

## User Workflow

### Vendor Side:
1. Login to vendor dashboard (`/vendor/dashboard`)
2. Click "Add New Hall" button
3. Fill in hall details (name, location, capacity, etc.)
4. **Add photo URLs** in the "Hall Photos" section:
   - Enter hosted image URLs (e.g., from Unsplash, Imgur, or your own server)
   - Click "+ Add Another Photo" to add more photos (max 10)
   - Remove unwanted photos by clicking the ✕ button
5. Submit the form
6. Hall request is sent to admin for approval with photos attached

### Admin Side:
1. Login to admin dashboard (`/admin/dashboard`)
2. View pending hall requests
3. See **photo thumbnails** in the request details
4. Click "Approve" to create the hall with all photos
5. Photos are saved to `HallPhoto` table linked to the hall

### Customer Side:
1. Browse halls on `/halls` page
2. Click on a hall to view details (`/halls/[id]`)
3. See **photo gallery** with all submitted photos
4. Click photos to view in lightbox modal

## Sample Photo URLs

For testing, you can use these Unsplash URLs:

```
https://images.unsplash.com/photo-1519167758481-83f29da8c7f1
https://images.unsplash.com/photo-1464366400600-7168b8af9bc3
https://images.unsplash.com/photo-1511795409834-ef04bbd61622
https://images.unsplash.com/photo-1478147427282-58a87a120781
https://images.unsplash.com/photo-1505236858219-8359eb29e329
https://images.unsplash.com/photo-1523438097201-512ae7d59c44
```

## Database Schema

**HallPhoto Table**:
```python
class HallPhoto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.Integer, db.ForeignKey('function_hall.id'))
    url = db.Column(db.String(500))
    hall = db.relationship('FunctionHall', backref='photos')
```

**Relationship**:
- One hall can have multiple photos
- Photos are accessed via `hall.photos`
- Photo URLs are returned in API responses as an array

## API Response Format

**GET /api/halls**:
```json
[
  {
    "id": 1,
    "name": "Grand Ballroom",
    "location": "Hyderabad",
    "capacity": 500,
    "price_per_day": 80000,
    "photos": [
      "https://images.unsplash.com/photo-1519167758481-83f29da8c7f1",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3"
    ]
  }
]
```

## Validation

- Photo URLs must be valid URLs (frontend validates with `type="url"`)
- Empty photo URLs are filtered out before saving
- Maximum 10 photos can be added per hall
- Invalid image URLs show a placeholder in admin preview

## Notes

- Photos are stored as URLs, not uploaded files
- Vendors must host images externally (Unsplash, Imgur, Cloudinary, etc.)
- Photos are optional - vendors can submit halls without photos
- Photos are only created after admin approval
- Existing halls without photos will work normally (empty photos array)

## Testing

1. Start backend: `python run.py`
2. Start frontend: `npm run dev`
3. Login as vendor (create one if needed)
4. Submit a hall with photo URLs
5. Login as admin
6. Approve the hall request
7. View the hall on `/halls/[id]` to see photos

## Future Enhancements

Potential improvements:
- File upload instead of URLs
- Image compression and optimization
- Photo reordering capability
- Multiple photo deletion in edit mode
- Photo captions/descriptions
- Primary photo selection
- Cloudinary or AWS S3 integration
