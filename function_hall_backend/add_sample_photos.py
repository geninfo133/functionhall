from app import create_app, db
from app.models import FunctionHall, HallPhoto

app = create_app()

sample_images = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465101178521-c1a4c8a0f8f9?auto=format&fit=crop&w=600&q=80"
]

with app.app_context():
    halls = FunctionHall.query.all()
    for hall in halls:
        # Add 3 sample images per hall
        for i in range(3):
            photo = HallPhoto(hall_id=hall.id, url=sample_images[(hall.id + i) % len(sample_images)])
            db.session.add(photo)
    db.session.commit()
    print("Sample images added to all halls.")
