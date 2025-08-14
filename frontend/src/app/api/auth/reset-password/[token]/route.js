import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { token } = params;
    const body = await request.json();
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/auth/reset-password/${token}`;
    console.log('Calling backend API:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend response error:', response.status, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(errorData, { status: response.status });
      } catch (parseError) {
        return NextResponse.json(
          { success: false, message: `Backend error: ${response.status}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to connect to backend server' },
      { status: 500 }
    );
  }
}
