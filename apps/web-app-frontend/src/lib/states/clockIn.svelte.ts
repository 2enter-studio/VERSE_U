// import { db } from "@/db"
import { authState } from "./auth.svelte.js"
class ClockInState {
  clockIn = $state(null)

  initClockIn() {
    this.clockIn = authState.profile?.clock_in
  }

  setClockIn(clockIn) {
    this.clockIn = clockIn
    // this.setClockInToDB(clockIn)
  }

  getClockIn() {
    return this.clockIn
  }

 
  // async setClockInToDB(clockIn) {
  //   const user_id = authState.user?.id
  //   const { data, e } = await db.from('profiles').select('*').eq('user', user_id).single()
  //   const { error } = await db.from('profiles').update({ clock_in: clockIn }).eq('user', user_id)
  //   if (error) {
  //     console.error(error)
  //   }
  // }

}



export const clockInState = new ClockInState()