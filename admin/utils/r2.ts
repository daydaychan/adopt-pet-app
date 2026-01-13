
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = import.meta.env.VITE_R2_ACCOUNT_ID;
const accessKeyId = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const bucketName = import.meta.env.VITE_R2_BUCKET_NAME;
const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    console.warn("R2 environment variables are missing. Image upload will fail.");
}

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
    },
});

export async function uploadImage(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    // For a real app, you might want to put this in a folder
    const key = `pets/${fileName}`;

    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: file,
            ContentType: file.type,
        }));

        return `${publicUrl}/${key}`;
    } catch (error) {
        console.error("Error uploading to R2:", error);
        throw new Error("Failed to upload image");
    }
}
