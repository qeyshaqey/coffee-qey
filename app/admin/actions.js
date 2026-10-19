"use server";

import { redirect } from "next/navigation";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";

/**
 * Server Action untuk memproses login admin menggunakan Supabase Auth.
 * Login berhasil dialihkan ke /admin, login gagal dialihkan kembali ke /admin/login dengan pesan error.
 */
export async function masuk(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1;
  const email = formData?.get ? formData.get("email") : "";
  const password = formData?.get ? formData.get("password") : "";

  if (!email || !password) {
    redirect("/admin/login?error=" + encodeURIComponent("Email dan password wajib diisi."));
  }

  let pesanError = null;

  try {
    const supabase = await buatKoneksiAdmin();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_grant")
      ) {
        pesanError = "Email atau password salah.";
      } else if (error.message.includes("Email not confirmed")) {
        pesanError = "Email belum dikonfirmasi.";
      } else {
        pesanError = error.message || "Gagal masuk. Silakan coba lagi.";
      }
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat memproses login.";
  }

  if (pesanError) {
    redirect("/admin/login?error=" + encodeURIComponent(pesanError));
  }

  redirect("/admin");
}

/**
 * Server Action untuk mengakhiri sesi admin (logout) lalu kembali ke /admin/login.
 */
export async function keluar() {
  try {
    const supabase = await buatKoneksiAdmin();
    await supabase.auth.signOut();
  } catch {
    // Tetap lanjutkan pengalihan ke halaman login meskipun terjadi error saat sign out
  }

  redirect("/admin/login");
}

