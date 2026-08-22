import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, WalletCards } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { BudgetBreakdown } from '../components/BudgetBreakdown';
import api from '../api/axios';

export const TripBudget: React.FC = () => { const { id } = useParams<{ id: string }>(); const [trip, setTrip] = useState<any>(null); useEffect(() => { api.get(`/trips/${id}`).then((response) => setTrip(response.data.trip)); }, [id]); if (!trip) return <div className="min-h-screen bg-paper flex items-center justify-center"><Loader2 className="animate-spin text-teal" /></div>; return <div className="min-h-screen bg-paper text-charcoal font-sans"><header className="border-b border-sand"><div className="max-w-5xl mx-auto px-4 py-4"><Link to={`/trips/${id}`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal"><ArrowLeft className="h-4 w-4" />{trip.title}</Link></div></header><main className="max-w-5xl mx-auto px-4 py-10"><div className="flex items-center gap-3 mb-8"><WalletCards className="h-6 w-6 text-coral" /><div><p className="text-[10px] uppercase tracking-widest text-coral font-extrabold">Trip finances</p><h1 className="text-3xl font-editorial font-bold">Budget & expenses</h1></div></div><BudgetBreakdown tripId={trip.id} refreshTrigger={0} /></main></div>; };
