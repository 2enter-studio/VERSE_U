import { apiUrl } from './apiUrl';

function triggerHaiAnRoad(body: Record<string, unknown>) {
  return fetch(apiUrl('edge-function', 'hai-an-road'), {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

function useCoupon(body: Record<string, unknown>) {
  return fetch(apiUrl('edge-function', 'use-coupon'), {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export { triggerHaiAnRoad, triggerOneOOne, useCoupon };

