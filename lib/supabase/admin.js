import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase untuk sesi admin menggunakan @supabase/ssr dan cookies.
 * Menggunakan SUPABASE_PUBLISHABLE_KEY agar aturan RLS tetap berlaku sesuai sesi login admin.
 */
export async function buatKoneksiAdmin() {
  const cookieStore = await cookies();

  let supabaseUrl = process.env.SUPABASE_URL?.trim();
  let supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  // Bersihkan tanda kutip jika ikut tersalin di environment variable
  if (
    (supabaseUrl.startsWith('"') && supabaseUrl.endsWith('"')) ||
    (supabaseUrl.startsWith("'") && supabaseUrl.endsWith("'"))
  ) {
    supabaseUrl = supabaseUrl.slice(1, -1).trim();
  }

  // Jika URL tidak sengaja menyertakan path /rest/v1 atau trailing slash, bersihkan
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  if (
    (supabasePublishableKey.startsWith('"') && supabasePublishableKey.endsWith('"')) ||
    (supabasePublishableKey.startsWith("'") && supabasePublishableKey.endsWith("'"))
  ) {
    supabasePublishableKey = supabasePublishableKey.slice(1, -1).trim();
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Abaikan jika dipanggil dari Server Component murni
        }
      },
    },
  });
}

