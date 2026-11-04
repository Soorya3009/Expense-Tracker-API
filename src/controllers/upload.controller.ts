import type { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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

    const fileKey = `uploads/${randomUUID()}-${req.file.originalname}`;

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