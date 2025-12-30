# Railway Environment Variable Setup

## ⚙️ Add this environment variable to your Railway backend:

1. Go to your Railway dashboard
2. Select your backend project
3. Navigate to **Variables** tab
4. Add the following variable:

```
BACKEND_URL=https://your-railway-backend-url.railway.app
```

Replace `your-railway-backend-url.railway.app` with your actual Railway backend URL.

## 🔍 What was fixed:

- Changed hardcoded `http://localhost:5000` to use `BACKEND_URL` environment variable
- Location: `function_hall_backend/app/routes.py` line 896
- Now photo URLs will use your Railway backend URL instead of localhost

## 🧪 Testing:

After adding the environment variable and redeploying:
1. Add a new hall from vendor dashboard with photos
2. Check the database - photo URLs should now be:
   `https://your-railway-backend-url.railway.app/uploads/hall_photos/filename.jpg`

## 📝 Note:

The code falls back to `http://localhost:5000` for local development if `BACKEND_URL` is not set.
