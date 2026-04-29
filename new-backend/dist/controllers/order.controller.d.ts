import { Request, Response } from "express";
export declare const createOrder: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyOrders: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map