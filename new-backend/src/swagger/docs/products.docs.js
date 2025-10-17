/**
 * @openapi
 * /products/{id}/images:
 *   post:
 *     summary: Upload images for a product
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: |
 *                   Upload multiple image files (field: "images").
 *                   Provide each file in the `images` form field.
 *               attributes:
 *                 type: string
 *                 description: |
 *                  
 *                   Optional JSON string that describes image metadata.
 * 
 *                   Either:
 *                     1) Object keyed by original filename ->
 * 
 *                        `{
 *                          "photo1.jpg": {
 *                            "color": ["red", "blue"],
 *                            "size": ["M", "L"]
 *                          },
 *                          "photo2.jpg": {
 *                            "color": ["red"]
 *                          }
 *                        }`
 *
 *                     2) Array matching upload order ->
 * 
 *                        `[
 *                          { "color": ["red", "blue"], "size": ["M", "L"] },
 *                          { "color": ["blue"] }
 *                        ]`
 *                 example: >
 *                   {
 *                     "photo1.jpg": {
 *                       "color": ["red", "blue"],
 *                       "size": ["M", "L"]
 *                     },
 *                     "photo2.jpg": {
 *                       "color": ["red"]
 *                     }
 *                   }
 *     responses:
 *       200:
 *         description: Images uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 */
