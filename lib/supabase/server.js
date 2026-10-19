import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (katalog & detail produk) tanpa terhalang RLS.
 */
export function buatKoneksiServer() {
  let supabaseUrl = process.env.SUPABASE_URL?.trim();
  let supabaseSecretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  // Bersihkan tanda kutip jika ikut tersalin di environment variable
  if (
    (supabaseUrl.startsWith('"') && supabaseUrl.endsWith('"')) ||
    (supabaseUrl.startsWith("'") && supabaseUrl.endsWith("'"))
  ) {
    supabaseUrl = supabaseUrl.slice(1, -1).trim();
  }

  // Jika URL tidak sengaja menyertakan path /rest/v1 atau tanda garis miring di akhir, bersihkan
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  if (
    (supabaseSecretKey.startsWith('"') && supabaseSecretKey.endsWith('"')) ||
    (supabaseSecretKey.startsWith("'") && supabaseSecretKey.endsWith("'"))
  ) {
    supabaseSecretKey = supabaseSecretKey.slice(1, -1).trim();
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { buatKoneksiAdmin } from "./admin";

