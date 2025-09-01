import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const collection = searchParams.get('collection');

  // Check the secret and next parameters
  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  if (!slug || !collection) {
    return NextResponse.json({ message: 'Missing slug or collection' }, { status: 400 });
  }

  try {
    // Fetch the draft version of the content
    const doc = await payload.find({
      collection: collection as any,
      where: {
        slug: {
          equals: slug,
        },
      },
      draft: true,
    });

    if (!doc.docs.length) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    // Redirect to the preview page
    const previewUrl = `/${collection}/${slug}?preview=true`;
    
    return NextResponse.json({
      previewUrl,
      document: doc.docs[0],
    });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json({ message: 'Error fetching preview' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { collection, id } = body;

    if (!collection || !id) {
      return NextResponse.json({ message: 'Missing collection or id' }, { status: 400 });
    }

    // Fetch the draft version of the content
    const doc = await payload.findByID({
      collection: collection as any,
      id,
      draft: true,
    });

    if (!doc) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 });
    }

    // Redirect to the preview page
    const previewUrl = `/${collection}/${doc.slug}?preview=true`;
    
    return NextResponse.json({
      previewUrl,
      document: doc,
    });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json({ message: 'Error fetching preview' }, { status: 500 });
  }
}
