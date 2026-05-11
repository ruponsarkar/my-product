import { Request, Response } from "express";
export declare const totalSalesSummary: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const salesByDate: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const paymentBreakdown: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const topSellingProducts: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const netProfit: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const hourlySales: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const ordersByUser: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const customReport: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
//# sourceMappingURL=analytic.controller.d.ts.map