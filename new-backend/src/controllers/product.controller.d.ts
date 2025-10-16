import { Request, Response, RequestHandler } from "express";
/**
 * Extend Express Request to include files added by multer
 */
export interface MulterRequest extends Request {
    files?: Express.Multer.File[] | {
        [fieldname: string]: Express.Multer.File[];
    };
}
/**
 * Convert stored filename -> public URL/path used in DB.
 * Adjust this to match how you serve the uploads folder (static route).
 * Example: if you serve uploads with `app.use('/uploads', express.static('uploads'))`
 * then publicPath('abc.jpg') -> `/uploads/abc.jpg`
 */
export declare const publicPath: (filename: string) => string;
export declare const getProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProductById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const saveProduct: (req: Request, res: Response) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Controller: addProductImages
 * Route example:
 *   router.post('/products/:id/images', uploadMany.array('images', 10), addProductImages);
 */
export declare const addProductImages: RequestHandler;
//# sourceMappingURL=product.controller.d.ts.map