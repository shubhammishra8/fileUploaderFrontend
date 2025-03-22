import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
`;

const UploadArea = styled.div`
  background-color: ${(props) => (props.isDragActive ? "#f0f9ff" : "#ffffff")};
  border: 2px dashed ${(props) => (props.isDragActive ? "#3b82f6" : "#d1d5db")};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #3b82f6;
    background-color: #f9fafb;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f3f4f6;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const UploadText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #4b5563;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FilesContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const FilesHeader = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilesTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
`;

const FileCount = styled.span`
  background-color: #e5e7eb;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
`;

const FilesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FileItem = styled.li`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const FileInfo = styled.div`
  flex-grow: 1;
`;

const FileName = styled.p`
  font-weight: 500;
  margin: 0 0 0.25rem 0;
  color: #1f2937;
`;

const FileDetails = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  &:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

const EmptyState = styled.div`
  padding: 3rem 1.5rem;
  text-align: center;
  color: #6b7280;
`;

const StatusBanner = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: ${(props) => (props.show ? "flex" : "none")};
  align-items: center;
  background-color: ${(props) =>
    props.type === "success" ? "#ecfdf5" : "#fef2f2"};
  color: ${(props) => (props.type === "success" ? "#065f46" : "#b91c1c")};
`;

const StatusIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
`;

const StatusIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #3b82f6;
  width: ${(props) => props.value}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const EmptyStateIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background-color: #f3f4f6;
  border-radius: 16px;
`;

const EmptyStateIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    show: false,
    type: "",
    message: "",
  });
  const fileInputRef = useRef(null);
  const API_URL = "http://localhost:5000/files";

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response);
      const formattedFiles = response?.data?.map((file, index) => ({
        id: file._id,
        name: file.name,
        type: getFileTypeFromName(file.name),
        uploadDate: new Date(file.uploadedAt).toISOString().split("T")[0],
        icon: getFileIcon(getFileTypeFromName(file.name)),
        key: file.key,
      }));
      setFiles(formattedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      setStatusMessage({
        show: true,
        type: "error",
        message: "Failed to load files from server",
      });
      setTimeout(() => {
        setStatusMessage({ show: false, type: "", message: "" });
      }, 3000);
    }
  };

  const getFileTypeFromName = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return `image/${extension}`;
      case "doc":
      case "docx":
        return "application/msword";
      case "xls":
      case "xlsx":
        return "application/vnd.ms-excel";
      case "txt":
        return "text/plain";
      default:
        return "application/octet-stream";
    }
  };

  const uploadFiles = async (filesToUpload) => {
    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = filesToUpload.length;
    let uploadedCount = 0;

    for (const file of filesToUpload) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(`${API_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });

        uploadedCount++;
        // Update progress based on files completed
        setUploadProgress((uploadedCount / totalFiles) * 100);
      } catch (error) {
        setStatusMessage({
          show: true,
          type: "error",
          message: `Failed to upload ${file.name}`,
        });
        setTimeout(() => {
          setStatusMessage({ show: false, type: "", message: "" });
        }, 3000);
      }
    }

    // All files processed
    setIsUploading(false);

    if (uploadedCount > 0) {
      setStatusMessage({
        show: true,
        type: "success",
        message: `Successfully uploaded ${uploadedCount} file${
          uploadedCount > 1 ? "s" : ""
        }`,
      });

      // Refresh file list from server
      fetchFiles();
    }

    setTimeout(() => {
      setStatusMessage({ show: false, type: "", message: "" });
    }, 3000);
  };

  const openFile = async (file) => {
    try {
      const response = await axios.get(`${API_URL}/download/${file.key}`, {
        responseType: "blob", // Ensures binary data is received properly
      });

      const fileURL = window.URL.createObjectURL(response.data);
      window.open(fileURL, "_blank");

      setStatusMessage({
        show: true,
        type: "success",
        message: `Opening ${file.name}...`,
      });
    } catch (error) {
      setStatusMessage({
        show: true,
        type: "error",
        message: `Failed to open ${file.name}`,
      });
    }

    setTimeout(() => {
      setStatusMessage({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Function to determine file icon based on type
  const getFileIcon = (mimeType) => {
    if (mimeType.includes("image"))
      return "https://fonts.gstatic.com/s/i/materialicons/image/v1/24px.svg";
    if (mimeType.includes("pdf"))
      return "https://fonts.gstatic.com/s/i/materialicons/picture_as_pdf/v1/24px.svg";
    if (mimeType.includes("word"))
      return "https://fonts.gstatic.com/s/i/materialicons/description/v1/24px.svg";
    if (mimeType.includes("excel"))
      return "https://fonts.gstatic.com/s/i/materialicons/table_chart/v1/24px.svg";
    if (mimeType.includes("text"))
      return "https://fonts.gstatic.com/s/i/materialicons/text_snippet/v1/24px.svg";
    return "https://fonts.gstatic.com/s/i/materialicons/insert_drive_file/v1/24px.svg";
  };

  const getStatusIcon = (type) => {
    return type === "success"
      ? "https://fonts.gstatic.com/s/i/materialicons/check_circle/v1/24px.svg"
      : "https://fonts.gstatic.com/s/i/materialicons/error/v1/24px.svg";
  };

  return (
    <Container>
      <Header>
        <Title>DropBox</Title>
        <Subtitle>Upload and manage files</Subtitle>
      </Header>

      <StatusBanner show={statusMessage.show} type={statusMessage.type}>
        <StatusIconWrapper>
          <StatusIcon
            src={getStatusIcon(statusMessage.type)}
          />
        </StatusIconWrapper>
        {statusMessage.message}
      </StatusBanner>

      <UploadArea
        isDragActive={isDragActive}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);

          const droppedFiles = Array.from(e.dataTransfer.files);
          if (droppedFiles.length > 0) {
            uploadFiles(droppedFiles);
          }
        }}
      >
        <Button onClick={() => fileInputRef.current.click()}>
          Choose Files
        </Button>
        <HiddenInput
          type="file"
          ref={fileInputRef}
          accept=" .gif, .jpg, .png, .doc, .txt,"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files);
            if (selectedFiles.length > 0) {
              uploadFiles(selectedFiles);
            }
          }}
          multiple
        />
        <UploadText>
          {isDragActive
            ? "Drop your files here"
            : "Drag & drop your files here or click the button below"}
        </UploadText>

        <ProgressContainer show={isUploading}>
          <ProgressBar>
            <Progress value={uploadProgress} />
          </ProgressBar>
          <ProgressText>Uploading... {uploadProgress}%</ProgressText>
        </ProgressContainer>
      </UploadArea>

      <FilesContainer>
        <FilesHeader>
          <FilesTitle>Your Files</FilesTitle>
          <FileCount>{files.length} files</FileCount>
        </FilesHeader>

        {files.length > 0 ? (
          <>
            <FilesList>
              {files.map((file) => (
                <FileItem key={file.id}>
                  <IconWrapper>
                    <Icon src={getFileIcon(file.type)} />
                  </IconWrapper>
                  <FileInfo>
                    <FileName>{file.name}</FileName>
                    <FileDetails>
                      Uploaded on {file?.uploadDate || ""}
                    </FileDetails>
                  </FileInfo>
                  <FileActions>
                    <ActionButton
                      onClick={() => openFile(file)}
                      title="View"
                    >
                      View
                    </ActionButton>
                  </FileActions>
                </FileItem>
              ))}
            </FilesList>
          </>
        ) : (
          <EmptyState>
            <EmptyStateIconWrapper>
              <EmptyStateIcon
                src="https://fonts.gstatic.com/s/i/materialicons/folder_open/v1/24px.svg"
    
              />
            </EmptyStateIconWrapper>
            <p>No files uploaded yet</p>
          </EmptyState>
        )}
      </FilesContainer>
    </Container>
  );
};

export default FileUploader;
