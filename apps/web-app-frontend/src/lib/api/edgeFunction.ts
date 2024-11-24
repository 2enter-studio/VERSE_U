import { apiUrl } from './apiUrl';

function triggerHaiAnRoad(body: Record<string, unknown>) {
  return fetch(apiUrl('edge-function', 'hai-an-road'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  });
}

function useCoupon(body: Record<string, unknown>) {
  return fetch(apiUrl('edge-function', 'use-coupon'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export { triggerHaiAnRoad, triggerOneOOne, useCoupon };

