import { Request, Response, RequestHandler } from "express";
export declare const addProductImages: RequestHandler;
export declare const getProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProductByIdOrSlug: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProductBarcodeOrSku: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const saveProduct: (req: Request, res: Response) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLastSkuNumber: (req: Request, res: Response) => Promise<void>;
export declare const deleteProductImages: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=product.controller.d.ts.map