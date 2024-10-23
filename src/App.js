import React, { useState } from 'react';
import './PincodeLookup.css';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message,setMessage]=useState('');

  const handleInputChange = (event) => {
    setPincode(event.target.value);
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value.toLowerCase();
    const filtered = data.filter(postOffice =>
      postOffice.Name.toLowerCase().includes(filterValue)
    );
    setFilteredData(filtered);
  };

  const handleLookup = async () => {
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode.');
      setData([]);
      setFilteredData([]);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await response.json();
      console.log(result);
    
      if (result[0].Status === "Success") {
        setData(result[0].PostOffice);
        setFilteredData(result[0].PostOffice);
        setMessage(result[0].Message)
      } else {
        setError('No data found for this pincode.');
        setData([]);
        setFilteredData([]);
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Pincode Lookup</h1>
      <input
        type="text"
        value={pincode}
        onChange={handleInputChange}
        placeholder="Enter 6-digit Pincode"
      />
      <button onClick={handleLookup}>Lookup</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <div className="loader">Loading...</div>}
      <br></br>
      <br></br>
      <input
      id='textFilter'
        type="text"
        onChange={handleFilterChange}
        placeholder="Filter by Post Office Name"
      />
      {filteredData.length === 0 && !loading && (
        <p>Couldn’t find the postal data you’re looking for...</p>
      )}
      
      {filteredData.length > 0 && (
        <div>
          <h2>Pincode: {pincode}</h2>
          <h2>Message: {message}</h2>
          <ul>
            {filteredData.map((postOffice) => (
              <li key={postOffice.Name}>
                <strong>Post Office Name:</strong> {postOffice.Name}<br />
                <strong>Branch Type:</strong> {postOffice.BranchType}<br />
                <strong>Delivery Status:</strong> {postOffice.DeliveryStatus}<br />
                <strong>District:</strong> {postOffice.District}<br />
                <strong>State:</strong> {postOffice.State}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PincodeLookup;