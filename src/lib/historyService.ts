import { supabase } from './supabase';
import { BrainAgeResult } from '../brainAgeService';

export interface HistoryRecord {
  id: string;
  filename: string;
  chronological_age: number;
  predicted_age: number;
  difference: number;
  classification: string;
  folder_type: string | null;
  created_at: string;
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('brain_age_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('brain_age_session_id', sessionId);
  }
  return sessionId;
}

export async function saveToHistory(filename: string, result: BrainAgeResult): Promise<void> {
  const sessionId = getOrCreateSessionId();

  const { error } = await supabase
    .from('brain_age_history')
    .insert({
      filename,
      chronological_age: result.chronologicalAge,
      predicted_age: result.predictedAge,
      difference: result.difference,
      classification: result.classification,
      folder_type: result.folderType,
      session_id: sessionId
    });

  if (error) {
    console.error('Error saving to history:', error);
    throw error;
  }
}

export async function getHistory(): Promise<HistoryRecord[]> {
  const sessionId = getOrCreateSessionId();

  const { data, error } = await supabase
    .from('brain_age_history')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching history:', error);
    throw error;
  }

  return data || [];
}

export async function clearHistory(): Promise<void> {
  const sessionId = getOrCreateSessionId();

  const { error } = await supabase
    .from('brain_age_history')
    .delete()
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}
