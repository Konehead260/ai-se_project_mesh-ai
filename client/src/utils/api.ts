import { type CurrentUser } from "../types";

const BASE_URL = "/api";

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem("auth-token") ?? "";
    const headers = new Headers(options.headers);
    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    if (!headers.has("Content-Type") && !isFormData) {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message || "Invalid credentials";
    if (localStorage.getItem("auth-token")) {
        localStorage.removeItem("auth-token");
        window.location.href = "/login";
    }
    throw new Error(message);
    }

    if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || "Request failed");
    }

    return res.json();
}

export type KnowledgeDoc = {
  _id: string;
  title: string;
  fileName: string;
  userId: string;
  createdAt: string;
};

export type Chat = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
};

export const getDocuments = (): Promise<ApiResponse<KnowledgeDoc[]>> => {
  return request<KnowledgeDoc[]>("/documents");
};

export const getChats = async (): Promise<ApiResponse<Chat[]>> => {
  return request<Chat[]>("/chats");
};

export const getChat = async (
  id: string,
): Promise<ApiResponse<{ chat: Chat; messages: Message[] }>> => {
return request<{chat: Chat; messages: Message[]}>(`/chats/${id}`);
};

export const createChat = (title: string): Promise<ApiResponse<Chat>> => {
  return request<Chat>("/chats", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const sendMessage = async (
  chatId: string,
  question: string,
): Promise<ApiResponse<Message[]>> => {
 return request<Message[]>(`/chats/${chatId}/messages`, {
     method: 'POST',
     body: JSON.stringify({ question }),
   });
};

export function loginUser(email: string, password: string) {
    return request<{ token: string; user: CurrentUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    });
}



export function getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
  return request<CurrentUser>("/users/me");
}

 export function registerUser(
   name: string,
    email: string,
   password: string,
 ): Promise<ApiResponse<{ user: CurrentUser }>> {
   return request<{ user: CurrentUser}>(`/auth/register`, {
     method: 'POST',
     body: JSON.stringify({ name, email, password }),
   });
 }

export const uploadDocument = async (
  file: File,
): Promise<ApiResponse<KnowledgeDoc>> => {
  const formData = new FormData();
  formData.append("file", file);

  return request<KnowledgeDoc>("/documents", {
    method: "POST",
    body: formData,
  });
};