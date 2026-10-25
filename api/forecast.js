
export default async function handler(req, res) {
  const lat = 59.0;
  const lon = 5.6;
  const email = process.env.MET_CONTACT_EMAIL;

  if (!email) {
    return res.status(500).json({
      error: "MET_CONTACT_EMAIL mangler i Vercel"
    });
  }

  try {
    const url =
      `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": `RandabergVaervarsel/1.0 ${email}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `MET Norway svarte ${response.status}`
      });
    }

    const data = await response.json();

    const hours = data.properties.timeseries
      .filter(item => new Date(item.time) >= new Date())
      .map(item => {
        const instant = item.data.instant.details;
        const next1 = item.data.next_1_hours?.details ?? {};
        const next6 = item.data.next_6_hours?.details ?? {};

        return {
          time: item.time,
          temperature: instant.air_temperature ?? null,
          wind: instant.wind_speed ?? null,
          gust: instant.wind_speed_of_gust ?? null,
          windDirection: instant.wind_from_direction ?? null,
          precipitation: next1.precipitation_amount ?? null,
          precipitationMin: next1.precipitation_amount_min ?? null,
          precipitationMax: next1.precipitation_amount_max ?? null,
          precipitationProbability:
            next1.probability_of_precipitation ?? null,
          precipitation6h: next6.precipitation_amount ?? null,
          precipitation6hMin: next6.precipitation_amount_min ?? null,
          precipitation6hMax: next6.precipitation_amount_max ?? null,
          humidity: instant.relative_humidity ?? null,
          pressure: instant.air_pressure_at_sea_level ?? null
        };
      });

    res.setHeader("Cache-Control", "s-maxage=600");

    return res.status(200).json({
      source: "MET Norway Locationforecast 2.0 complete",
      updated: new Date().toISOString(),
      forecastUpdated: data.properties.meta.updated_at,
      hours
    });

  } catch (error) {
    return res.status(500).json({
      error: "Kunne ikke hente komplett værvarsel"
    });
  }
}
