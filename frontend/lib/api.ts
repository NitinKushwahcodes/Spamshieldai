import axios from 'axios';
import { User, AnalysisResult, Case, EvidenceItem, DocumentInfo, DocumentDetail, CommunityReport } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── AUTH APIs ───────────────────────────────────────────────────────────────
export const registerUser = async (data: any) => {
  const res = await api.post('/api/auth/register', data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await api.post('/api/auth/login', data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post('/api/auth/logout');
  return res.data;
};

export const fetchCurrentUser = async () => {
  const res = await api.get('/api/auth/me');
  return res.data;
};

// ─── ANALYZER APIs ───────────────────────────────────────────────────────────
export const analyzeMessage = async (message: string, saveCase: boolean): Promise<{
  success: boolean;
  analysis: AnalysisResult;
  case_id: string | null;
}> => {
  const res = await api.post('/api/analyze', { message, save_case: saveCase });
  return res.data;
};

// ─── CASES APIs ──────────────────────────────────────────────────────────────
export const fetchCases = async (): Promise<{ success: boolean; cases: Case[] }> => {
  const res = await api.get('/api/cases');
  return res.data;
};

export const fetchCaseDetail = async (id: string): Promise<{
  success: boolean;
  case: Case;
}> => {
  const res = await api.get(`/api/cases/${id}`);
  return res.data;
};

export const updateEvidenceItem = async (caseId: string, itemId: string, isCollected: boolean, notes?: string): Promise<{
  success: boolean;
  evidence_item: EvidenceItem;
}> => {
  const res = await api.patch(`/api/cases/${caseId}/evidence/${itemId}`, { 
    is_collected: isCollected,
    notes 
  });
  return res.data;
};

export const deleteCase = async (id: string): Promise<{ success: boolean; message: string }> => {
  const res = await api.delete(`/api/cases/${id}`);
  return res.data;
};

// ─── DOCUMENTS APIs ──────────────────────────────────────────────────────────
export const generateDocument = async (caseId: string, docType: string): Promise<{
  success: boolean;
  document: DocumentDetail;
}> => {
  const res = await api.post('/api/documents/generate', { case_id: caseId, doc_type: docType });
  return res.data;
};

export const fetchDocuments = async (caseId?: string): Promise<{
  success: boolean;
  documents: DocumentInfo[];
}> => {
  const url = caseId ? `/api/documents?case_id=${caseId}` : '/api/documents';
  const res = await api.get(url);
  return res.data;
};

export const fetchDocumentDetail = async (id: string): Promise<{
  success: boolean;
  document: DocumentDetail;
}> => {
  const res = await api.get(`/api/documents/${id}`);
  return res.data;
};

// ─── COMMUNITY APIs ──────────────────────────────────────────────────────────
export const fetchCommunityReports = async (scamType?: string, city?: string): Promise<{
  success: boolean;
  reports: CommunityReport[];
}> => {
  let url = '/api/community';
  const params = [];
  if (scamType) params.push(`scam_type=${encodeURIComponent(scamType)}`);
  if (city) params.push(`city=${encodeURIComponent(city)}`);
  
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  
  const res = await api.get(url);
  return res.data;
};

export const createCommunityReport = async (data: {
  scam_type: string;
  scam_category: string;
  reported_number?: string;
  reported_url?: string;
  description?: string;
  city?: string;
  state?: string;
}): Promise<{
  success: boolean;
  report: CommunityReport;
}> => {
  const res = await api.post('/api/community/report', data);
  return res.data;
};

export default api;
