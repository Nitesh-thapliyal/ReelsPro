"use client";

import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import {Loader2} from "lucide-react"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


interface FileUploadProps {
    onSuccess: (res : IKUploadResponse) => void
    onProgress? : (progress: number) => void
    fileType? : "image" | "video"
}



export default function FileUpload({onSuccess , onProgress, fileType = "image"}: FileUploadProps) {
  
  const [uploading, setUploading] = useState(false)
  const [error ,setError] = useState<string | null>(null) 

  const onError = (err: {message: string}) => {
    console.log("Error", err);
    setError(err.message)
    setUploading(false)
  };
  
  const handleSuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setUploading(false)
    setError(null)
    onSuccess(response)
  };
  
  const handleProgress = (evt: ProgressEvent) => {

    if(evt.lengthComputable && onProgress){
        const percentComplete = (evt.loaded / evt.total) * 100;
        onProgress(Math.round(percentComplete))
    }
  };
  
  const handleStartUpload = () => {
    setUploading(true)
    setError(null)
  };

  const validateFile = (file: File) => {
    if(fileType === "video"){
        if(!file.type.startsWith("video/")){
            setError("Please upload a video file")
            return false;
        }
        if(file.size > 100 * 1024 * 1024){
            setError("Video must be less than 100 mb")
            return false
        }
    }
    else{
        const validTypes = ["image/jpeg", "image/png", "image/webp"]
        if(!validTypes.includes(file.type)){
            setError("Please upload a valid file (JPE PNG, WEBP )")
            return false
        }
        if(file.size > 5 * 1024 * 1024){
            setError("Video must be less than 5 mb")
            return false
        }
    }

    return false

  }
  return (
    <div className="space-y-2">
        <IKUpload
          fileName={fileType === "video" ? "video" : "image"}
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          accept = {fileType === "video" ? "video/*" : "image/*"}
          folder = {fileType === "video" ? "/videos" : "/images"}
          className = "file-input file-input-bordered w-full"
        />
        {
            uploading && (
                <div className = "flex items-center gap-2 text-sm text-primary">
                    <Loader2 className = "animate-spin"/>
                    <span>Uploading...</span>
                </div>
            )
        }
        {error && (
            <div className = "text-error text-sm">{error}</div>
        )}
    </div>
  );
}