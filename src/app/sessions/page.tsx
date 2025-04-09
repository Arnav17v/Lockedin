'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import { useTheme } from '@/providers/ThemeProvider';

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

// List of numeric fields for sorting
type NumericField = 'total_duration_sec' | 'focused_time_sec' | 'wasted_time_sec' | 
                    'drowsy_time_sec' | 'max_attention_span_sec' | 
                    'avg_attention_span_sec' | 'wasted_percentage';

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

export default function SessionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<keyof StudySession>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 15;
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

  const handleSort = (field: keyof StudySession) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new sort field
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'timestamp') {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    } else {
      // Check if the field is a numeric field
      const numericFields: NumericField[] = [
        'total_duration_sec', 'focused_time_sec', 'wasted_time_sec',
        'drowsy_time_sec', 'max_attention_span_sec', 
        'avg_attention_span_sec', 'wasted_percentage'
      ];
      
      if (numericFields.includes(sortField as NumericField)) {
        comparison = a[sortField] as number - (b[sortField] as number);
      }
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginate sessions
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sortedSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);

  // Generate pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Table header with sort functionality
  const SortableHeader = ({ field, label }: { field: keyof StudySession; label: string }) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {label}
        {sortField === field && (
          <span className="ml-1">
            {sortDirection === 'asc' ? '▲' : '▼'}
          </span>
        )}
      </div>
    </th>
  );

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Session Logs</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Detailed records of all your study sessions.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your session data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg text-center">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">No session data found</h3>
          <p className="mt-2 text-yellow-700 dark:text-yellow-300">
            Use the StudyLens desktop app to track your study sessions and send data to your dashboard.
          </p>
        </div>
      ) : (
        <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <SortableHeader field="timestamp" label="Date & Time" />
                  <SortableHeader field="total_duration_sec" label="Duration" />
                  <SortableHeader field="focused_time_sec" label="Focused Time" />
                  <SortableHeader field="wasted_time_sec" label="Wasted Time" />
                  <SortableHeader field="drowsy_time_sec" label="Drowsy Time" />
                  <SortableHeader field="max_attention_span_sec" label="Max Attention Span" />
                  <SortableHeader field="avg_attention_span_sec" label="Avg Attention Span" />
                  <SortableHeader field="wasted_percentage" label="Wasted %" />
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {currentSessions.map((session) => (
                  <tr key={session._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {format(new Date(session.timestamp), 'PPP p')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(session.total_duration_sec)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(session.focused_time_sec)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(session.wasted_time_sec)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(session.drowsy_time_sec)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(session.max_attention_span_sec)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(session.avg_attention_span_sec)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {session.wasted_percentage.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{indexOfFirstSession + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastSession, sessions.length)}
                    </span>{' '}
                    of <span className="font-medium">{sessions.length}</span> sessions
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      &laquo; Previous
                    </button>
                    
                    {pageNumbers.map(number => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                          currentPage === number 
                            ? 'z-10 bg-blue-50 dark:bg-blue-800 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-300' 
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next &raquo;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 