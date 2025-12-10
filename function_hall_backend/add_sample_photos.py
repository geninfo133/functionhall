"""
Add sample photos to function halls
"""
from app import create_app, db
from app.models import FunctionHall, HallPhoto

app = create_app()

# Sample photo URLs from Unsplash (free to use)
SAMPLE_PHOTOS = [
    "https://images.unsplash.com/photo-1519167758481-83f29da8170d?w=800",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
    "https://images.unsplash.com/photo-1519167758481-83f29da8170d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
]

with app.app_context():
    print("🖼️  Adding sample photos to halls...")
    
    # Get all halls
    halls = FunctionHall.query.all()
    
    if not halls:
        print("❌ No halls found in database")
    else:
        for idx, hall in enumerate(halls):
            # Check if hall already has photos
            existing_photos = HallPhoto.query.filter_by(hall_id=hall.id).count()
            
            if existing_photos > 0:
                print(f"⏭️  Hall '{hall.name}' already has {existing_photos} photo(s), skipping...")
                continue
            
            # Add 3-5 random sample photos for each hall
            num_photos = min(4, len(SAMPLE_PHOTOS))
            start_idx = (idx * 2) % len(SAMPLE_PHOTOS)
            
            for i in range(num_photos):
                photo_idx = (start_idx + i) % len(SAMPLE_PHOTOS)
                photo = HallPhoto(
                    hall_id=hall.id,
                    url=SAMPLE_PHOTOS[photo_idx]
                )
                db.session.add(photo)
            
            print(f"✅ Added {num_photos} photos to '{hall.name}'")
        
        db.session.commit()
        print(f"\n🎉 Sample photos added successfully!")
