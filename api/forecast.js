
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
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": `RandabergFlomvarsel/1.0 ${email}`,
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
      .slice(0, 24)
      .map(item => {
        const details = item.data.instant.details;
        const next = item.data.next_1_hours?.details;

        return {
          time: item.time,
          temperature: details.air_temperature,
          wind: details.wind_speed,
          gust: details.wind_speed_of_gust ?? null,
          precipitation: next?.precipitation_amount ?? null
        };
      });

    res.setHeader("Cache-Control", "s-maxage=600");

    return res.status(200).json({
      source: "MET Norway Locationforecast 2.0",
      updated: new Date().toISOString(),
      hours
    });
  } catch (error) {
    return res.status(500).json({
      error: "Kunne ikke hente værvarsel"
    });
  }
}
