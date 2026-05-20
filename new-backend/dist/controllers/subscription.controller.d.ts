import { Request, Response } from "express";
type AuthRequest = Request & {
    user?: any;
    rawBody?: string;
};
export declare const getSubscriptionOverview: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listSubscriptionPlans: (_req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createSubscriptionCheckoutOrder: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifySubscriptionPayment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const handleSubscriptionWebhook: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const listSubscriptionTransactions: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getInvoiceDetails: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=subscription.controller.d.ts.map