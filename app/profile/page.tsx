"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: string;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const currentUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "" });
  const [isDirty, setIsDirty] = useState(false);

  const profileQuery = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await authApi.getProfile();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setForm({
        name: profileQuery.data.name ?? "",
        phone: profileQuery.data.phone ?? "",
        address: profileQuery.data.address ?? "",
      });
      setIsDirty(false);
    }
  }, [profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => authApi.updateProfile(data),
    onSuccess: (res) => {
      const updated = res.data.data as UserProfile;
      // Sync auth store name
      if (currentUser && accessToken) {
        setAuth({ ...currentUser, name: updated.name ?? currentUser.name }, accessToken);
      }
      toast.success("Cập nhật hồ sơ thành công");
      setIsDirty(false);
    },
    onError: () => toast.error("Cập nhật thất bại, vui lòng thử lại"),
  });

  function handleChange(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setIsDirty(true);
  }

  const profile = profileQuery.data;

  const inputClass =
    "w-full border border-plant-border rounded-xl px-4 py-2.5 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl font-bold text-plant-text mb-8">Hồ sơ của tôi</h1>

      {/* Avatar + email */}
      <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-2xl border border-plant-border">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-plant-surface border-2 border-plant-primary/20 shrink-0">
          {profile?.avatarUrl ? (
            <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" sizes="64px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {profile?.name?.[0]?.toUpperCase() ?? "👤"}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-plant-text">{profile?.name ?? "Chưa cập nhật"}</p>
          <p className="text-sm text-plant-muted">{profile?.email}</p>
          <span className="inline-block mt-1 text-xs bg-green-100 text-plant-primary px-2 py-0.5 rounded-full font-medium">
            {profile?.role === "admin" ? "Quản trị viên" : "Khách hàng"}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-plant-border p-6 space-y-5">
        <h2 className="font-semibold text-plant-text">Thông tin cá nhân</h2>

        <div>
          <label className="block text-sm font-medium text-plant-text mb-1">Email</label>
          <input
            type="email"
            value={profile?.email ?? ""}
            disabled
            className="w-full border border-plant-border rounded-xl px-4 py-2.5 text-sm text-plant-muted bg-plant-surface cursor-not-allowed"
          />
          <p className="text-xs text-plant-muted mt-1">Email không thể thay đổi</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-plant-text mb-1">Họ và tên</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Nguyễn Văn A"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-plant-text mb-1">Số điện thoại</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="0901234567"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-plant-text mb-1">Địa chỉ</label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          onClick={() => updateMutation.mutate(form)}
          disabled={!isDirty || updateMutation.isPending}
          className="w-full bg-plant-primary hover:bg-plant-primary-light text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
