// This function takes two arrays, the first being the permissions the user needs to have, and the second being the permissions the user has.
// It returns true if the user has at least one of the permissions in the first array.
export function hasPerm(allowedPermissions: string[], permissions: string[]): boolean {
  return allowedPermissions.some((perm) => permissions.includes(perm));
}