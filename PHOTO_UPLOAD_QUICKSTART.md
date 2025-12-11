# 📸 Photo Upload Feature - Quick Guide

## ✅ IMPLEMENTED: Upload from Computer/Drive

Vendors can now upload photos directly instead of pasting URLs!

## 🎯 Quick Test Steps

### 1. Start Servers

```bash
# Terminal 1 - Backend
cd function_hall_backend
python app.py

# Terminal 2 - Frontend  
cd function_hall_frontend
npm run dev
```

### 2. Test Upload

1. **Go to**: `http://localhost:3000/vendor/login`
2. **Login** with vendor credentials
3. **Click**: "Add New Hall" button
4. **Scroll to**: "Hall Photos" section
5. **Click**: "Choose Photos from Computer"
6. **Select**: Multiple images from your computer
7. **See**: Instant preview thumbnails!
8. **Submit**: Hall request with photos

### 3. Verify Upload

1. **Go to**: `http://localhost:3000/admin/login`
2. **Login** as admin
3. **View**: Pending hall request with photo thumbnails
4. **Click**: "Approve"
5. **Check**: Hall details page shows all photos

## 🎨 What You'll See

### Vendor Form (BEFORE - URL input):
```
Hall Photos (Image URLs)
┌──────────────────────────────────────┐
│ https://example.com/image.jpg        │
└──────────────────────────────────────┘
+ Add Another Photo
```

### Vendor Form (AFTER - File upload):
```
Hall Photos
┌─────────────────────────────────────────┐
│ 📷 Choose Photos from Computer          │
│ Select up to 10 images - 0/10 selected  │
└─────────────────────────────────────────┘

(After selecting photos)
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Photo1  │ │  Photo2  │ │  Photo3  │
│   [×]    │ │   [×]    │ │   [×]    │
│  250 KB  │ │  180 KB  │ │  320 KB  │
└──────────┘ └──────────┘ └──────────┘
```

### Admin Preview:
```
New Hall Details:
Location: Hyderabad | Capacity: 500

Photos (3):
┌────────┐ ┌────────┐ ┌────────┐
│  📷    │ │  📷    │ │  📷    │
│ Photo1 │ │ Photo2 │ │ Photo3 │
└────────┘ └────────┘ └────────┘
```

## 📋 Features

### ✅ File Selection
- Click button to open file picker
- Select multiple files at once
- Or drag & drop (if browser supports)

### ✅ Preview
- See thumbnails immediately
- Check file sizes
- Remove unwanted photos

### ✅ Validation
- Only image files accepted
- Max 10 photos per hall
- Max 16MB per file
- Auto-disabled when limit reached

### ✅ Upload
- Files sent as FormData
- Unique filenames (UUID)
- Stored in `uploads/hall_photos/`
- Served at `/uploads/hall_photos/<file>`

## 🔍 Behind the Scenes

### File Flow:
```
Computer → File Picker → Preview → Submit
              ↓
        FormData upload
              ↓
     Flask saves to disk
              ↓
   Path stored in DB request
              ↓
      Admin approves
              ↓
    HallPhoto records created
              ↓
   Photos displayed to customers
```

### File Storage:
```
function_hall_backend/
└── uploads/
    └── hall_photos/
        ├── a1b2c3d4e5f6.jpg  ← Your photo 1
        ├── 7890abcdef12.png  ← Your photo 2
        └── 34567890abcd.jpg  ← Your photo 3
```

### Database:
```
HallPhoto table:
+----+---------+-----------------------------------------------+
| id | hall_id | url                                           |
+----+---------+-----------------------------------------------+
| 1  | 5       | http://localhost:5000/uploads/.../a1b2.jpg   |
| 2  | 5       | http://localhost:5000/uploads/.../7890.png   |
| 3  | 5       | http://localhost:5000/uploads/.../3456.jpg   |
+----+---------+-----------------------------------------------+
```

## 🎯 Key Changes

### Frontend (`vendor/dashboard/page.tsx`):
- ❌ Removed: URL input fields
- ✅ Added: File input button
- ✅ Added: Photo preview grid
- ✅ Added: FormData submission

### Backend (`app/routes.py`):
- ✅ Added: File upload handling
- ✅ Added: UUID filename generation
- ✅ Added: File serving route
- ✅ Added: multipart/form-data support

### Backend (`app/__init__.py`):
- ✅ Added: UPLOAD_FOLDER config
- ✅ Added: MAX_CONTENT_LENGTH (16MB)
- ✅ Added: ALLOWED_EXTENSIONS

## 💡 Tips

### For Testing:
- Use sample images from your Downloads folder
- Try different formats: JPG, PNG, GIF
- Test with large files (close to 16MB)
- Test with 10+ photos (should block 11th)

### For Development:
- Check `uploads/hall_photos/` to see saved files
- Visit `http://localhost:5000/uploads/hall_photos/<filename>` to view
- Monitor Flask console for upload logs
- Check browser Network tab for FormData

## ⚠️ Important Notes

1. **Files saved after approval**
   - Pending requests: paths stored
   - Approved halls: files remain on disk

2. **Cleanup not implemented**
   - Rejected/deleted hall photos stay on disk
   - Manual cleanup needed (TODO for production)

3. **Local storage only**
   - Files in `uploads/` folder
   - For production: use S3/Cloudinary

4. **URLs still work**
   - System supports both methods
   - Can paste URLs if preferred

## 🎉 Success!

You now have a complete photo upload system:
- ✅ Select files from computer
- ✅ Preview before upload
- ✅ Upload multiple photos
- ✅ Admin review with thumbnails
- ✅ Customer view in gallery

**Enjoy uploading photos!** 📸
