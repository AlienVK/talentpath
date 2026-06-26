"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface Child {
  id: string;
  name: string;
  birth_date: string | null;
  grade: number | null;
  city: string | null;
  chronotype: string | null;
  learning_style: string | null;
  social_type: string | null;
  interests: string[];
  current_activities: string[];
  intelligence_scores: Record<string, number>;
  last_ai_analysis: { summary: string; longterm: string; advice: string } | null;
}

interface ChildrenContextValue {
  children: Child[];
  activeChild: Child | null;
  activeChildId: string | null;
  setActiveChildId: (id: string) => void;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ChildrenContext = createContext<ChildrenContextValue | null>(null);

const STORAGE_KEY = "tp_active_child";

export function ChildrenProvider({ children: node }: { children: React.ReactNode }) {
  const [list, setList] = useState<Child[]>([]);
  const [activeChildId, setActiveChildIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/children");
      if (!res.ok) {
        setList([]);
        return;
      }
      const data: Child[] = await res.json();
      setList(Array.isArray(data) ? data : []);
      // Pick active: stored id if still valid, else first child
      const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      const valid = data.find((c) => c.id === stored);
      setActiveChildIdState(valid ? valid.id : data[0]?.id ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setActiveChildId = useCallback((id: string) => {
    setActiveChildIdState(id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const activeChild = list.find((c) => c.id === activeChildId) ?? null;

  return (
    <ChildrenContext.Provider
      value={{ children: list, activeChild, activeChildId, setActiveChildId, loading, refresh }}
    >
      {node}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  const ctx = useContext(ChildrenContext);
  if (!ctx) throw new Error("useChildren must be used within ChildrenProvider");
  return ctx;
}

/** Age in years from an ISO birth date, or null. */
export function ageFromBirthDate(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const b = new Date(birthDate);
  if (isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
}
