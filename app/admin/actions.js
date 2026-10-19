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

/**
 * Server Action untuk mengganti password admin yang sedang login.
 * Memeriksa sesi login di server dan memvalidasi panjang password minimal 8 karakter serta kesamaan konfirmasi.
 */
export async function gantiPassword(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1;
  const passwordBaru = formData?.get ? formData.get("password_baru") : "";
  const konfirmasiPassword = formData?.get ? formData.get("konfirmasi_password") : "";

  if (!passwordBaru || !konfirmasiPassword) {
    redirect(
      "/admin/password?error=" +
        encodeURIComponent("Password baru dan konfirmasi password wajib diisi.")
    );
  }

  if (passwordBaru.length < 8) {
    redirect(
      "/admin/password?error=" +
        encodeURIComponent("Password baru minimal 8 karakter.")
    );
  }

  if (passwordBaru !== konfirmasiPassword) {
    redirect(
      "/admin/password?error=" +
        encodeURIComponent("Konfirmasi password harus sama dengan password baru.")
    );
  }

  let pesanError = null;
  let harusKeLogin = false;

  try {
    const supabase = await buatKoneksiAdmin();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      harusKeLogin = true;
    } else {
      const { error } = await supabase.auth.updateUser({
        password: String(passwordBaru),
      });

      if (error) {
        pesanError = error.message || "Gagal mengganti password.";
      }
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat mengganti password.";
  }

  if (harusKeLogin) {
    redirect(
      "/admin/login?error=" +
        encodeURIComponent("Sesi telah berakhir. Silakan masuk kembali.")
    );
  }

  if (pesanError) {
    redirect("/admin/password?error=" + encodeURIComponent(pesanError));
  }

  redirect(
    "/admin/password?sukses=" + encodeURIComponent("Password berhasil diganti.")
  );
}

