"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import apiClient from "@/lib/api/client";
import { formatDate } from "@/lib/utils/formatDate";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 20;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin", "users", page],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/users", {
        params: { page, limit: LIMIT },
      });
      return res.data;
    },
  });

  const banMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.put(`/api/v1/admin/users/${id}/ban`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const handleBan = (user: User) => {
    if (confirm(`Khóa tài khoản "${user.name}"?`)) {
      banMutation.mutate(user.id);
    }
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-2xl font-bold text-plant-text">
        Người dùng
      </h2>

      <div className="bg-white rounded-xl border border-plant-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-plant-surface">
              <tr>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Avatar
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Tên
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Vai trò
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Ngày tạo
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plant-border">
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.items ?? []).map((user) => (
                    <tr key={user.id} className="hover:bg-plant-surface/50">
                      <td className="px-4 py-3">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-plant-surface border border-plant-border flex items-center justify-center text-plant-muted text-xs font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-plant-text">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-plant-muted">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-plant-primary/10 text-plant-primary"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.isBanned ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Đã khóa
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Hoạt động
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-plant-muted">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {!user.isBanned && (
                          <button
                            onClick={() => handleBan(user)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Khóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              {!isLoading && (data?.items ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-plant-muted"
                  >
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-plant-border flex items-center justify-between text-sm">
            <span className="text-plant-muted">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border border-plant-border rounded-lg disabled:opacity-40 hover:bg-plant-surface transition-colors"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-plant-border rounded-lg disabled:opacity-40 hover:bg-plant-surface transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
