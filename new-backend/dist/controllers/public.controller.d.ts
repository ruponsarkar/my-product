import { Request, Response } from "express";
export declare const getPublicFeaturedProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPublicProductBySlug: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const lookupPublicClientByMobile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const registerPublicClient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginPublicClient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPublicClientSession: (req: Request & {
    publicClient?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createPublicOrder: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyPublicOrders: (req: Request & {
    publicClient?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePublicOrder: (req: Request & {
    publicClient?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=public.controller.d.ts.map