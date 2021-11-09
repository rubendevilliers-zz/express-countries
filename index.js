import express from "express";
import cors from "cors";
import countries from "./countries.json";

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/countries/", (req, res) => {
  try {
    if (!countries) return res.status(200).json(countries);
    throw "Unavailable";
  } catch (error) {
    console.error(`Countries was not set. Error:  ${error}`);
    res.status(503).json({ message: "Service not available" });
  }
});

app.get("/states/:country", (req, res) => {
  const country = countries.filter((country) => {
    return country.iso2 === req.params.country;
  });

  if (country.length < 1) {
    res.status(404).json("Country not found");
    return;
  }

  if (country[0].states.length > 0) {
    res.status(200).send(country[0].states);
    return;
  }

  res.status(404).json({ message: "No states found" });
});

app.get("/states", (req, res) => {
  res.status(400).json({
    message: "Please provide a valid country code to retrieve the states",
  });
});

app.get("/countries/:countryCode", (req, res) => {
  const country = countries.filter(
    (country) => country.iso2 === req.params.countryCode
  );

  if (country.length > 0) {
    res.status(200).send(country);
    return;
  }

  res.status(404).json({ message: "Country not found" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
