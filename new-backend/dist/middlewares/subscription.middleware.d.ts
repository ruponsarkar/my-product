import { NextFunction, Request, Response } from "express";
import { SubscriptionFeature } from "../services/subscription.service";
type SubscriptionRequest = Request & {
    user?: any;
    tenant?: any;
    access?: any;
};
export declare const requireSubscriptionFeature: (feature: SubscriptionFeature) => (req: SubscriptionRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=subscription.middleware.d.ts.map