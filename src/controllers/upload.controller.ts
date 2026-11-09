import type { Request, Response } from "express";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import s3 from "../config/s3.js";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      return res.status(500).json({
        success: false,
        message: "S3 bucket name is missing",
      });
    }

    const userId = String(res.locals.user.userId);

    const fileKey = `users/${userId}/uploads/${randomUUID()}-${req.file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3.send(command);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      fileKey,
    });
  } catch (error) {
    console.error("S3 upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
};


export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { fileKey } = req.body;

    if (!fileKey || typeof fileKey !== "string") {
      return res.status(400).json({
        success: false,
        message: "File key is required",
      });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
      return res.status(500).json({
        success: false,
        message: "S3 bucket name is missing",
      });
    }

    const userId = String(res.locals.user.userId);

    const allowedPrefix = `users/${userId}/uploads/`;

    if (!fileKey.startsWith(allowedPrefix)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this file",
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    await s3.send(command);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("S3 delete error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete image",
    });
  }
};