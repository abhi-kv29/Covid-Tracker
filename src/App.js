import { FormControl, Select, MenuItem, CardContent, Card, } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox.js';
import Map from './Map.js';
import Table from './Table.js';
import { sortData, prettyPrintStat } from './util.js';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  
  document.title = 'Covid Tracker';

  const [casesType, setCasesType] = useState("cases");
  const [countries,setCountries]  = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

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
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode ==='worldwide' 
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
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
        <InfoBox
        active={casesType === "cases"}
        onClick={(e) => setCasesType("cases")}
        title="Coronavirus cases" 
        isRed
        cases={prettyPrintStat(countryInfo.todayCases)} 
        total={numeral(countryInfo.cases).format("0.0a")} />
        <InfoBox
        active={casesType === "recovered"} 
        onClick={(e) => setCasesType("recovered")}
        title="Recovered" 
        isRed
        cases={prettyPrintStat(countryInfo.todayRecovered)}
        total={numeral(countryInfo.recovered).format("0.0a")} />
        <InfoBox
        active={casesType === "deaths"}
        onClick={(e) => setCasesType("deaths")}
        title="Deaths" 
        isRed
        cases={prettyPrintStat(countryInfo.todayDeaths)}
        total={numeral(countryInfo.deaths).format("0.0a")} />
      </div>

      <Map 
        casesType = {casesType}
        countries = {mapCountries}
        center = {mapCenter}
        zoom = {mapZoom}
      />
      </div>
      <Card className="app-right">
        <CardContent>
          <div className="app-information">
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app-graphTitle" >Worldwide new {casesType}</h3>
          <LineGraph className = "app-graph" casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
