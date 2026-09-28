const HOME_PATH = "/pages/tab/index";
const PROFILE_PATH = "/pages/profile/index";

export function resolvePostLoginPath(path: string): string {
  const normalizedPath = String(path || "").trim();
  const pathname = normalizedPath.split(/[?#]/)[0];
  return pathname === PROFILE_PATH ? HOME_PATH : normalizedPath;
}
