import "./App.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'animate.css';
import { useTranslation } from "react-i18next";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const {t,i18n} = useTranslation()
  const changeLanguage =(language)=>{
    i18n.changeLanguage(language)
  }

  useEffect(() => {
    AOS.init();
  }, [])


  useEffect(() => {
  const fetchData = async () => {
    try {
      let {data} = await axios.get("https://restcountries.com/v3.1/all")
      setCountries(data)
    } catch (error) {
      console.error(error);
    }
  }
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const filteredCountries = countries.filter((country) => {
    if (selectedRegion === "All") {
      return country.name.common
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else {
      return (
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) &&
        country.region.toLowerCase() === selectedRegion.toLowerCase()
      );
    }
  });

  const regions = [...new Set(countries.map((country) => country.region))];

  return (
    <div className="container mx-auto p-4">
      <div>
      <h1 className="text-4xl text-[#474747] drop-shadow-lg text-center py-[40px] font-bold mb-4">Countries Information</h1>
      
      </div>

      <div className="flex place-content-between mb-4">
        <div className="w-1/4">
          <select
            className="border border-gray-400 rounded px-4 py-3 mb-2 w-full"
            value={selectedRegion}
            onChange={handleRegionChange}
          >
            <option value="All">All Regions</option>
            {regions.map((region) => (
              <option key={region.id} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div className="w-2/4">
          <Input
            type="text"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCountries.map((country) => (
          <div  key={country.id} className="bg-white shadow-[2px_3px_10px_gray] rounded-[10px] p-4">
            <h2 className="text-lg  font-medium mb-2">{country.name.common}</h2>
            {/* <h2><strong>{country.timezones}</strong></h2> */}
            <img
              src={country.flags.svg}
              alt={country.name.common}
              className="h-32 w-auto mb-4"
            />
            <p className="mb-1">
              <strong>Capital:</strong> {country.capital}
            </p>
            <p className="mb-1">
              <strong>Region:</strong> {country.region}
            </p>
            <p className="mb-1">
              <strong>Population:</strong> {country.population}
            </p>
            <p className="mb-1">
              <strong>Official:</strong> {country.name.official}
            </p>
            <p className="mb-1">
              <strong>Area:</strong> {country.area}
            </p>
            <div>
              <Button variant="contained" color="info" ><a href={country.maps.googleMaps} target="_blank">Learn More <InfoIcon/> </a></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
