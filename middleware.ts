import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  // перехватываем только /demo и его под-пути
  matcher: ['/demo', '/demo/:path*'],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Если запрошен ровно /demo или /demo/ — отдаем /public/demo/index.html
  if (pathname === '/demo' || pathname === '/demo/') {
    url.pathname = '/demo/index.html';
    return NextResponse.rewrite(url);
  }

  // Все что под /demo/* (js/css/png/...) — пропускаем к статике public/
  return NextResponse.next();
}
