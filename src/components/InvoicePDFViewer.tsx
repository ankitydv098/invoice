import { useState } from 'react';
// @ts-ignore
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

interface InvoicePDFViewerProps {
  pdfData: string; // Base64 encoded PDF data or PDF URL
}

export default function InvoicePDFViewer({ pdfData }: InvoicePDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  const goToNextPage = () => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));

  return (
    <div >
      <div >
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          
        >
          Previous
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= (numPages || 1)}
          
        >
          Next
        </button>
        <p >Page {pageNumber} of {numPages || '--'}</p>
      </div>
      <div >
        <Document
          file={pdfData}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={console.error}
        >
          <Page pageNumber={pageNumber} renderTextLayer={true} renderAnnotationLayer={true} />
        </Document>
      </div>
    </div>
  );
}