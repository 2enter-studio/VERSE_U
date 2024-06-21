import { admin } from "./db.ts";
import { Tables, TablesInsert } from "../types.ts";
import { genRegionOptions, getArriveTime, regions } from './region.ts';
import moment from "npm:moment";

async function getTripByUserId(user_id: string) {
  const { data, error } = await admin.from("trips").select().eq("user", user_id)
    .single();
  if (error) {
    console.error(error);
    return null;
  }

  return data as Tables<"trips">;
}

function tripReady(trip: Tables<"trips">, minStayTime = 3 * 1000) {
  const now = moment();
  const arriveAt = moment(trip.arrive_at);
  const stayTime = now.diff(arriveAt);
  // console.log(now, arriveAt);
  // console.log(stayTime, minStayTime);
  return stayTime > minStayTime;
}

function genNextTrip(
  user_id: string,
  from: string,
  to: string,
): TablesInsert<"trips"> | null {
  if (!regions) return null;
  const options = genRegionOptions(to);
  if (!options) return null;

  const start_at = new Date().toISOString();
  const arrive_at = getArriveTime(start_at);

  return {
    user: user_id,
    from,
    to,
    start_at,
    arrive_at,
    ...options,
  };
}

export { genNextTrip, getTripByUserId, tripReady };
