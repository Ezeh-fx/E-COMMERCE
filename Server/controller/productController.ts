import { Request, Response, NextFunction } from "express";
import { AppError, HttpCode } from "../error/errorDefine";
import { Product } from "../model/productModel";
import cloudinary from "../Utils/Cloudinary";
import streamifier from "streamifier";
import { asyncHandler } from "../error/Async/asyncHandler";
import { Iproducts } from "../Interface/productInterface";
import mongoose from "mongoose";

const uploadImageWithRetries = async (image: any, retries = 3) => {
  let attempts = 0;
  while (attempts < retries) {
    try {
      const uploadResponse: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { timeout: 10000 },
          (error: any, result: any) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(image.buffer).pipe(stream);
      });
      return uploadResponse.secure_url;
    } catch (error) {
      attempts++;
      console.warn(`Upload attempt ${attempts} failed:`, error);
      if (attempts >= retries)
        throw new Error("Cloudinary upload failed after multiple attempts.");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }
  return null;
};

export const CreateProduct = asyncHandler(
  async (
    req: Request<{}, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);

      const { name, price, category, stock } = req.body;
      const image = req.file;

      if (!name || !price || !category || !stock) {
        return next(
          new AppError({
            message: "All fields are required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      if (!image) {
        return next(
          new AppError({
            message: "Image file is missing",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      let uploadedImageUrl: string | null = null;
      try {
        uploadedImageUrl = await uploadImageWithRetries(image);
        if (!uploadedImageUrl) {
          return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
            message: "Cloudinary upload failed after multiple attempts",
          });
        }
      } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || "Cloudinary upload failed after multiple attempts",
        });
      }

      const createProduct = await Product.create({
        name,
        price,
        productImage: uploadedImageUrl,
        category,
        stock,
      });

      if (!createProduct) {
        return next(
          new AppError({
            message: "Unable to create product",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }

      return res.status(HttpCode.CREATE).json({
        message: "Product created successfully",
        data: createProduct,
      });
    } catch (error) {
      console.error("Create Product Error:", error);
      return next(
        new AppError({
          message: "An error occurred while creating the product",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);


export const getProductByCategory = asyncHandler(
  async (
    req: Request<any, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { category } = req.params;

      const products = await Product.find({ category: category });
      console.log("Products found:", products); // Debugging

      if (products.length === 0) {
        // Check if array is empty
        return res.status(HttpCode.NOT_FOUND).json({
          message: "No products found for this category",
          data: [],
        });
      }

      if (!products) {
        return next(
          new AppError({
            message: "Unable to get Product by category",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "Product Categories successfully found",
        data: products,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while getting product by category",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getOneProduct = asyncHandler(
  async (
    req: Request<any, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return next(
          new AppError({
            message: "ID is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const product = await Product.findById(productId);

      if (!product) {
        return next(
          new AppError({
            message: "Unable to get specific Product",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "Product has been successfully Found",
        data: product,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while getting one product",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const GetAllProduct = asyncHandler(
  async (
    req: Request<{}, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const product = await Product.find().sort({ dateCreated: -1 });

    return res.status(HttpCode.OK).json({
      length: product.length,
      message: product.length ? "All product" : "No product available",
      data: product.length ? product : null,
    });
  }
);

export const FindProductBySearch = asyncHandler(
  async (
    req: Request<{}, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { query } = req.query;

      // Find the product by name
      const products = await Product.find({
        name: { $regex: query, $options: "i" },
      });

      // ✅ Return "No products found" if array is empty
      if (products.length === 0) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "No products found",
        });
      }

      return res.status(HttpCode.OK).json({
        message: "Search Found",
        data: products,
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while Searching for product",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const updateProduct = asyncHandler(
  async (
    req: Request<any, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { productId } = req.params;
      const { productImage, ...updateData } = req.body;

      if (!productId) {
        return next(
          new AppError({
            message: "ID is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      } else {
        if (productImage) {
          return next(
            new AppError({
              message: "can change an image through this route",
              httpCode: HttpCode.FORBIDDEN,
            })
          );
        }
      }

      const update = await Product.findByIdAndUpdate(
        { _id: productId },
        {
          $set: updateData,
        },
        { new: true }
      );

      if (!update) {
        return next(
          new AppError({
            message: "Unable to Update",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "User Update Successfully",
        data: {
          item: updateData,
        },
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while updating product",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const DeleteProduct = asyncHandler(
  async (
    req: Request<any, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return next(
          new AppError({
            message: "ID is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(
          new AppError({
            message: "Unable to delete the specific Product",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while deleteing product",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

// export const updateProductImageInArray = asyncHandler(
//   async (
//     req: Request<any, {}, Iproducts>,
//     res: Response,
//     next: NextFunction
//   ): Promise<any> => {
//     try {
//       const { productId, index } = req.params;
//       const image = req.file;

//       if (req.body) {
//         return next(
//           new AppError({
//             message: "All field required",
//             httpCode: HttpCode.FIELD_REQUIRED,
//           })
//         );
//       }

//       if (!image) {
//         return next(
//           new AppError({
//             message: "Image not found",
//             httpCode: HttpCode.NOT_FOUND,
//           })
//         );
//       }

//       let uploadedImageUrl: string | null = null;
//       try {
//         uploadedImageUrl = await uploadImageWithRetries(image);
//         if (!uploadedImageUrl) {
//           return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
//             message: "Cloudinary upload failed after multiple attempts",
//           });
//         }
//       } catch (error: any) {
//         return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
//           message:
//             error.message || "Cloudinary upload failed after multiple attempts",
//         });
//       }

//       const product = await Product.findById(productId);
//       if (!product) return res.status(404).json({ error: "Product not found" });

//       if (index < 0 || index >= product.productImage.length) {
//           return res.status(400).json({ error: "Invalid image index" });
//       }

//       product.productImage[index] = uploadedImageUrl;
//       await product.save();

//       res.json({ message: "Image updated successfully", product });

//     } catch (error) {
//       console.log(error);
//       return next(
//         new AppError({
//           message: "An error occurred while updating product image",
//           httpCode: HttpCode.INTERNAL_SERVER_ERROR,
//         })
//       );
//     }
//   }
// )

export const updateProductImage = asyncHandler(
  async (
    req: Request<any, {}, Iproducts>,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { productId } = req.params;
      const image = req.file;

      if (!productId) {
        return next(
          new AppError({
            message: "ID is required",
            httpCode: HttpCode.FIELD_REQUIRED,
          })
        );
      }

      if (!image) {
        return next(
          new AppError({
            message: "Image not found",
            httpCode: HttpCode.NOT_FOUND,
          })
        );
      }

      let uploadedImageUrl: string | null = null;
      try {
        uploadedImageUrl = await uploadImageWithRetries(image);
        if (!uploadedImageUrl) {
          return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
            message: "Cloudinary upload failed after multiple attempts",
          });
        }
      } catch (error: any) {
        return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
          message:
            error.message || "Cloudinary upload failed after multiple attempts",
        });
      }

      const update = await Product.findByIdAndUpdate(
        { _id: productId },
        {
          $set: { productImage: uploadedImageUrl },
        },
        { new: true }
      );

      if (!update) {
        return next(
          new AppError({
            message: "Unable to Update",
            httpCode: HttpCode.CONFLICT,
          })
        );
      }

      return res.status(HttpCode.OK).json({
        message: "User Update Successfully",
        data: {
          item: update,
        },
      });
    } catch (error) {
      console.log(error);
      return next(
        new AppError({
          message: "An error occurred while updating product image",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);


export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { rating, comment,name } = req.body;
    const userId = (req as any).body.userData?._id;

    // ✅ Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return next(
        new AppError({
          message: "Rating must be between 1 and 5",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    }

    // ✅ Validate comment
    if (!comment || comment.trim() === "") {
      return next(
        new AppError({
          message: "Review comment is required",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    }

    // ✅ Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(
        new AppError({
          message: "Invalid product ID format",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    }

    // ✅ Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new AppError({
          message: "Product not found",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    // ✅ Check authentication
    if (!userId) {
      return next(
        new AppError({
          message: "You must be logged in to review products",
          httpCode: HttpCode.UNAUTHORIZED,
        })
      );
    }

    // 🚫 Prevent duplicate review
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (alreadyReviewed) {
      return next(
        new AppError({
          message: "You have already reviewed this product",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    }

    // ✅ Construct review
    const newReview = {
      user: userId, // 👈 This works as long as your schema defines it as ObjectId
      name, // 👈 Fallback to "Anonymous" if name is not available
      rating: Number(rating),
      comment,
    };

    product.reviews.push(newReview);
    product.numberOfReviews = product.reviews.length;

    await product.save(); // 👈 Save is necessary!

    return res.status(HttpCode.CREATE).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (error) {
    console.error("Error creating review:", error);

    if (!(error instanceof AppError)) {
      return next(
        new AppError({
          message: "Failed to add review. Please try again.",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }

    return next(error);
  }
};


export const getProductReviews = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {productId} = req.params;
    
    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(
        new AppError({
          message: "Invalid product ID format",
          httpCode: HttpCode.BAD_REQUEST,
        })
      );
    }

    const product = await Product.findById(productId);
    
    if (!product) {
      return next(
        new AppError({
          message: "Product not found",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    return res.status(HttpCode.OK).json({
      success: true,
      reviews: product.reviews,
      count: product.reviews.length
    });
    
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    
    if (!(error instanceof AppError)) {
      return next(
        new AppError({
          message: "Failed to fetch reviews. Please try again.",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
    
    return next(error);
  }
};
