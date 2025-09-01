import { NextRequest, NextResponse } from 'next/server';
import cms from '@/lib/simple-cms';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const testimonials = await cms.getTestimonials(status || undefined);
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const testimonialData = await request.json();
    
    const testimonial = await cms.createTestimonial(testimonialData);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
