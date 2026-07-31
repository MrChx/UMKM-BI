"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Business } from "@/lib/types";

export interface PendingSubmission {
  id: string;
  businessName: string;
  category: string;
  description: string;
  address: string;
  geotagging: string;
  whatsapp: string;
  openingHours: string;
  paymentMethods: string[];
  deliveryServices: string[];
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  menuImageUrl?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface UmkmContextType {
  businesses: Business[];
  submissions: PendingSubmission[];
  loadingBusinesses: boolean;
  loadingSubmissions: boolean;
  selectedSubmissionForImport: PendingSubmission | null;
  setSelectedSubmissionForImport: (submission: PendingSubmission | null) => void;
  addSubmission: (data: Omit<PendingSubmission, "id" | "submittedAt" | "status">) => Promise<void>;
  updateSubmissionStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
  addBusiness: (business: Omit<Business, "id">) => Promise<void>;
  updateBusiness: (business: Business) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  refreshBusinesses: () => Promise<void>;
  refreshSubmissions: () => Promise<void>;
}

const UmkmContext = createContext<UmkmContextType | undefined>(undefined);

export function UmkmProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [selectedSubmissionForImport, setSelectedSubmissionForImport] = useState<PendingSubmission | null>(null);

  const refreshBusinesses = useCallback(async () => {
    setLoadingBusinesses(true);
    try {
      const res = await fetch("/api/businesses");
      if (!res.ok) throw new Error("Failed to fetch businesses");
      const { businesses: data } = await res.json();
      setBusinesses(data ?? []);
    } catch (e) {
      console.error("Error fetching businesses:", e);
    } finally {
      setLoadingBusinesses(false);
    }
  }, []);

  const refreshSubmissions = useCallback(async () => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch("/api/submissions");
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const { submissions: data } = await res.json();
      setSubmissions(data ?? []);
    } catch (e) {
      console.error("Error fetching submissions:", e);
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  useEffect(() => {
    refreshBusinesses();
    refreshSubmissions();
  }, [refreshBusinesses, refreshSubmissions]);

  const addSubmission = useCallback(
    async (data: Omit<PendingSubmission, "id" | "submittedAt" | "status">) => {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to submit registration");
      }
      const { submission } = await res.json();
      setSubmissions((prev) => [submission, ...prev]);
    },
    []
  );

  const updateSubmissionStatus = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update submission status");
      }
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    },
    []
  );

  const addBusiness = useCallback(async (business: Omit<Business, "id">) => {
    const res = await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(business),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to publish business");
    }
    const { business: newBiz } = await res.json();
    setBusinesses((prev) => [newBiz, ...prev]);
  }, []);

  const updateBusiness = useCallback(async (business: Business) => {
    const res = await fetch("/api/businesses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(business),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to update business");
    }
    const { business: updatedBiz } = await res.json();
    setBusinesses((prev) =>
      prev.map((b) => (b.id === updatedBiz.id ? updatedBiz : b))
    );
  }, []);

  const deleteBusiness = useCallback(async (id: string) => {
    const res = await fetch(`/api/businesses?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to delete business");
    }
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const deleteSubmission = useCallback(async (id: string) => {
    const res = await fetch(`/api/submissions?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to delete submission");
    }
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <UmkmContext.Provider
      value={{
        businesses,
        submissions,
        loadingBusinesses,
        loadingSubmissions,
        selectedSubmissionForImport,
        setSelectedSubmissionForImport,
        addSubmission,
        updateSubmissionStatus,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        deleteSubmission,
        refreshBusinesses,
        refreshSubmissions,
      }}
    >
      {children}
    </UmkmContext.Provider>
  );
}

export function useUmkm() {
  const context = useContext(UmkmContext);
  if (!context) {
    throw new Error("useUmkm must be used within an UmkmProvider");
  }
  return context;
}
