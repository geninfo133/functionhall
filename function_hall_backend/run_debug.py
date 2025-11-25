from app import create_app

app = create_app()

# Print all registered routes for debugging
print("\n" + "="*50)
print("REGISTERED ROUTES:")
print("="*50)
for rule in app.url_map.iter_rules():
    methods = ', '.join(sorted(rule.methods))
    print(f"{rule.endpoint:30s} {methods:30s} {rule.rule}")
print("="*50 + "\n")

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
