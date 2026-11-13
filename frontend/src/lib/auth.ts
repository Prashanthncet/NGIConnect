export async function logoutAdmin(): Promise<void> {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ngi_admin_user");
    }
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    window.location.href = "/admin/login";
  }
}

