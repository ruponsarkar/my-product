import { Request, Response } from "express";
export declare const getProfile: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const listUsers: (req: Request & {
    user?: any;
}, res: Response) => Promise<void>;
export declare const createUser: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUser: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=user.controller.d.ts.map