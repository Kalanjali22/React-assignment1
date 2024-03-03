import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './Table/Table';
import axios from "axios";
import moment from "moment";

function App() {
  const url = "http://localhost:8080/customers/";
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [pageCounts, setPageCounts] = useState(0);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState([]);

  const fetchData = async () => {
    const resp = await axios.get(url);
    console.log(resp);
    const rows = resp.data.map((el) => ({
      ...el,
      date: moment(el.created_at).format("YYYY-MM-DD"),
      time: moment(el.created_at).format("HH:mm:ss")
    }));
    setData(rows);
    setResult(rows);
    setPageCounts(Math.ceil(resp.data.length / 20));
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const _result = data.filter((el) => el.customer_name.toLowerCase().includes(searchKey) || el.location.toLowerCase().includes(searchKey));
    setResult(_result);
    setPageCounts(Math.ceil(_result.length / 20));
    setPage(1);
  }, [searchKey])

  const columns = React.useMemo(
    () => [
      { Header: 'sno', accessor: 'sno' },
      { Header: 'customer name', accessor: 'customer_name' },
      { Header: 'age', accessor: 'age' },
      { Header: 'phone', accessor: 'phone' },
      { Header: 'location', accessor: 'location' },
      { Header: 'date', accessor: 'date' },
      { Header: 'time', accessor: 'time' },
    ],
    []
  );

  console.log(pageCounts);

  return (
    <div>
      <h1>Customer Data</h1>

      <div>
        <input value={searchKey} onChange={(e) => setSearchKey(e.target.value)} placeholder="Search..." />
      </div>
      <div>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
            {
              [...Array(pageCounts)].map((el, index) => (
                <li className="page-item" key={index}><a className="page-link" href="#" onClick={(e) => {
                  e.preventDefault();
                  setPage(index + 1);
                }}>{index + 1}</a></li>
              ))
            }
          </ul>
        </nav>
      </div>
      <Table columns={columns} data={result.slice((page - 1) * 20, page * 20)} />
    </div>
  );
};

export default App;
