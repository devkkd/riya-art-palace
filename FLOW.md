# Riya Art Palace — Complete Project Flow

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [User Flow](#user-flow)
4. [Admin Flow](#admin-flow)
5. [Authentication System](#authentication-system)
6. [Shiprocket Integration](#shiprocket-integration)
7. [Database Models](#database-models)
8. [API Reference](#api-reference)
9. [Environment Variables](#environment-variables)
10. [Development vs Production](#development-vs-production)

---

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | Next.js 16 (App Router), React 19       |
| Styling      | Tailwind CSS v4 + inline styles         |
| Fonts        | Manrope, Playfair Display (Google Fonts)|
| Database     | MongoDB Atlas (via Mongoose)            |
| Image Storage| Cloudflare R2 (S3-compatible)           |
| Auth (Admin) | Email + Password → JWT (HTTP-only cookie)|
| Auth (User)  | Phone OTP → JWT (HTTP-only cookie)      |
| OTP / Shipping | Shiprocket API                        |
| Payment      | Razorpay (prepaid orders)               |
| Deployment   | Vercel (recommended)                    |

---

## Project Structure

```
src/
├── app/
│   ├── page.js                          ← Home
│   ├── about/page.js                    ← About Us
│   ├── contact/page.jsx                 ← Contact form
│   ├── enquiry/page.jsx                 ← Export/India enquiry
│   ├── products/
│   │   ├── page.jsx                     ← Products listing
│   │   └── [slug]/page.jsx              ← Product detail + Cart sidebar
│   ├── account/page.jsx                 ← User account (OTP login)
│   │
│   ├── admin/
│   │   ├── page.jsx                     ← Admin login
│   │   └── dashboard/
│   │       ├── page.jsx                 ← Dashboard overview
│   │       ├── categories/page.jsx      ← Category CRUD
│   │       ├── subcategories/page.jsx   ← Subcategory CRUD
│   │       ├── products/page.jsx        ← Product CRUD + bulk import
│   │       ├── orders/page.jsx          ← All orders + status update ✅ NEW
│   │       └── users/page.jsx           ← All users ✅ NEW
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js           ← Admin login
│   │   │   ├── logout/route.js          ← Admin logout
│   │   │   ├── me/route.js              ← Admin session check
│   │   │   └── user/
│   │   │       ├── send-otp/route.js    ← Send OTP to phone ✅ NEW
│   │   │       ├── verify-otp/route.js  ← Verify OTP + login ✅ NEW
│   │   │       ├── me/route.js          ← User session ✅ NEW
│   │   │       ├── logout/route.js      ← User logout ✅ NEW
│   │   │       └── addresses/
│   │   │           ├── route.js         ← Add address ✅ NEW
│   │   │           └── [addressId]/route.js ← Delete address ✅ NEW
│   │   ├── catalog/route.js             ← All categories + products (one call)
│   │   ├── categories/[id]/route.js     ← Category CRUD
│   │   ├── subcategories/[id]/route.js  ← Subcategory CRUD
│   │   ├── products/
│   │   │   ├── route.js                 ← Products list/create
│   │   │   ├── [id]/route.js            ← Product get/update/delete
│   │   │   └── bulk/
│   │   │       ├── parse/route.js       ← Parse CSV/Excel
│   │   │       └── import/route.js      ← Bulk create products
│   │   ├── orders/
│   │   │   ├── route.js                 ← Create order (user) / List all (admin) ✅ NEW
│   │   │   ├── [id]/route.js            ← Update order status (admin) ✅ NEW
│   │   │   ├── my/route.js              ← User's own orders ✅ NEW
│   │   │   └── track/[awb]/route.js     ← Shiprocket tracking ✅ NEW
│   │   ├── users/route.js               ← All users (admin only) ✅ NEW
│   │   ├── serviceability/route.js      ← Pincode check ✅ NEW
│   │   └── upload/route.js              ← Image upload to R2
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminShell.jsx           ← Admin layout (sidebar + header)
│   │   │   └── admin-panel.css          ← Admin styles
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── CatalogContext.jsx           ← Global product/category data
│   │   └── ... (other sections)
│   └── assets/                          ← Images
│
├── lib/
│   ├── db/connect.js                    ← MongoDB connection (cached)
│   ├── models/
│   │   ├── Admin.js
│   │   ├── User.js      ✅ NEW
│   │   ├── Order.js     ✅ NEW
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Subcategory.js
│   ├── controllers/
│   │   ├── authController.js            ← Admin auth
│   │   ├── userAuthController.js        ← User OTP auth ✅ NEW
│   │   ├── orderController.js           ← Orders ✅ NEW
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   └── subcategoryController.js
│   ├── services/
│   │   ├── authService.js               ← Admin auth logic
│   │   ├── userAuthService.js           ← User auth logic ✅ NEW
│   │   ├── shiprocketService.js         ← OTP + Shipping API ✅ NEW
│   │   └── cloudflareService.js         ← R2 image upload
│   └── utils/
│       ├── auth.js                      ← isAuthenticated() for admin
│       ├── jwt.js                       ← signToken / verifyToken
│       ├── password.js                  ← bcrypt helpers
│       ├── response.js                  ← successResponse / errorResponse
│       └── slug.js                      ← slugify()
│
├── proxy.js                             ← Route guard (replaces middleware.js)
└── middleware.js                        ← DELETED (deprecated in Next.js 16)
```

---

## User Flow

### 1. Browse Products
```
/ (Home) → /products (Listing) → /products/[slug] (Detail)
```

### 2. OTP Login
```
User clicks "Account" or "Add to Cart"
    ↓
Login modal opens (phone input)
    ↓
POST /api/auth/user/send-otp { phone }
    ↓
DUMMY MODE: OTP = 1234 (logged in console)
REAL MODE: Shiprocket sends SMS OTP
    ↓
User enters OTP
    ↓
POST /api/auth/user/verify-otp { phone, otp, session_token }
    ↓
Backend verifies OTP via Shiprocket
    ↓
User found or created in MongoDB
    ↓
JWT signed → set as user_token HTTP-only cookie (30 days)
    ↓
Redirect to /account
```

### 3. Cart & Checkout
```
Product Detail page → "Add to Cart"
    ↓
Cart sidebar opens (qty selection)
    ↓
"Continue to Checkout"
    ↓
Enter shipping address + pincode
    ↓
GET /api/serviceability?pincode=XXXXXX
    ↓
Available couriers + rates shown
    ↓
Select COD or Prepaid
    ↓
POST /api/orders { items, shippingAddress, paymentMethod }
    ↓
Order saved to MongoDB
    ↓
Shiprocket order created automatically
    ↓
AWB number assigned
    ↓
Order confirmation shown
```

### 4. Order Tracking
```
/account → Order History tab
    ↓
GET /api/orders/my
    ↓
Each order shows: status, AWB, courier
    ↓
"Track Order" link → GET /api/orders/track/[awb]
    ↓
Live Shiprocket tracking data
```

---

## Admin Flow

### Admin Login
```
/admin → Email + Password form
    ↓
POST /api/auth/login
    ↓
admin_token cookie set (7 days)
    ↓
/admin/dashboard (protected by proxy.js)
```

### Product Management
```
/admin/dashboard/products
├── Add Product (modal form + image upload to R2)
├── Edit Product
├── Delete Product
└── Bulk Import (CSV/Excel upload)
```

### Order Management ✅ NEW
```
/admin/dashboard/orders
├── View all orders (paginated, filterable by status)
├── Search by Order ID, phone, AWB
├── View order details (items, address, payment, tracking)
└── Update order status (confirmed → processing → shipped → delivered)
```

### User Management ✅ NEW
```
/admin/dashboard/users
├── View all registered users (paginated)
├── Search by phone, name, email
└── View user details (addresses, last login, join date)
```

---

## Authentication System

### Two Separate Auth Systems

| Type  | Cookie Name  | Duration | Protected Routes            |
|-------|-------------|----------|------------------------------|
| Admin | admin_token | 7 days   | /admin/dashboard/*           |
| User  | user_token  | 30 days  | /account, /cart (future)     |

### How JWT Works
```
Both admin and user tokens use the same JWT_SECRET
Tokens are differentiated by payload:
  - Admin: { adminId, email, name, role }
  - User:  { userId, phone, type: "user" }

Tokens are stored in HTTP-only cookies (not localStorage)
→ Not accessible via JavaScript (XSS safe)
→ Sent automatically with every request (CSRF protected via sameSite: lax)
```

### proxy.js Route Guard
```js
// Runs on every request to /admin or /admin/dashboard/*
// If no valid admin_token cookie → redirect to /admin login
// If valid token on /admin page → redirect to /admin/dashboard
```

---

## Shiprocket Integration

### DUMMY Mode (Current — for development)
```
SHIPROCKET_DUMMY=true in .env.local

OTP:     Always "1234" — logged to console
Orders:  Returns fake AWB numbers (AWB + random digits)
Tracking: Returns hardcoded tracking steps
Serviceability: Always returns 3 dummy couriers
```

### Real Mode (When you create Shiprocket account)
```
1. Go to shiprocket.in → Create seller account
2. Set in .env.local:
   SHIPROCKET_DUMMY=false
   SHIPROCKET_EMAIL=your@email.com
   SHIPROCKET_PASSWORD=yourpassword

3. Everything works automatically — no code changes needed
```

### Shiprocket APIs Used
```
POST /auth/login           → Get seller Bearer token (cached 9 days)
POST /auth/otp/generate    → Send OTP SMS to customer
POST /auth/otp/verify      → Verify OTP entered by customer
GET  /courier/serviceability → Check delivery to pincode
POST /orders/create/adhoc  → Create shipping order
POST /shipments/create/forward-shipment → Assign courier + AWB
GET  /courier/track/awb/[awb] → Live tracking
```

---

## Database Models

### User
```js
{
  phone:     String (unique, indexed)    // "9876543210"
  name:      String (optional)
  email:     String (optional)
  isActive:  Boolean
  lastLogin: Date
  addresses: [{
    label, firstName, lastName,
    line1, line2, city, state, pincode, country,
    phone, altPhone, isDefault
  }]
  createdAt, updatedAt
}
```

### Order
```js
{
  orderId:     String (unique)           // "RAP-XXXXX-XXXX"
  user:        ObjectId → User
  items:       [{ productId, productName, image, price, quantity, subtotal }]
  shippingAddress: { firstName, lastName, line1, line2, city, state, pincode, country, phone }
  subtotal:    Number
  shippingCharge: Number (0 if order > ₹999)
  discount:    Number
  totalAmount: Number
  paymentMethod: "COD" | "PREPAID"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" |
               "out_for_delivery" | "delivered" | "cancelled" | "returned"
  shiprocketOrderId, shiprocketShipmentId, awbNumber, courierName, trackingUrl
  confirmedAt, shippedAt, deliveredAt, cancelledAt
  createdAt, updatedAt
}
```

### Product (existing)
```js
{
  name, slug, description, price, priceUnit,
  category → Category, subcategory → Subcategory,
  images: [String]
  productType, primaryMaterial, style, setType,
  color, sizeCategory, theme, usageArea,
  bestSelling, newArrival
}
```

---

## API Reference

### User Auth
```
POST /api/auth/user/send-otp         { phone }                     → { session_token }
POST /api/auth/user/verify-otp       { phone, otp, session_token } → { user }
GET  /api/auth/user/me                                              → { user }
PUT  /api/auth/user/me               { name, email }               → { user }
POST /api/auth/user/logout                                          → { message }
POST /api/auth/user/addresses        { address fields }            → { addresses }
DELETE /api/auth/user/addresses/[id]                               → { addresses }
```

### Orders
```
POST /api/orders      (user) { items, shippingAddress, paymentMethod } → { order }
GET  /api/orders/my   (user)                                           → [orders]
GET  /api/orders      (admin) ?status=&page=&limit=                    → { orders, total }
PUT  /api/orders/[id] (admin) { orderStatus }                          → { order }
GET  /api/orders/track/[awb]                                           → tracking data
```

### Serviceability
```
GET /api/serviceability?pincode=302001 → { available, couriers: [{ courier_name, rate, etd }] }
```

### Users (Admin)
```
GET /api/users (admin) ?q=&page=&limit= → { users, total }
```

---

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT (used for both admin and user tokens)
JWT_SECRET=minimum-32-character-secret-key
JWT_EXPIRES_IN=7d

# Admin credentials (auto-seeded on first login)
ADMIN_EMAIL=admin@riyaartpalace.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin

# Cloudflare R2 (image storage)
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_ENDPOINT=https://xxxx.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=riya
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxx.r2.dev

# Shiprocket
SHIPROCKET_DUMMY=true               ← change to false when real account ready
SHIPROCKET_EMAIL=your@email.com
SHIPROCKET_PASSWORD=yourpassword
SHIPROCKET_PICKUP_PINCODE=302016    ← Jaipur warehouse pincode

# Razorpay (for prepaid orders)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

---

## Development vs Production

### Current State (Dummy Mode)
- `SHIPROCKET_DUMMY=true`
- OTP is always **1234**
- AWB numbers are fake (`AWBxxxxxxx`)
- Tracking returns hardcoded steps
- No real SMS sent

### Going Live Checklist
- [ ] Create Shiprocket seller account → set credentials in .env
- [ ] Set `SHIPROCKET_DUMMY=false`
- [ ] Add pickup warehouse in Shiprocket panel
- [ ] Create Razorpay account → add keys
- [ ] Implement Razorpay payment flow in checkout
- [ ] Connect Shiprocket webhook for auto status updates
- [ ] Change `JWT_SECRET` to a strong 64-char random string
- [ ] Set `ADMIN_PASSWORD` to a strong password
- [ ] Deploy to Vercel with all env vars set

---

## Shipping Logic

```
Order subtotal ≥ ₹999  → FREE shipping
Order subtotal < ₹999  → ₹60 shipping charge

Pickup pincode: 302016 (Jaipur, Rajasthan)
Default weight: 0.5 kg per shipment
Dimensions: 10×10×10 cm (update per product later)
```

---

*Last updated: June 2025*
