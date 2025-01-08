import { useState, useEffect } from 'react';

const ApiTable = () => {
  const [data, setData] = useState([]); // Store the data
  const [filteredData, setFilteredData] = useState([]); // Store filtered data based on search
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [search, setSearch] = useState(""); // Search term state
  const [nextPageUrl, setNextPageUrl] = useState(null); // URL for next page
  const [prevPageUrl, setPrevPageUrl] = useState(null); // URL for previous page

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async (url) => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.data) {
          setData(result.data);
          setFilteredData(result.data); // Set filtered data initially to all data
          setNextPageUrl(result.next_page_url); // Set next page URL
          setPrevPageUrl(result.prev_page_url); // Set previous page URL
        } else {
          setError('No data available.');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    // Default API call with the first page
    fetchData('https://api.razzakfashion.com/');
  }, []); // Empty dependency array to fetch only once when the component mounts

  // Handle search term change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Filter data based on the search term
    const filtered = data.filter(record =>
      record.name.toLowerCase().includes(value.toLowerCase()) ||
      record.email.toLowerCase().includes(value.toLowerCase()) ||
      record.id.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  // Handle page change (fetch next or previous page)
  const handlePageChange = (url) => {
    if (url) {
      setLoading(true);
      fetchData(url); // Fetch data from the next or previous page URL
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>API Data Table</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            maxWidth: '300px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Table */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Email Verified At</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.email}</td>
              <td>{record.email_verified_at}</td>
              <td>{record.created_at}</td>
              <td>{record.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <div style={{ marginTop: '20px' }}>
        {prevPageUrl && (
          <button onClick={() => handlePageChange(prevPageUrl)} style={{ marginRight: '10px' }}>
            Previous
          </button>
        )}
        {nextPageUrl && (
          <button onClick={() => handlePageChange(nextPageUrl)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiTable;
