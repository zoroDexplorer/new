import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react';
import './Upload.css';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        setUploading(true);
        try {
            // Step 1: Get pre-signed URL from backend
            const response = await fetch('http://localhost:5000/api/generate-presigned-url', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                }),
            });

            const { url } = await response.json();

            // Step 2: Upload file to S3 using the pre-signed URL
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });

            if (uploadResponse.ok) {
                const fileUrl = url.split('?')[0]; // Remove query parameters
                console.log("File uploaded successfully:", fileUrl);
                alert("File uploaded successfully!");
            } else {
                throw new Error("Failed to upload file.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <h1>Upload your memories</h1>
            <form className="upload-form" onSubmit={handleSubmit}>
                <label htmlFor="fileUpload">Upload Picture:</label>
                <input type="file" id="fileUpload" onChange={handleFileChange} />
                {previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />}
                <button type="submit">Upload</button>
            </form>
            {uploading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.3)', zIndex: 9999 }}>
                    <CircularProgress />
                </Box>
            )}
        </div>
    );
};

export default Upload;