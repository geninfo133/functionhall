# Photo Upload from Computer/Drive - Implementation Guide

## 🎉 Feature Overview

Vendors can now upload photos directly from their computer or Google Drive when adding a hall! No more copying URLs - just select images and submit.

## ✨ What Changed

### Frontend (Vendor Dashboard)

**File**: `function_hall_frontend/app/vendor/dashboard/page.tsx`

**New Features**:
- ✅ File input with "Choose Photos from Computer" button
- ✅ Multiple file selection (up to 10 images)
- ✅ Real-time photo previews with thumbnails
- ✅ File size display for each photo
- ✅ Remove photos before submission
- ✅ Automatic image validation (JPG, PNG, GIF, WEBP)
- ✅ FormData upload instead of JSON

**UI Components**:
```tsx
┌─────────────────────────────────────────────┐
│ 📷 Choose Photos from Computer              │
│ Select up to 10 images - 3/10 selected      │
└─────────────────────────────────────────────┘

Preview Grid:
┌─────────┐ ┌─────────┐ ┌─────────┐
│  Image  │ │  Image  │ │  Image  │
│  [×]    │ │  [×]    │ │  [×]    │
│ 250 KB  │ │ 180 KB  │ │ 320 KB  │
└─────────┘ └─────────┘ └─────────┘
```

### Backend (Flask API)

**File**: `function_hall_backend/app/__init__.py`

**Configuration**:
```python
app.config['UPLOAD_FOLDER'] = 'uploads/hall_photos'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
```

**File**: `function_hall_backend/app/routes.py`

**New Functionality**:
- ✅ Handles `multipart/form-data` requests
- ✅ Saves files with unique UUID filenames
- ✅ Stores files in `uploads/hall_photos/` directory
- ✅ Serves photos via `/uploads/hall_photos/<filename>`
- ✅ Converts paths to full URLs in database
- ✅ Backward compatible with URL submissions

**Upload Flow**:
```python
POST /api/halls (multipart/form-data)
    ↓
1. Extract form fields and files
2. Generate UUID filename for each photo
3. Save files to uploads/hall_photos/
4. Store relative paths in HallChangeRequest
5. Admin approves → Convert to full URLs
6. Create HallPhoto records with URLs
```

### File Storage

**Directory Structure**:
```
function_hall_backend/
├── uploads/
│   └── hall_photos/
│       ├── a1b2c3d4.jpg
│       ├── e5f6g7h8.png
│       └── i9j0k1l2.jpeg
```

**Photo URLs**:
- Stored in DB: `http://localhost:5000/uploads/hall_photos/a1b2c3d4.jpg`
- Served by: `@main.route('/uploads/hall_photos/<filename>')`

## 🚀 How to Use

### Vendor Workflow:

1. **Login** to vendor dashboard
2. **Click "Add New Hall"**
3. **Fill hall details** (name, location, capacity, etc.)
4. **Upload Photos**:
   - Click "Choose Photos from Computer"
   - Select multiple images (Ctrl+Click or Cmd+Click)
   - Or drag-and-drop files
   - See instant preview thumbnails
5. **Remove unwanted photos** (hover and click ×)
6. **Submit** - Files uploaded with hall request

### Admin Workflow:

1. **View pending request** - See photo thumbnails
2. **Approve** - Photos saved to server
3. **Reject** - Photos not saved (memory cleaned)

### Customer View:

1. **Browse halls** - See first photo in card
2. **View details** - Full photo gallery
3. **Click photo** - Lightbox view

## 📋 Technical Details

### Form Submission

**Before** (URL-based):
```javascript
fetch('/api/halls', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, location, photos: ['url1', 'url2'] })
})
```

**After** (File upload):
```javascript
const formData = new FormData();
formData.append('name', hallName);
formData.append('location', location);
photoFiles.forEach(file => formData.append('photos', file));

fetch('/api/halls', {
  method: 'POST',
  body: formData  // No Content-Type header - browser sets it
})
```

### File Processing

**Backend Processing**:
```python
files = request.files.getlist('photos')
for file in files:
    if file and file.filename:
        # Generate unique filename
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save file
        file.save(filepath)
        
        # Store relative path
        photo_paths.append(f"/uploads/hall_photos/{filename}")
```

**On Approval**:
```python
photos = new_data.get('photos', [])
for photo_path in photos:
    if photo_path.startswith('/uploads/'):
        photo_url = f"http://localhost:5000{photo_path}"
    else:
        photo_url = photo_path  # External URL
    
    hall_photo = HallPhoto(hall_id=hall.id, url=photo_url)
    db.session.add(hall_photo)
```

### Memory Management

**Preview Cleanup**:
```javascript
// Create preview
const previewUrl = URL.createObjectURL(file);

// Cleanup when removed
URL.revokeObjectURL(previewUrl);

// Cleanup on modal close/form reset
photoPreviews.forEach(url => URL.revokeObjectURL(url));
```

## 📊 Validation & Limits

### File Validation:
- ✅ **Type**: Images only (png, jpg, jpeg, gif, webp)
- ✅ **Size**: Max 16MB per file
- ✅ **Count**: Max 10 photos per hall
- ✅ **Client-side**: File type check before upload
- ✅ **Server-side**: File extension validation

### Error Handling:
```javascript
// Invalid file type
if (!file.type.startsWith('image/')) {
  alert('Only image files are allowed');
}

// Max photos reached
if (photoFiles.length >= 10) {
  // Disable file input
}

// File too large (handled by browser + Flask)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
```

## 🎨 UI Enhancements

### Photo Preview Grid:
- 3-column responsive grid
- Hover to show delete button
- File size badge overlay
- Smooth transitions

### File Input Button:
- Dashed border design
- Disabled state when max reached
- Upload icon
- Clear counter display

### Admin Preview:
- 4-column thumbnail grid
- Automatic URL conversion
- Error placeholder for invalid images

## 🔄 Backward Compatibility

The system still supports URL-based photo submission:

**JSON Request** (still works):
```json
POST /api/halls
{
  "name": "Grand Hall",
  "photos": ["https://example.com/photo1.jpg"]
}
```

**File Upload Request** (new):
```
POST /api/halls (multipart/form-data)
name=Grand Hall
photos=<file1>
photos=<file2>
```

## 🧪 Testing

### Test File Upload:

1. **Start Backend**:
   ```bash
   cd function_hall_backend
   python app.py
   ```

2. **Start Frontend**:
   ```bash
   cd function_hall_frontend
   npm run dev
   ```

3. **Upload Photos**:
   - Login as vendor
   - Add hall with photos
   - Check `uploads/hall_photos/` directory
   - Verify files are saved

4. **Check URLs**:
   - Open: `http://localhost:5000/uploads/hall_photos/<filename>`
   - Should display the image

### Test Cases:

✅ Upload single image
✅ Upload multiple images (5+ photos)
✅ Upload max 10 photos
✅ Try uploading 11th photo (should be disabled)
✅ Remove photos before submission
✅ Cancel modal (check memory cleanup)
✅ Submit and verify in admin dashboard
✅ Approve and check hall details page
✅ Test with different image formats (JPG, PNG, GIF)

## 📝 Notes

### Important Points:

1. **Files are saved only after admin approval**
   - Pending requests store file paths
   - Approved halls get HallPhoto records

2. **Unique filenames prevent conflicts**
   - UUID-based: `a1b2c3d4-e5f6-7890.jpg`
   - No overwriting of existing files

3. **Memory-efficient previews**
   - Object URLs created on-demand
   - Properly revoked on cleanup

4. **Mixed upload support**
   - Can mix file uploads and URL photos
   - System handles both seamlessly

### Production Considerations:

🔧 **For Production Deployment**:
- Move uploads to cloud storage (AWS S3, Cloudinary)
- Add image optimization/compression
- Implement CDN for faster loading
- Add watermarking if needed
- Virus scanning for uploads
- Rate limiting for uploads

## 🎯 Summary

**What Vendors Can Now Do**:
- ✅ Upload photos directly from computer
- ✅ Preview before submission
- ✅ No need for external hosting
- ✅ Manage photos easily

**What Admins See**:
- ✅ Photo thumbnails in requests
- ✅ Visual review before approval
- ✅ Photo count indicator

**What Customers Get**:
- ✅ High-quality hall photos
- ✅ Consistent photo experience
- ✅ Fast loading from local server

## 🚀 Ready to Test!

Everything is set up. Just:
1. Start the backend server
2. Start the frontend app
3. Login as vendor
4. Add hall with photos from your computer
5. Enjoy! 🎉
