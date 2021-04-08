import { FormControl, Select, MenuItem, CardContent, Card } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox.js';
import Map from './Map.js';
import Table from './Table.js';
import { sortData } from "./util.js";

function App() {
  
  document.title = 'Covid Tracker';
  const [countries,setCountries]  = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => { 
        const countries = data.map((country) => (
          {
          name: country.country,
          value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode ==='worldwide' ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

     fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="app">
      <div className="app-left">
      <div className="app-header">
      <h1>COVID TRACKER</h1>
      <FormControl className="app-dropdown">
      <Select variant="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select></FormControl>
      </div>

      <div className="app-stats">
        <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
        <InfoBox title="Recoveries" cases={countryInfo.todayRecovered} total ={countryInfo.recovered} />
        <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
      </div>

      <Map />
      </div>
      <Card className="app-right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
