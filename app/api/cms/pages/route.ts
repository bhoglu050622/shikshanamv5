import { NextRequest, NextResponse } from 'next/server';
import cms from '@/lib/simple-cms';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const pages = await cms.getPages(status || undefined);
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Get pages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pageData = await request.json();
    
    const page = await cms.createPage(pageData);
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Create page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
