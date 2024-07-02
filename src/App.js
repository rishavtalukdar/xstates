import style from './App.css';
import { useNavigate } from "react-router-dom";
import { useEffect,useState } from 'react';


function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(
          "https://crio-location-selector.onrender.com/countries"
        );
        const countriesData = await response.json();
        setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  async function fetchStates(country) {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/states`
      );
      const statesData = await response.json();
      setStates(statesData);
      setSelectedState("");
      setCities([]);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }

  async function fetchCities(country, state) {
    try {
      const response = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`
      );
      const citiesData = await response.json();
      setCities(citiesData);
      setSelectedCity("");
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  function handleCountryChange(event) {
    const country = event.target.value;
    setSelectedCountry(country);
    fetchStates(country);
  }

  function handleStateChange(event) {
    const state = event.target.value;
    setSelectedState(state);
    fetchCities(selectedCountry, state);
  }

  function handleCityChange(event) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  return (
    <div className={style.container}>
      <h1 style={{display:"flex", justifyContent:"center"}}>Select Location</h1>
      <div className={style.selects} style={{display: 'flex', justifyContent: 'center'}}>
        <select value={selectedCountry} onChange={handleCountryChange} style={{marginRight: '10px' }}>
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          value={selectedState}
          onChange={handleStateChange}
          disabled={!selectedCountry}
          style={{marginRight: '10px' }}
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState}
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      {selectedCountry && selectedState && selectedCity && (
        <p style={{display: 'flex', justifyContent: 'center'}}>
          You selected <strong>{selectedCity}, </strong>
          <span>{selectedState}, </span>
          <span>{selectedCountry}</span>
        </p>
      )}
    </div>
  );
}

export default App;
