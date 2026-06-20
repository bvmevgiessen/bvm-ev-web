import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, UserX, Clock, User as UserIcon } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'approved' | 'rejected';
  role: string;
  createdAt: number;
}

export default function LMSAdmin() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== 'admin') {
        navigate('/lms/dashboard');
      } else {
        fetchUsers();
      }
    }
  }, [user, profile, loading, navigate]);

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const fetchedUsers: UserData[] = [];
      snapshot.forEach(doc => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as UserData);
      });
      // Sort by pending first, then by date
      fetchedUsers.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setFetching(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status: newStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Fehler beim Aktualisieren des Status.");
    }
  };

  if (loading || fetching) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Laden...</div>;
  }

  const pendingCount = users.filter(u => u.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-brand-navy text-white pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/lms/dashboard" className="text-white/60 hover:text-white mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Zurück zum Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-lg text-slate-300">
            Benutzer verwalten und Registrierungen freigeben.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-brand-navy">Registrierungen</h2>
            <div className="px-4 py-2 bg-brand-orange/10 text-brand-orange rounded-full font-bold text-sm">
              {pendingCount} ausstehend
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-4 font-medium px-4">Benutzer</th>
                  <th className="pb-4 font-medium px-4">Datum</th>
                  <th className="pb-4 font-medium px-4">Status</th>
                  <th className="pb-4 font-medium px-4 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Keine Benutzer gefunden.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{u.name || 'Ohne Namen'}</div>
                          <div className="text-sm text-slate-500">{u.email}</div>
                          {u.role === 'admin' && <span className="inline-block mt-1 text-[10px] uppercase font-bold bg-brand-navy text-white px-2 py-0.5 rounded-full">Admin</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('de-DE') : 'Unbekannt'}
                    </td>
                    <td className="py-4 px-4">
                      {u.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                          <Clock size={14} /> Ausstehend
                        </span>
                      )}
                      {u.status === 'approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          <UserCheck size={14} /> Genehmigt
                        </span>
                      )}
                      {u.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                          <UserX size={14} /> Abgelehnt
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {u.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                updateUserStatus(u.id, 'approved');
                                window.open(`mailto:${u.email}?subject=Zertifikatsprogramm - Anmeldung genehmigt&body=Hallo ${u.name || ''},%0D%0A%0D%0AIhre Anmeldung wurde genehmigt! Sie können sich nun einloggen und die Module bearbeiten.%0D%0A%0D%0AViele Grüße%0D%0AIhr Diyalog Team`, '_blank');
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                              title="Genehmigen & E-Mail senden"
                            > 
                              <UserCheck size={18} />
                            </button>
                            <button
                              onClick={() => updateUserStatus(u.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                              title="Ablehnen"
                            >
                              <UserX size={18} />
                            </button>
                          </>
                        )}
                        {u.status === 'approved' && u.role !== 'admin' && (
                           <button
                             onClick={() => updateUserStatus(u.id, 'rejected')}
                             className="text-xs text-red-600 hover:underline"
                           >
                             Zugang entziehen
                           </button>
                        )}
                        {u.status === 'rejected' && (
                           <button
                             onClick={() => updateUserStatus(u.id, 'approved')}
                             className="text-xs text-green-600 hover:underline"
                           >
                             Doch genehmigen
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}