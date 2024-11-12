export { default as Menu } from './menu.svelte';
export { default as MyProfile } from './my_profile.svelte';
export { default as SystemMessage } from './system_message.svelte';
export { default as TripStatus } from './trip_status.svelte';

export { SideMenu } from './side_menu';

export { default as Coin } from './coin.svelte';

import me from './me/+page.svelte';
import social from './social/+page.svelte';
import map from './map/+page.svelte';
import update from './update/+page.svelte';
import maintain from './maintain/+page.svelte';
import create_profile from './auth/create-profile/+page.svelte';
import account from './auth/account/+page.svelte';
import shop from './shop/+page.svelte';

const pages = { me, map, social, update, maintain, create_profile, account, shop };
export { pages };
