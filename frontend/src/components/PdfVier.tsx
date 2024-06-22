import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"; // import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css"; // import styles for the default layout

const PdfViewer = ({ url }) => {
  return (
    <div style={{ height: "100vh" }}>
      <Worker workerUrl="pdf.worker.min.js">
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  );
};

export default PdfViewer;
