import React, { useEffect, useState } from 'react';

const StatusBar = () => {
  const [status, setStatus] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [lastLogId, setLastLogId] = useState(0);

  useEffect(() => {
    let pollTimer = null;

    const fetchLogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/logs?lastId=${lastLogId}`);
        const newLogs = await response.json();
        
        if (newLogs.length > 0) {
          const latestLog = newLogs[newLogs.length - 1];
          setLastLogId(latestLog.id);
          setStatus(latestLog.message);
          setIsVisible(true);
          
          // Hide status after 3 seconds of no updates
          setTimeout(() => setIsVisible(false), 3000);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    // Poll every 500ms
    pollTimer = setInterval(fetchLogs, 500);

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, [lastLogId]);

  return (
    <div
      className={`fixed bottom-24 left-0 right-0 flex justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-zinc-800 text-blue-400 px-4 py-2 rounded-full text-sm font-mono shadow-lg border border-blue-400">
        {status}
      </div>
    </div>
  );
};

export default StatusBar; 