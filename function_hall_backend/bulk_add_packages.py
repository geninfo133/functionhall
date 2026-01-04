"""Add all packages to halls 1, 2, and 4"""
import psycopg2

DB_URL = 'postgresql://postgres:tQOEqfExiGKGYKWOdHJKtYYLMUAoAWRM@yamabiko.proxy.rlwy.net:14904/railway'

PACKAGE_TEMPLATES = [
    {'package_name': 'Basic Package', 'price': 50000, 'details': 'Includes: Hall rental, Basic lighting, Tables & chairs, Air conditioning'},
    {'package_name': 'Standard Package', 'price': 75000, 'details': 'Includes: Hall rental, Premium lighting, Tables & chairs, Air conditioning, Sound system, Stage setup'},
    {'package_name': 'Premium Package', 'price': 100000, 'details': 'Includes: Hall rental, Premium lighting & effects, Decorated tables & chairs, Air conditioning, Professional sound system, Stage with backdrop, Complementary parking'},
    {'package_name': 'Deluxe Package', 'price': 150000, 'details': 'Includes: All Premium features plus VIP lounge, Red carpet entry, Professional photography setup, Valet parking service, Customized decoration'},
    {'package_name': 'Wedding Package', 'price': 200000, 'details': 'Includes: Hall rental for 2 days, Complete wedding lighting & decoration, Premium furniture, Central AC, Professional sound & music, Mandap setup, Valet parking, Welcome area setup, Green room facilities'},
    {'package_name': 'Corporate Package', 'price': 80000, 'details': 'Includes: Hall rental, Professional setup, Projector & screen, High-speed WiFi, Conference tables, Podium, Professional audio system, Tea/Coffee arrangements'},
    {'package_name': 'Birthday Package', 'price': 40000, 'details': 'Includes: Hall rental, Colorful lighting, Tables & chairs, Sound system, Balloon decoration, Cake table setup, Photo booth area'},
    {'package_name': 'Anniversary Package', 'price': 90000, 'details': 'Includes: Hall rental, Romantic lighting, Premium furniture, Sound system, Elegant decoration, Stage setup, Photography corner, Complementary parking'}
]

def add_all_packages(hall_id, hall_name):
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print(f'\n📦 Adding packages to Hall {hall_id}: {hall_name}')
    created = 0
    
    for pkg in PACKAGE_TEMPLATES:
        cur.execute('SELECT id FROM packages WHERE hall_id = %s AND package_name = %s', (hall_id, pkg['package_name']))
        if cur.fetchone():
            print(f'   ⚠️  {pkg["package_name"]} already exists')
            continue
        
        cur.execute('INSERT INTO packages (hall_id, package_name, price, details) VALUES (%s, %s, %s, %s)',
                   (hall_id, pkg['package_name'], pkg['price'], pkg['details']))
        created += 1
        print(f'   ✅ {pkg["package_name"]} - ₹{pkg["price"]:,}')
    
    conn.commit()
    cur.close()
    conn.close()
    print(f'✅ Added {created} packages to {hall_name}!')

if __name__ == '__main__':
    print("="*60)
    print("Bulk Adding Packages to All Halls")
    print("="*60)
    
    # Add to all halls
    add_all_packages(1, 'Heritage Convention Hall')
    add_all_packages(2, 'Happy Moments Function Hall')
    add_all_packages(4, 'Grand Palace Function Hall')
    
    print('\n' + "="*60)
    print('✅ All packages added successfully!')
    print("="*60)
