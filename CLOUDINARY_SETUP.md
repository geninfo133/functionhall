# Cloudinary Setup Guide

## ☁️ Permanent Image Storage with Cloudinary

Cloudinary provides permanent cloud storage for images, solving Railway's ephemeral storage problem.

## Step 1: Create Cloudinary Account

1. Go to: https://cloudinary.com/users/register_free
2. Sign up for a free account (25GB storage, 25GB bandwidth/month)
3. Verify your email

## Step 2: Get Your Credentials

1. Go to your Cloudinary Dashboard: https://console.cloudinary.com/
2. Find these three values in the "Account Details" section:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `aBcDeFgHiJkLmNoPqRsTuVwXyZ`)

## Step 3: Add Environment Variables to Railway

1. Go to your Railway dashboard
2. Select your **backend project**
3. Go to **Variables** tab
4. Add these three variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Replace the values** with your actual Cloudinary credentials.

## Step 4: Deploy

After adding the environment variables, Railway will automatically redeploy your backend.

## ✅ What's Changed

- ✅ Images now upload to Cloudinary instead of Railway local storage
- ✅ Images are permanent and survive redeploys
- ✅ All image URLs are now Cloudinary URLs (e.g., `https://res.cloudinary.com/...`)
- ✅ No more missing images after Railway redeploys!

## 📦 Package Added

- `cloudinary==1.41.0` added to `requirements.txt`

## 🗂️ Files Modified

1. `requirements.txt` - Added cloudinary package
2. `cloudinary_config.py` - New file for Cloudinary configuration
3. `app/routes.py` - Updated to use Cloudinary for uploads

## Testing

After setup, upload a new hall with photos. The URLs will look like:
```
https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/functionhall/hall_photos/filename.jpg
```

These URLs are permanent and will work even after Railway redeploys!
