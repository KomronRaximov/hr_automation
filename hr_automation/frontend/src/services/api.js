import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

export async function uploadResume(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  const response = await api.post("/resumes/upload/", formData);
  return response.data;
}

export async function createJob(payload) {
  const response = await api.post("/jobs/", payload);
  return response.data;
}

export async function listJobs() {
  const response = await api.get("/jobs/");
  return response.data;
}

export async function listResumes() {
  const response = await api.get("/resumes/");
  return response.data;
}

export async function matchJob(jobId, resumeIds = null) {
  const payload = resumeIds ? { resume_ids: resumeIds } : {};
  const response = await api.post(`/jobs/match/job/${jobId}/`, payload);
  return response.data;
}

export async function getCandidate(candidateId) {
  const response = await api.get(`/candidates/${candidateId}/`);
  return response.data;
}
