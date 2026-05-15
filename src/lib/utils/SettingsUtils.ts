import type { IEngineSettings } from '../types';

/**
 * Compares two IEngineSettings objects for equality.
 */
export function compareSettings(s1: IEngineSettings, s2: IEngineSettings): boolean {
  return (
    s1.discoOn === s2.discoOn &&
    s1.chosenColor === s2.chosenColor &&
    s1.all4Directions === s2.all4Directions &&
    s1.frameCount === s2.frameCount &&
    s1.mode === s2.mode &&
    s1.fontSize === s2.fontSize &&
    s1.speed === s2.speed &&
    s1.intensity === s2.intensity &&
    s1.charSet === s2.charSet &&
    s1.customCharSet === s2.customCharSet &&
    s1.perStringColor === s2.perStringColor
  );
}
