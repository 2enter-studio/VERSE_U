export { default as Menu } from './menu.svelte';
export { default as SideMenu } from './side_menu.svelte';
export { default as MyProfile } from './my_profile.svelte';
export { default as Settings } from './settings.svelte';
export { default as SystemMessage } from './system_message.svelte';
export { default as TripStatus } from './trip_status.svelte';
import me from './me/+page.svelte';
import social from './social/+page.svelte';
import map from './map/+page.svelte';
import update from './update/+page.svelte';
import maintain from './maintain/+page.svelte';

const pages = { me, map, social, update, maintain };
export { pages };
