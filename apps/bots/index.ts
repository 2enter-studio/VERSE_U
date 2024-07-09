import { getExpiredTrips, upsertTrips } from './db/trips';
import { TRIP_UPDATE_TIMEOUT } from './config';
import { fillStarterPack } from './db/wearings.ts';

// Start auto-tripper
setInterval(async () => {
  const expiredTrips = await getExpiredTrips();
  if ('error' in expiredTrips) {
    console.error(expiredTrips.error);
    return;
  }

  const newTrips = await upsertTrips(expiredTrips);
  if ('error' in newTrips) {
    console.error(newTrips.error);
    return;
  }

  if (newTrips.length > 0) {
    console.log(`Successfully updated trips for ${newTrips.length} trips`);
    for (const trip of newTrips) {
      console.log(trip.id);
    }
  } else {
    console.log(`No expired trips found, do nothing.`);
  }
}, TRIP_UPDATE_TIMEOUT);

// const result = await fillStarterPack();
// if (result?.error) console.error(result.error);
