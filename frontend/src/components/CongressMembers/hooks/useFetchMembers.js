import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const useFetchMembers = (chamber, state) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chamber || !state) return;

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/members/${chamber}/${state}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching members:", error);
        setError(error);
        setLoading(false);
      });
  }, [chamber, state]);

  return { members, loading, error };
};

export default useFetchMembers;
