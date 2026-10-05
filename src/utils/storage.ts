import { SavedApplicationRecord, SavedCollegeProfile } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'college_app_generator_history_v1',
  PROFILE: 'college_app_generator_profile_v1',
};

export function getApplicationHistory(): SavedApplicationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load application history from localStorage', e);
    return [];
  }
}

export function saveApplicationToHistory(
  record: Omit<SavedApplicationRecord, 'id' | 'createdAt'>
): SavedApplicationRecord {
  const history = getApplicationHistory();
  const newRecord: SavedApplicationRecord = {
    ...record,
    id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  // Keep most recent first, limit to 50 items
  const updated = [newRecord, ...history].slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage history', e);
  }
  return newRecord;
}

export function updateApplicationInHistory(
  id: string,
  updatedContent: string
): boolean {
  try {
    const history = getApplicationHistory();
    const index = history.findIndex((item) => item.id === id);
    if (index !== -1) {
      history[index].content = updatedContent;
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return true;
    }
  } catch (e) {
    console.error('Failed to update application in history', e);
  }
  return false;
}

export function deleteApplicationFromHistory(id: string): SavedApplicationRecord[] {
  try {
    const history = getApplicationHistory();
    const filtered = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete history item', e);
    return [];
  }
}

export function clearAllApplicationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

export function getSavedCollegeProfile(): SavedCollegeProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read saved college profile', e);
    return null;
  }
}

export function saveCollegeProfile(profile: SavedCollegeProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save college profile to storage', e);
  }
}

export function clearCollegeProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  } catch (e) {
    console.error('Failed to remove college profile', e);
  }
}
