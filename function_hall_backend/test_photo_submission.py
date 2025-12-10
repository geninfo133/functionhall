"""
Test script to demonstrate vendor submitting hall with photos
"""
from app import create_app, db
from app.models import FunctionHall, HallChangeRequest, AdminUser, HallPhoto
import json

app = create_app()

with app.app_context():
    print("🧪 Testing Photo Submission Feature\n")
    
    # Get Suhasini vendor
    vendor = AdminUser.query.filter_by(email='suhasini@vendor.com').first()
    if not vendor:
        print("❌ Vendor Suhasini not found!")
        exit(1)
    
    print(f"✅ Found vendor: {vendor.name} (ID: {vendor.id})")
    
    # Check existing hall requests
    existing_requests = HallChangeRequest.query.filter_by(vendor_id=vendor.id, status='pending').all()
    print(f"\n📋 Existing pending requests: {len(existing_requests)}")
    
    # Simulate vendor submitting a new hall with photos
    sample_photos = [
        "https://images.unsplash.com/photo-1519167758481-83f29da8c7f1",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
        "https://images.unsplash.com/photo-1478147427282-58a87a120781"
    ]
    
    hall_data = {
        'name': 'Grand Ballroom',
        'owner_name': 'Suhasini',
        'location': 'Hyderabad, Telangana',
        'capacity': 500,
        'price_per_day': 80000,
        'contact_number': '+91 9876543210',
        'description': 'Luxurious ballroom with modern amenities and elegant decor',
        'vendor_id': vendor.id,
        'photos': sample_photos
    }
    
    # Create hall change request (simulating vendor submission)
    change_request = HallChangeRequest(
        vendor_id=vendor.id,
        action_type='add',
        new_data=json.dumps(hall_data),
        status='pending'
    )
    db.session.add(change_request)
    db.session.commit()
    
    print(f"\n✅ Created hall change request ID: {change_request.id}")
    print(f"📷 Photos in request: {len(sample_photos)}")
    
    # Simulate admin approval
    print("\n🔄 Simulating admin approval...")
    
    new_data = json.loads(change_request.new_data)
    hall = FunctionHall(
        name=new_data.get('name'),
        owner_name=new_data.get('owner_name'),
        location=new_data.get('location'),
        capacity=new_data.get('capacity'),
        price_per_day=new_data.get('price_per_day'),
        contact_number=new_data.get('contact_number'),
        description=new_data.get('description'),
        vendor_id=change_request.vendor_id,
        is_approved=True,
        approval_status='approved'
    )
    db.session.add(hall)
    db.session.flush()  # Get hall.id
    
    # Create photos
    photos = new_data.get('photos', [])
    photo_count = 0
    for photo_url in photos:
        if photo_url and photo_url.strip():
            hall_photo = HallPhoto(
                hall_id=hall.id,
                url=photo_url.strip()
            )
            db.session.add(hall_photo)
            photo_count += 1
    
    change_request.hall_id = hall.id
    change_request.status = 'approved'
    
    db.session.commit()
    
    print(f"✅ Hall created! ID: {hall.id}")
    print(f"📷 Photos created: {photo_count}")
    
    # Verify photos were created
    hall_photos = HallPhoto.query.filter_by(hall_id=hall.id).all()
    print(f"\n📸 Verification - Hall has {len(hall_photos)} photos:")
    for i, photo in enumerate(hall_photos, 1):
        print(f"  {i}. {photo.url[:60]}...")
    
    print("\n🎉 Test completed successfully!")
    print("\n💡 Now you can:")
    print("  1. Login as vendor Suhasini (suhasini@vendor.com / password123)")
    print("  2. Add a new hall with photo URLs")
    print("  3. Login as admin to approve the hall")
    print("  4. View the hall with photos on the halls page")
