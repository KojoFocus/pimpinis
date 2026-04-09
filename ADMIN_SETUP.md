# Step N Style - Admin Setup Guide

This guide covers setting up admin users and initial configuration for the Step N Style e-commerce platform.

## Creating Admin Users

### Method 1: Database Direct Insert
After setting up the database schema, create admin users directly in Supabase:

```sql
-- Insert admin user (replace with actual user ID from auth.users)
INSERT INTO public.profiles (id, email, role, full_name)
VALUES (
  'user-uuid-here',  -- Get this from auth.users after user signs up
  'admin@example.com',
  'admin',
  'Admin User'
);
```

### Method 2: Via Supabase Auth
1. Have the admin user sign up through the app at `/auth/login`
2. Manually update their role in the database:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'admin@example.com';
   ```

## Initial Data Setup

### Seed Categories
The schema includes initial categories. If you need to add more:

```sql
INSERT INTO public.categories (name, slug) VALUES
  ('New Category', 'new-category');
```

### Sample Products
Add sample products through the admin dashboard at `/admin/products/new` or via database:

```sql
INSERT INTO public.products (name, description, category_id, selling_price, stock_qty)
VALUES (
  'Sample Product',
  'Product description',
  (SELECT id FROM categories WHERE slug = 'dresses'),
  99.99,
  10
);
```

## Environment Configuration

### Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=product-images
```

### Supabase Setup
1. Create a new Supabase project
2. Run the `schema.sql` in the SQL editor
3. Configure storage bucket for product images
4. Set up authentication providers if needed

## Admin Dashboard Access

- **URL**: `/admin`
- **Login**: Use admin credentials
- **Features**:
  - Product management
  - Category management
  - Order tracking
  - Revenue analytics

## Security Checklist

- [ ] Environment variables configured
- [ ] RLS policies enabled
- [ ] Admin users created
- [ ] Storage bucket permissions set
- [ ] Authentication configured
- [ ] HTTPS enabled in production

## Troubleshooting

### Admin Login Issues
- Verify user role in `profiles` table
- Check authentication setup in Supabase

### Permission Errors
- Ensure RLS policies are applied
- Verify service role key is correct

### Image Upload Issues
- Check storage bucket configuration
- Verify bucket permissions