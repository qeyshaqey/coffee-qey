import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Lewati halaman /admin/login
  if (pathname === "/admin/login") {
    return response;
  }

  let supabaseUrl = process.env.SUPABASE_URL?.trim();
  let supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !supabasePublishableKey) {
    const urlLogin = new URL("/admin/login", request.url);
    return NextResponse.redirect(urlLogin);
  }

  // Bersihkan tanda kutip jika ikut tersalin
  supabaseUrl = supabaseUrl.replace(/^["']|["']$/g, "").trim();
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  supabasePublishableKey = supabasePublishableKey.replace(/^["']|["']$/g, "").trim();

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika belum login, alihkan ke /admin/login
  if (!user) {
    const urlLogin = new URL("/admin/login", request.url);
    return NextResponse.redirect(urlLogin);
  }

  return response;
}

export const middleware = proxy;
export default proxy;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

