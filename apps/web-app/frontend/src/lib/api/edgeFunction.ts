import { baseUrl } from './utils';

export function triggerHaiAnRoad(body: Record<string, unknown>) {
  return fetch(`${baseUrl}/api/edge-function/hai-an-road`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export function triggerOneOOne(body: Record<string, unknown>) {
  return fetch(`${baseUrl}/api/edge-function/one-o-one`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export function useCoupon(body: Record<string, unknown>) {
  return fetch(`${baseUrl}/api/edge-function/use-coupon`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}


