import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

// Generate presigned URL for frontend to upload directly to S3
export const generatePresignedUrl = async (fileType: string) => {
    const fileExtension = fileType.split("/")[1]; // image/jpeg → jpeg
    const fileName = `doctors/${crypto.randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 60 seconds

    const avatarUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return { presignedUrl, avatarUrl };
};

// Delete image from S3
export const deleteFromS3 = async (avatarUrl: string) => {
    const key = avatarUrl.split(".amazonaws.com/")[1]; // extract key from URL

    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
    });

    await s3Client.send(command);
};