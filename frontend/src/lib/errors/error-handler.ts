import { NextResponse } from 'next/server';
import { ApiError } from './api-error';
import { ZodError } from 'zod';

export function handleApiError(error: unknown) {
  console.error('[API Error]:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.errors || null,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: error.format(),
      },
      { status: 400 }
    );
  }

  const message = error instanceof Error ? error.message : 'Internal Server Error';
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 500 }
  );
}
