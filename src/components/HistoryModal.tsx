import { useEffect, useState } from 'react';
import { X, Calendar, Brain, Trash2 } from 'lucide-react';
import { getHistory, clearHistory, HistoryRecord } from '../lib/historyService';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      try {
        await clearHistory();
        setHistory([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  const getClassificationColor = (classification: string) => {
    if (classification.includes('Younger')) return 'text-green-600 bg-green-50';
    if (classification.includes('Normal')) return 'text-blue-600 bg-blue-50';
    if (classification.includes('Mildly')) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getDifferenceColor = (difference: number) => {
    if (difference <= -3) return 'text-green-600';
    if (difference < 3) return 'text-blue-600';
    if (difference < 7) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Analysis History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No analysis history yet</p>
              <p className="text-gray-400 text-sm mt-2">Your analyzed scans will appear here</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                  {history.length} {history.length === 1 ? 'analysis' : 'analyses'} saved
                </p>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {history.map((record, index) => (
                  <div
                    key={record.id}
                    className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 animate-slideIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1 truncate">
                          {record.filename}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(record.created_at).toLocaleString()}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getClassificationColor(record.classification)}`}>
                        {record.classification}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-blue-600 mb-1">Chronological</p>
                        <p className="text-xl font-bold text-blue-900">{record.chronological_age}</p>
                        <p className="text-xs text-blue-600">years</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3">
                        <p className="text-xs text-purple-600 mb-1">Predicted</p>
                        <p className="text-xl font-bold text-purple-900">{record.predicted_age}</p>
                        <p className="text-xs text-purple-600">years</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-600 mb-1">Difference</p>
                        <p className={`text-xl font-bold ${getDifferenceColor(record.difference)}`}>
                          {record.difference > 0 ? '+' : ''}{record.difference}
                        </p>
                        <p className="text-xs text-gray-600">years</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
