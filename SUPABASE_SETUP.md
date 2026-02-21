# Supabase Storage Setup Guide

## 1. Create Supabase Project
1. Go to https://supabase.com/
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New project"
5. Enter project name (e.g., "lms-file-storage")
6. Create strong password
7. Select region closest to you
8. Click "Create new project"

## 2. Get API Keys
1. Go to Settings > API
2. Copy these values to your .env file:
   - Project URL → SUPABASE_URL
   - anon/public key → SUPABASE_ANON_KEY

## 3. Create Storage Bucket
1. Go to Storage in left sidebar
2. Click "Create a new bucket"
3. Name: `lms-files`
4. Make it Public: ✅ (for file access)
5. Click "Create bucket"

## 4. Set Storage Policies (Optional)
1. Go to Storage > lms-files > Policies
2. Click "New Policy"
3. For uploads: Allow authenticated users to INSERT
4. For downloads: Allow public SELECT

## Example .env values:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Benefits:
- ✅ **Completely FREE** (1GB storage)
- ✅ **All file formats** (xls, doc, pdf, etc.)
- ✅ **No billing required**
- ✅ **Simple setup**
- ✅ **Secure file access**