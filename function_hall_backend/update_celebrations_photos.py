"""
Add background photo to Celebrations hall
"""
from app import create_app, db
from app.models import FunctionHall, HallPhoto

app = create_app()

with app.app_context():
    print("🎨 Adding background to Celebrations hall\n")
    
    # Get Celebrations hall
    hall = FunctionHall.query.filter_by(name='Celebrations').first()
    if not hall:
        print("❌ Celebrations hall not found!")
        exit(1)
    
    print(f"✅ Found hall: {hall.name} (ID: {hall.id})")
    
    # Check existing photos
    existing_photos = HallPhoto.query.filter_by(hall_id=hall.id).all()
    print(f"📷 Current photos: {len(existing_photos)}")
    
    # Beautiful celebration hall photos from Unsplash (verified working URLs)
    new_photos = [
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",  # Banquet setup
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80",  # Grand ballroom
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",  # Wedding venue
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80"   # Modern hall
    ]
    
    # Clear existing photos first
    for photo in existing_photos:
        db.session.delete(photo)
    print(f"🗑️  Removed {len(existing_photos)} old photos")
    
    # Add new photos
    for i, url in enumerate(new_photos, 1):
        photo = HallPhoto(
            hall_id=hall.id,
            url=url
        )
        db.session.add(photo)
        print(f"  {i}. Added photo: {url[:60]}...")
    
    db.session.commit()
    
    print(f"\n✅ Successfully added {len(new_photos)} photos to Celebrations hall!")
    print("🎉 Refresh the halls page to see the changes!")
