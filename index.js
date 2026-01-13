import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const todayDate = new Date();
const openWeatherApiKey = "********";
const openWeatherApiBase = "http://api.weatherapi.com/v1/forecast.json";
const currLocationAPI = "http://ip-api.com/json/";
app.use(bodyParser.urlencoded({ extended: true }));

//http://api.weatherapi.com/v1/forecast.json?key=****************&days=2&aqi=yes&alerts=yes&q=Johannesburg

// Set EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Public folder
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        //get current location using the API
        const response = await axios.get(currLocationAPI);
        const results = response.data;

        //get data from the weather API and insert the city name obtained from the current location API
        const weatherResponse = await axios.get(openWeatherApiBase + `?key=${openWeatherApiKey}&days=1&aqi=yes&alerts=yes&q=${results.country}`);

        res.render("index", {
            location: results.city,
            country: results.country,
            time: ((new Date()).toDateString()).slice(4,),
            temp:weatherResponse.data.current.temp_c,
            conditionImgLink: `https:${weatherResponse.data.current.condition.icon}`,
            conditionComment: weatherResponse.data.current.condition.text,
            humid: weatherResponse.data.current.humidity,
            windSpeed: weatherResponse.data.current.wind_kph,
            windDirection: weatherResponse.data.current.wind_dir,
            windAngle: weatherResponse.data.current.wind_degree
        });
    } catch (error) {
        res.render("index", {
            location: "Unknown",
            country: "Unknown",
            time: ((new Date()).toDateString()).slice(4,),
            temp: "Unknown",
            conditionImgLink: "Unknown",
            conditionComment: "Unknown",
            humid: "Unknown",
            windSpeed: "Unknown",
            windDirection: "Unknown",
            windAngle: "Unkown"
        });
    }
});

app.post("/submit", async (req, res) => {
    try {
        const date = (req.body.date);
        //console.log(openWeatherApiBase+`?key=${openWeatherApiKey}&days=1&aqi=yes&alerts=yes&q=${req.body.city}&dt=${date}`);
        const weatherResponse = await axios.get(openWeatherApiBase+`?key=${openWeatherApiKey}&days=1&aqi=yes&alerts=yes&q=${req.body.city}&dt=${date}`);
        const results = weatherResponse.data;
        console.log(results);

        res.render("index", {
            location: req.body.city,
            country: results.location.country,
            time: ((new Date()).toDateString()).slice(4,),
            temp:weatherResponse.data.current.temp_c,
            conditionImgLink: `https:${weatherResponse.data.current.condition.icon}`,
            conditionComment: weatherResponse.data.current.condition.text,
            humid: weatherResponse.data.current.humidity,
            windSpeed: weatherResponse.data.current.wind_kph,
            windDirection: weatherResponse.data.current.wind_dir,
            windAngle: weatherResponse.data.current.wind_degree
        });
    } catch (error) {
        res.render("index", {
            location: "Unknown",
            country: "Unknown",
            time: ((new Date()).toDateString()).slice(4,),
            temp: "Unknown",
            conditionImgLink: "Unknown",
            conditionComment: "Unknown",
            humid: "Unknown",
            windSpeed: "Unknown",
            windDirection: "Unknown",
            windAngle: "Unkown"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

