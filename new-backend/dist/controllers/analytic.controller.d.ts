import { Request, Response } from "express";
type AuthenticatedRequest = Request & {
    user?: any;
};
export declare const totalSalesSummary: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const salesByDate: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const paymentBreakdown: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const topSellingProducts: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const netProfit: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const hourlySales: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const ordersByUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const customReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const dashboardOverview: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=analytic.controller.d.ts.map