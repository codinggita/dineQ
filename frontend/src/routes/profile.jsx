import { PageShell } from '@/components/layout/PageShell';
import {
  Mail,
  Phone,
  MapPin,
  Bell,
  CreditCard,
  Heart,
  Settings,
  Shield,
  Camera,
  Upload,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('Account');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const tabs = ['Account', 'Preferences', 'Favorites', 'Payment'];

  const validateFile = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PNG, JPG, and WebP images are allowed';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File must be less than 5MB';
    }
    return null;
  };

  const handleFileSelect = useCallback((file) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    setUploadError('');
    setPreviewFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleCancelPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFile(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmUpload = async () => {
    if (!previewFile) return;
    setUploading(true);
    setUploadError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', previewFile);

      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/auth/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      const response = await res.json();
      const avatarUrl = response.data.avatar.startsWith('http')
        ? response.data.avatar
        : `${apiUrl}${response.data.avatar}`;
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      handleCancelPreview();
    } catch (err) {
      setUploadError(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const getFullAvatarUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          const apiUrl = import.meta.env.VITE_API_URL;
          const res = await fetch(`${apiUrl}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const response = await res.json();
            const userData = {
              ...response.data,
              avatar: response.data.avatar ? getFullAvatarUrl(response.data.avatar) : '',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({ ...parsed, avatar: getFullAvatarUrl(parsed.avatar) });
          }
        } else if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser({ ...parsed, avatar: getFullAvatarUrl(parsed.avatar) });
        }
      } catch (e) {
        console.error('Failed to fetch profile', e);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl border border-border/60 bg-card overflow-hidden">
          <div className="h-32 sm:h-40 gradient-gold relative">
            <div className="absolute inset-0 noise-bg opacity-40" />
          </div>
          <div className="px-6 sm:px-8 pb-6 -mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              {loading ? (
                <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl" />
              ) : (
                <>
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-card"
                      />
                    ) : (
                      <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-surface-2 border-4 border-card grid place-items-center font-display text-3xl font-bold gradient-text-gold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-background/60 backdrop-blur-sm grid place-items-center transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <Upload
                        className={`h-6 w-6 ${isDragging ? 'text-gold' : 'text-foreground'}`}
                      />
                    </div>
                    {isDragging && (
                      <div className="absolute -inset-4 rounded-3xl border-2 border-dashed border-gold bg-gold/10 grid place-items-center z-10">
                        <span className="text-sm font-medium text-gold">Drop to upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                </>
              )}
            </div>
            <div className="flex-1">
              {loading ? (
                <Skeleton className="h-7 w-32" />
              ) : (
                <h1 className="font-display text-2xl font-bold">{user?.name || 'User'}</h1>
              )}
              {loading ? (
                <Skeleton className="h-4 w-48 mt-1" />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'staff' ? 'Staff Member' : 'Customer'}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              {loading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-16" />)
              ) : (
                <>
                  <Mini n="0" l="Visits" />
                  <Mini n="0h" l="Saved" />
                  <Mini n="-" l="Rating" />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-b border-border/60 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${tab === t ? 'border-gold text-gold' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <ProfileSkeleton />
          ) : (
            <>
              {tab === 'Account' && <AccountTab user={user} />}
              {tab === 'Preferences' && <PrefsTab />}
              {tab === 'Favorites' && <FavoritesTab />}
              {tab === 'Payment' && <PaymentTab />}
            </>
          )}
        </div>
      </section>

      {previewUrl && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-sm w-full mx-4 shadow-elegant">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Update Profile Picture</h3>
              <button
                onClick={handleCancelPreview}
                className="p-1 hover:bg-surface-2 rounded-full transition"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-surface-2 mb-4">
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <p className="text-xs text-muted-foreground mb-4 truncate">
              {previewFile?.name} ({(previewFile?.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            {uploadError && (
              <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleCancelPreview}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-gold/40 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2.5 rounded-lg gradient-gold text-primary-foreground text-sm font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function Mini({ n, l }) {
  return (
    <div>
      <p className="font-display text-xl font-bold">{n}</p>
      <p className="text-xs text-muted-foreground">{l}</p>
    </div>
  );
}

function AccountTab({ user }) {
  const isGoogleUser = !user?.password; // Google users don't have password

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">Personal information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Keep your details current for a smoother experience.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Field label="Name" value={user?.name || ''} />
          <Field label="Email" icon={Mail} value={user?.email || ''} />
          <Field label="Role" value={user?.role === 'staff' ? 'Staff Member' : 'Customer'} />
          <Field label="Account Type" value={isGoogleUser ? 'Google Account' : 'Email/Password'} />
        </div>
        {user?.avatar && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Profile Image</p>
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-xl object-cover" />
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button className="px-5 py-2.5 rounded-lg gradient-gold text-primary-foreground font-medium shadow-gold hover:opacity-90 text-sm">
            Save changes
          </button>
          <button className="px-5 py-2.5 rounded-lg border border-border text-sm hover:border-gold/40">
            Cancel
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <ActionCard
          icon={Shield}
          title="Security"
          desc={isGoogleUser ? 'Managed by Google' : 'Password, 2FA, sessions'}
        />
        <ActionCard icon={Settings} title="Account settings" desc="Language, timezone" />
        <button className="w-full text-left px-5 py-4 rounded-2xl border border-destructive/20 hover:border-destructive/40 transition">
          <p className="text-sm font-medium text-destructive">Delete account</p>
          <p className="text-xs text-muted-foreground mt-0.5">Permanent and irreversible.</p>
        </button>
      </div>
    </div>
  );
}

function PrefsTab() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-5">
      <h2 className="font-display text-xl font-semibold">Notifications & preferences</h2>
      {[
        { i: Bell, t: 'Queue updates', d: 'Buzz me when my table is almost ready', on: true },
        { i: Bell, t: 'Pre-order confirmations', d: 'Receipts sent to email', on: true },
        { i: Heart, t: 'New restaurants', d: 'Get notified about openings near me', on: false },
        { i: Bell, t: 'Weekly digest', d: 'Best dining spots, every Friday', on: true },
      ].map((p, i) => (
        <Toggle key={i} {...p} />
      ))}
    </div>
  );
}

function FavoritesTab() {
  const favs = [
    { name: 'Ember & Oak', c: 'Modern Steakhouse' },
    { name: 'Kaiseki Mori', c: 'Japanese Omakase' },
    { name: 'Trattoria Luce', c: 'Italian' },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favs.map((f) => (
        <div
          key={f.name}
          className="rounded-2xl border border-border/60 bg-card p-5 hover:border-gold/40 transition"
        >
          <Heart className="h-5 w-5 text-gold fill-gold" />
          <h3 className="mt-3 font-display font-semibold">{f.name}</h3>
          <p className="text-sm text-muted-foreground">{f.c}</p>
        </div>
      ))}
    </div>
  );
}

function PaymentTab() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">Payment methods</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Used to charge pre-orders after you sit down.
      </p>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl border border-gold/30 bg-gold/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-14 rounded-md gradient-gold grid place-items-center">
              <CreditCard className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Visa •••• 4242</p>
              <p className="text-xs text-muted-foreground">Default · Exp 09/27</p>
            </div>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground">Edit</button>
        </div>
        <button className="w-full p-4 rounded-xl border border-dashed border-border hover:border-gold/40 hover:text-gold text-sm transition">
          + Add new card
        </button>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <input
          defaultValue={value}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 rounded-lg bg-input border border-border focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 text-sm`}
        />
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc }) {
  return (
    <button className="w-full text-left px-5 py-4 rounded-2xl border border-border/60 bg-card hover:border-gold/40 transition flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-gold/10 grid place-items-center text-gold shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </button>
  );
}

function Toggle({ i: Icon, t, d, on }) {
  const [checked, setChecked] = useState(on);
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-9 w-9 rounded-lg bg-gold/10 grid place-items-center text-gold shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{t}</p>
        <p className="text-xs text-muted-foreground">{d}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'gradient-gold' : 'bg-secondary'}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}
