export const adminCache = {
  dynamicProducts: null as any[] | null,
  installedImages: null as any[] | null,
  catalogs: null as any[] | null,
  teamMembers: null as any[] | null,
  activityLogs: null as any[] | null,
  activityTeam: null as any[] | null,
};

export const clearAdminCache = (key?: keyof typeof adminCache) => {
  if (key) {
    adminCache[key] = null;
  } else {
    adminCache.dynamicProducts = null;
    adminCache.installedImages = null;
    adminCache.teamMembers = null;
    adminCache.activityLogs = null;
    adminCache.activityTeam = null;
  }
};
