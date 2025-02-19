import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Briefcase, UserCheck, Activity, TrendingUp, Clock } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    totalOffres: 0,
    totalCandidatures: 0,
    offresByStatus: [],
    candidaturesByStatus: [],
    candidaturesParMois: [],
    tauxConversion: 0,
    offreRecente: [],
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/dashboard/stats/',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      
      {/* Cartes des statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Offres</p>
                <p className="text-2xl font-bold">{stats.totalOffres}</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Candidatures</p>
                <p className="text-2xl font-bold">{stats.totalCandidatures}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Taux de Conversion</p>
                <p className="text-2xl font-bold">{stats.tauxConversion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Entretiens Planifiés</p>
                <p className="text-2xl font-bold">
                  {stats.candidaturesByStatus.find(s => s.status === 'Entretien planifié')?.count || 0}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Évolution des Candidatures</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.candidaturesParMois}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="nombre" stroke="#570DF8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Statuts des Candidatures</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.candidaturesByStatus}
                    nameKey="status"
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats.candidaturesByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Offres récentes */}
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          <h2 className="card-title">Offres Récentes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Candidatures</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.offreRecente.map((offre, index) => (
                  <tr key={index}>
                    <td>{offre.titre}</td>
                    <td>{new Date(offre.date).toLocaleDateString()}</td>
                    <td>{offre.nombreCandidatures}</td>
                    <td>
                      <div className={`badge ${
                        offre.statut === 'Active' ? 'badge-success' : 
                        offre.statut === 'Clôturée' ? 'badge-error' : 
                        'badge-warning'
                      }`}>
                        {offre.statut}
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
};

export default Home;