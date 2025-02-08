import axios from "axios";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa"; // Icon for better UI
import { MdMusicNote } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import uploadToS3 from "../../aws/uploadtos3";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedSong, setSelectedSong] = useState<File | null>(null);
  const navigate = useNavigate();

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

  const handleSongChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedSong(file);
    } else {
      setSelectedSong(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedSong) {
      alert("Please select both an image and a song to upload.");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadToS3(selectedFile);
      const songUrl = await uploadToS3(selectedSong);

      const data = {
        username: sessionStorage.getItem("username"),
        title,
        description,
        image: imageUrl,
        song: songUrl,
      };

      await axios.post("http://52.66.146.144:5000/api/v1/gallery/createGallery", data);

      alert("Gallery created successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-200">
      <div className="bg-base-100 shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-primary">
          Upload Your Memories
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Image Upload */}
          <label className="flex items-center gap-2 text-lg font-medium">
            <FaCloudUploadAlt className="text-primary" /> Upload Picture:
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-lg shadow-md max-h-48 mx-auto"
            />
          )}

          {/* Title */}
          <label className="font-medium text-lg">Title:</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <label className="font-medium text-lg">Description:</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {/* Song Upload */}
          <label className="flex items-center gap-2 text-lg font-medium">
            <MdMusicNote className="text-primary" /> Upload Song:
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleSongChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full flex justify-center"
          >
            Upload
          </button>
        </form>
      </div>

      {/* Uploading Overlay */}
      {uploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl text-primary mb-4" />
            <p className="text-lg font-medium">Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
