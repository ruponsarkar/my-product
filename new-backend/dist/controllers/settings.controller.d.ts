import { Request, Response } from 'express';
export declare const getTenantSettings: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTenantSettings: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=settings.controller.d.ts.map