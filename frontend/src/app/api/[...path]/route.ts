import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/api/proxy';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const targetPath = `/api/${resolvedParams.path.join('/')}`;
  return proxyToBackend(req, targetPath);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const targetPath = `/api/${resolvedParams.path.join('/')}`;
  return proxyToBackend(req, targetPath);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const targetPath = `/api/${resolvedParams.path.join('/')}`;
  return proxyToBackend(req, targetPath);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const targetPath = `/api/${resolvedParams.path.join('/')}`;
  return proxyToBackend(req, targetPath);
}
