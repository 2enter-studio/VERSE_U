import { db } from "@/db"
import { authState } from "./auth.svelte"
class ClockInState {
  clockIn = $state(null)

  setClockIn(clockIn) {
    this.clockIn = clockIn
    this.setClockInToDB(clockIn)
  }

  getClockIn() {
    return this.clockIn
  }

 
  async setClockInToDB(clockIn) {
    const user_id = authState.user?.id
    console.log(user_id)
    const { data, e } = await db.from('profiles').select('*').eq('user', user_id).single()
    console.log(data)
    const { error } = await db.from('profiles').update({ clock_in: clockIn }).eq('user', user_id)
    if (error) {
      console.error(error)
    }
  }

}



export const clockInState = new ClockInState()