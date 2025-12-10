# Hall Owner (Vendor) Approval System

## Overview
This system requires super admin approval for all hall management actions (add, edit, delete) performed by vendors/hall owners.

## How It Works

### For Vendors (Hall Owners)

#### 1. Adding a New Hall
**Endpoint:** `POST /api/halls`

**Request Body:**
```json
{
  "vendor_id": 123,
  "name": "Grand Palace Hall",
  "owner_name": "John Doe",
  "location": "Downtown",
  "capacity": 500,
  "price_per_day": 50000,
  "contact_number": "+1234567890",
  "description": "Beautiful hall for weddings"
}
```

**Response:**
```json
{
  "message": "Hall submission received! Pending admin approval.",
  "request_id": 45,
  "status": "pending"
}
```

#### 2. Editing an Existing Hall
**Endpoint:** `POST /api/vendor/halls/{hall_id}/edit`

**Request Body:**
```json
{
  "vendor_id": 123,
  "name": "Grand Palace Hall - Updated",
  "capacity": 600,
  "price_per_day": 55000
}
```

**Response:**
```json
{
  "message": "Edit request submitted! Pending admin approval.",
  "request_id": 46
}
```

#### 3. Deleting a Hall
**Endpoint:** `POST /api/vendor/halls/{hall_id}/delete`

**Request Body:**
```json
{
  "vendor_id": 123
}
```

**Response:**
```json
{
  "message": "Delete request submitted! Pending admin approval.",
  "request_id": 47
}
```

#### 4. View Your Requests
**Endpoint:** `GET /api/vendor/{vendor_id}/requests`

**Response:**
```json
[
  {
    "id": 45,
    "hall_id": null,
    "hall_name": null,
    "action_type": "add",
    "status": "pending",
    "new_data": {...},
    "requested_at": "2025-12-09T10:30:00",
    "reviewed_at": null,
    "rejection_reason": null
  }
]
```

### For Super Admins

#### 1. View All Pending Requests
**Endpoint:** `GET /api/admin/hall-requests?status=pending`

**Response:**
```json
[
  {
    "id": 45,
    "hall_id": null,
    "hall_name": null,
    "vendor_id": 123,
    "vendor_name": "John Doe",
    "vendor_business": "JD Halls",
    "action_type": "add",
    "status": "pending",
    "old_data": null,
    "new_data": {
      "name": "Grand Palace Hall",
      "location": "Downtown",
      "capacity": 500,
      "price_per_day": 50000
    },
    "requested_at": "2025-12-09T10:30:00",
    "reviewed_at": null,
    "rejection_reason": null
  }
]
```

**Query Parameters:**
- `status`: `pending`, `approved`, or `rejected` (default: `pending`)

#### 2. Approve a Request
**Endpoint:** `POST /api/admin/hall-requests/{request_id}/approve`

**Request Body:**
```json
{
  "admin_id": 1
}
```

**Response:**
```json
{
  "message": "Hall add request approved successfully!"
}
```

**Actions performed:**
- `add`: Creates the new hall and marks it as approved
- `edit`: Updates the existing hall with new data
- `delete`: Removes the hall from the database

#### 3. Reject a Request
**Endpoint:** `POST /api/admin/hall-requests/{request_id}/reject`

**Request Body:**
```json
{
  "admin_id": 1,
  "reason": "Incomplete information provided"
}
```

**Response:**
```json
{
  "message": "Hall request rejected"
}
```

## Database Schema

### New Table: `hall_change_requests`
```sql
CREATE TABLE hall_change_requests (
    id SERIAL PRIMARY KEY,
    hall_id INTEGER REFERENCES function_halls(id),
    vendor_id INTEGER NOT NULL REFERENCES admin_users(id),
    action_type VARCHAR(20) NOT NULL,  -- 'add', 'edit', 'delete'
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
    old_data TEXT,  -- JSON of original hall data
    new_data TEXT,  -- JSON of new/updated hall data
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES admin_users(id),
    rejection_reason TEXT
);
```

### Updated Table: `function_halls`
```sql
ALTER TABLE function_halls 
ADD COLUMN is_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending';
```

## Workflow Diagram

```
Vendor Action → Create Change Request → Pending Status
                                              ↓
                                    Super Admin Reviews
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                               Approve              Reject
                                    ↓                   ↓
                         Apply Changes          Notify Vendor
                                    ↓                   ↓
                         Mark as Approved    Mark as Rejected
```

## Security Features

1. **Vendor Verification:** System checks if the vendor owns the hall before allowing edit/delete requests
2. **Admin Authorization:** Only users with `role='super_admin'` can approve/reject requests
3. **Action History:** All requests are stored permanently for audit trail
4. **Status Tracking:** Requests can only be processed once (from pending to approved/rejected)

## API Response Codes

- **200:** Request processed successfully
- **201:** Change request created successfully
- **400:** Bad request (missing parameters or already processed)
- **403:** Unauthorized (vendor doesn't own hall or not super admin)
- **404:** Hall or request not found

## Testing the System

### 1. Create a vendor account
### 2. Vendor submits a new hall
### 3. Super admin views pending requests
### 4. Super admin approves/rejects
### 5. Vendor checks request status

## Future Enhancements

- Email notifications to vendors when requests are reviewed
- Batch approval for multiple requests
- Request comments/notes from admin
- Automatic approval for trusted vendors
- Request expiration after X days
