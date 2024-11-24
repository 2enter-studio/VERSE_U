// import { db } from "@/db"
// import { authState } from "./auth.svelte.js"
class UnergyState {
  unergy = $state(0)

  setUnergy(unergy: number) {
    console.log('setUnergy', unergy)
    this.unergy = unergy
  }

  getUnergy() {
    return this.unergy
  }

  addUnergy(unergy: number) {
    this.unergy += unergy
    try {
      this.setUnergyToDB(this.unergy)
    } catch (error) {
      console.error(error)
    }
  }

  subUnergy(unergy: number) {
    this.unergy -= unergy
    // try {
    //   this.setUnergyToDB(this.unergy)
    // } catch (error) {
    //   console.error(error)
    // }
  }

  // async setUnergyToDB(unergy: number) {
  //   const user_id = authState.user?.id
  //   const { data, e } = await db.from('profiles').select('*').eq('user', user_id).single()
  //   const { error } = await db.from('profiles').update({ unergy: unergy }).eq('user', user_id)
  //   if (error) {
  //     console.error(error)
  //   }
  // }

}



export const unergyState = new UnergyState()