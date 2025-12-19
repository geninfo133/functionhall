from app import create_app, db
from app.models import Package

app = create_app()

sample_packages = [
    Package(hall_id=1, package_name="Silver Package", price=10000, details="Basic decoration, veg menu, 100 guests"),
    Package(hall_id=1, package_name="Gold Package", price=20000, details="Premium decoration, veg & non-veg menu, 200 guests, DJ"),
    Package(hall_id=2, package_name="Classic Package", price=15000, details="Standard decoration, veg menu, 150 guests"),
    Package(hall_id=2, package_name="Platinum Package", price=30000, details="Luxury decor, multi-cuisine, 300 guests, live music"),
]

with app.app_context():
    db.session.bulk_save_objects(sample_packages)
    db.session.commit()
    print("Sample packages added to the packages table.")
