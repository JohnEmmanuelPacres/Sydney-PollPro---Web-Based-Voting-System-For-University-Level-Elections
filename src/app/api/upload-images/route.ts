import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // First, ensure the bucket exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'article-images');
    if (!bucketExists) {
      console.log('Creating article-images bucket...');
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket('article-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        return NextResponse.json({ error: 'Failed to create storage bucket' }, { status: 500 });
      }
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        console.log(`Skipping non-image file: ${file.name}`);
        continue;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`; // Simplified path

      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log(`Uploading file: ${fileName}, size: ${buffer.length} bytes`);

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
          .from('article-images')
          .upload(filePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading image:', error);
          continue;
        }

        console.log('Upload successful:', data);

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from('article-images')
          .getPublicUrl(filePath);

        console.log('Public URL:', urlData.publicUrl);
        uploadedUrls.push(urlData.publicUrl);

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        continue;
      }
    }

    console.log('Final uploaded URLs:', uploadedUrls);

    return NextResponse.json({ 
      success: true, 
      urls: uploadedUrls 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in upload-images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images', details: String(error) },
      { status: 500 }
    );
  }
}