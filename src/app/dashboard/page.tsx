'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@/providers/ThemeProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the session type
type StudySession = {
  _id: string;
  userId?: string; // Make userId optional since external API uses username
  username?: string; // Add username field for external API
  timestamp: string;
  total_duration_sec: number;
  focused_time_sec: number;
  wasted_time_sec: number;
  drowsy_time_sec: number;
  max_attention_span_sec: number;
  avg_attention_span_sec: number;
  wasted_percentage: number;
  createdAt?: string; // Make optional since external API might not have these
  updatedAt?: string; // Make optional since external API might not have these
};

// Format seconds to human-readable time
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(1)}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      fetchSessions();
    }
  }, [status, router]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load study sessions');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalStudyTime = sessions.reduce((acc, session) => acc + session.total_duration_sec, 0);
  const totalFocusedTime = sessions.reduce((acc, session) => acc + session.focused_time_sec, 0);
  const overallFocusPercentage = totalStudyTime > 0 
    ? (totalFocusedTime / totalStudyTime) * 100 
    : 0;
  const avgSessionLength = sessions.length > 0 
    ? totalStudyTime / sessions.length 
    : 0;
  const avgPeakFocus = sessions.length > 0 
    ? sessions.reduce((acc, session) => acc + session.max_attention_span_sec, 0) / sessions.length 
    : 0;

  // Get highest focus session
  const highestFocusSession = sessions.length > 0 
    ? sessions.reduce((prev, current) => 
        (100 - prev.wasted_percentage) > (100 - current.wasted_percentage) ? prev : current
      ) 
    : null;
  
  // Get longest attention span session
  const longestAttentionSpanSession = sessions.length > 0 
    ? sessions.reduce((prev, current) => 
        prev.max_attention_span_sec > current.max_attention_span_sec ? prev : current
      ) 
    : null;

  // Recent sessions for chart data (last 10)
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
    .reverse();

  const chartData = {
    labels: recentSessions.map((session) => 
      format(new Date(session.timestamp), 'MMM d')
    ),
    datasets: [
      {
        label: 'Focus %',
        data: recentSessions.map((session) => 100 - session.wasted_percentage),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // Chart options with dark mode support
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: 'Recent Focus Trend',
        color: theme === 'dark' ? '#e5e7eb' : '#374151',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Focus %',
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
        },
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
        },
      },
    },
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Track your study performance and improve your focus over time.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your study data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">No study sessions found</h3>
          <p className="mt-2 text-yellow-700 dark:text-yellow-300">
            Use the StudyLens desktop app to track your study sessions and send data to your dashboard.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Study Time</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{formatTime(totalStudyTime)}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overall Focus</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{overallFocusPercentage.toFixed(1)}%</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Session Length</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{formatTime(avgSessionLength)}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Peak Focus</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{formatTime(avgPeakFocus)}</p>
            </div>
          </div>

          {/* Focus Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Line options={chartOptions} data={chartData} height={80} />
          </div>

          {/* Recent Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Study Sessions</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentSessions.slice(0, 5).map((session) => (
                <div key={session._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {format(new Date(session.timestamp), 'PPP p')}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Duration: {formatTime(session.total_duration_sec)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium" style={{ 
                        color: theme === 'dark' 
                          ? ((100 - session.wasted_percentage) > 75 
                            ? '#10b981' 
                            : (100 - session.wasted_percentage) > 50 
                              ? '#38bdf8' 
                              : (100 - session.wasted_percentage) > 25 
                                ? '#fbbf24' 
                                : '#ef4444')
                          : ((100 - session.wasted_percentage) > 75 
                            ? '#047857' 
                            : (100 - session.wasted_percentage) > 50 
                              ? '#0369a1' 
                              : (100 - session.wasted_percentage) > 25 
                                ? '#b45309' 
                                : '#b91c1c')
                      }}>
                        Focus: {(100 - session.wasted_percentage).toFixed(1)}%
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Peak Focus: {formatTime(session.max_attention_span_sec)}
                      </p>
                      {session.drowsy_time_sec > 0 && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          Drowsy: {formatTime(session.drowsy_time_sec)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <Link 
                href="/sessions" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all sessions →
              </Link>
            </div>
          </div>

          {/* Personal Bests */}
          {(highestFocusSession || longestAttentionSpanSession) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Bests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {highestFocusSession && (
                  <div className="border rounded-lg p-4 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Highest Focus</p>
                    <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {(100 - highestFocusSession.wasted_percentage).toFixed(1)}%
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(highestFocusSession.timestamp), 'PPP')}
                    </p>
                  </div>
                )}
                
                {longestAttentionSpanSession && (
                  <div className="border rounded-lg p-4 bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Longest Peak Focus</p>
                    <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-300">
                      {formatTime(longestAttentionSpanSession.max_attention_span_sec)}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(longestAttentionSpanSession.timestamp), 'PPP')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 