import { WallPanelExperienceData } from "./types";
import primoJson from "./primo.json";
import primoFlutedJson from "./primo-fluted.json";
import eliteJson from "./elite.json";

export * from "./types";

export const primoData = primoJson as unknown as WallPanelExperienceData;
export const primoFlutedData = primoFlutedJson as unknown as WallPanelExperienceData;
export const eliteData = eliteJson as unknown as WallPanelExperienceData;

export const WALL_PANELS_EXPERIENCE: Record<string, WallPanelExperienceData> = {
  primo: primoData,
  "primo-fluted": primoFlutedData,
  elite: eliteData,
};

export default WALL_PANELS_EXPERIENCE;
