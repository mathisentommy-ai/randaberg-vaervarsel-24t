# Randaberg – værvarsel neste 24 timer

Separat Vercel-prosjekt med MET Norway Locationforecast 2.0 (compact).

## Publisering
1. Lag nytt GitHub-repository, og last opp `index.html` og `api/forecast.js` med samme mappestruktur.
2. Importer repository i Vercel som **Other** framework, uten build command.
3. Under Project Settings → Environment Variables: legg til `MET_CONTACT_EMAIL` med en faktisk kontaktadresse. MET Norway krever identifiserbar User-Agent med kontaktinformasjon.
4. Deploy, og åpne Vercel-adressen.

Koordinater er foreløpig 58.982, 5.569. Bytt dem i `api/forecast.js` ved behov.

Nedbør er `next_1_hours.details.precipitation_amount`, og vindkast er `instant.details.wind_speed_of_gust` når tilgjengelig. Manglende data vises som `–`, ikke null. Første 24 tilgjengelige tidspunkter fra nå vises.

Fargegrenser er **egne foreløpige tekniske terskler**, ikke offisielle MET-farevarsler eller en ferdig flommodell. Flomfare må senere ta hensyn til akkumulert nedbør, snøsmelting, frost og grunnforhold. Ingen API-nøkler trengs.
