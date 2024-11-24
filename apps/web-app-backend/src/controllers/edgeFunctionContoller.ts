import * as EdgeFunctionModel from '../models/edgeFunctionModel';

export const triggerHaiAnRoad = async (body: Record<string, unknown>) => {
  return await EdgeFunctionModel.invokeHaiAnRoad(body);
};

export const useCoupon = async (body: Record<string, unknown>) => {
  return await EdgeFunctionModel.invokeUseCoupon(body);
};

export const triggerOneOOne = async (body: Record<string, unknown>) => {
  return await EdgeFunctionModel.invokeOneOOne(body);
};
