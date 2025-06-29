# Posts Integration - UniVote System

## Overview
This document outlines the integration of the posts/news system with the existing UniVote database and admin functionality.

## Changes Made

### 1. Database Integration
- **Posts Table**: Utilizes the existing `posts` table with the following structure:
  - `id` (uuid, primary key)
  - `title` (text) - Article headline
  - `content` (text) - Article content
  - `category` (text) - Article category (Announcements, System Updates, Election News)
  - `admin_id` (uuid) - Reference to admin who created the post
  - `org_id` (uuid) - Organization ID (null for university level posts)
  - `image_urls` (array) - Array of image URLs
  - `is_uni_lev` (boolean) - Whether the post is university level
  - `created_at` (timestamptz) - Creation timestamp

### 2. API Routes Created

#### `/api/create-post`
- **Method**: POST
- **Purpose**: Create new posts/articles
- **Parameters**:
  - `title`: Article headline
  - `content`: Article content
  - `category`: Article category
  - `admin_id`: Admin user ID
  - `org_id`: Organization ID (null for university level)
  - `image_urls`: Array of image URLs
  - `is_uni_lev`: Boolean for university level posts

#### `/api/get-posts`
- **Method**: POST
- **Purpose**: Fetch posts based on user type and organization
- **Parameters**:
  - `user_id`: User ID (null for guests)
  - `user_type`: 'admin', 'voter', or 'guest'
  - `department_org`: User's organization/department

#### `/api/get-admin-posts`
- **Method**: POST
- **Purpose**: Fetch posts for admin management
- **Parameters**:
  - `admin_id`: Admin user ID
  - `administered_org`: Admin's administered organization

#### `/api/upload-images`
- **Method**: POST
- **Purpose**: Upload images to Supabase storage
- **Parameters**: FormData with image files

### 3. Frontend Components Updated

#### AdminUpdateSection (`src/app/dashboard/Admin/AdminUpdate_Section/page.tsx`)
- **University Level Toggle**: Added toggle button to make posts university level
- **Database Integration**: Posts are now saved to and loaded from the database
- **Image Upload**: Integrated with Supabase storage
- **Real-time Updates**: Articles list updates after publishing

#### UpdateSection (`src/app/Update_Section/page.tsx`)
- **Dynamic Content**: Articles are now loaded from the database
- **User-based Filtering**: Shows different content based on user type and organization
- **University Level Support**: Displays university level posts to all users

### 4. User Access Control

#### Admin Users
- Can create posts for their organization
- Can create university level posts (visible to all)
- Can see posts from their organization and university level posts

#### Voter Users
- Can see posts from their department/organization
- Can see university level posts
- Cannot create posts

#### Guest Users (Unauthenticated)
- Can only see university level posts
- Cannot create posts

### 5. University Level Feature

#### Toggle Implementation
- **Default State**: Organization/Department level (off)
- **Toggle On**: Makes post university level (visible to all users)
- **Visual Indicator**: Globe icon and blue badge
- **Database Storage**: `is_uni_lev` field in posts table

#### Access Control
- **University Level Posts**: `org_id` is null, `is_uni_lev` is true
- **Organization Posts**: `org_id` contains organization ID, `is_uni_lev` is false

### 6. Image Handling

#### Upload Process
1. Images are uploaded to Supabase storage bucket `article-images`
2. Unique filenames are generated to prevent conflicts
3. Public URLs are returned and stored in `image_urls` array
4. Images are displayed in article previews and listings

#### Storage Structure
- **Bucket**: `article-images`
- **Path**: `article-images/{timestamp}-{random}.{extension}`
- **Access**: Public URLs for display

## Usage Instructions

### For Admins
1. Navigate to Admin Panel → Create New Article
2. Fill in headline, content, and select category
3. Optionally upload images
4. Toggle "University Level" if post should be visible to all users
5. Click "Publish Now" to save the article

### For Voters/Users
1. Navigate to Updates section
2. View articles based on your organization and university level posts
3. Use category filters to find specific content

### For Guests
1. Navigate to Updates section
2. View only university level posts
3. No authentication required

## Technical Notes

### Database Relationships
- Posts are linked to admin_profiles via `admin_id`
- Posts are linked to organizations via `org_id`
- University level posts have `org_id` as null

### Security Considerations
- Row Level Security (RLS) is enabled on posts table
- Users can only see posts they're authorized to view
- Admin operations use service role key for bypassing RLS

### Performance Optimizations
- Posts are ordered by creation date (newest first)
- Images are stored in Supabase storage for fast delivery
- Category filtering is done client-side for better UX

## Future Enhancements
- Edit and delete functionality for posts
- Comment system integration
- Rich text editor for content
- Image optimization and compression
- Email notifications for new posts
- Analytics and engagement tracking 