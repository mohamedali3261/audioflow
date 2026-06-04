/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ElementType = 'text' | 'image' | 'rectangle' | 'ellipse' | 'line';

export interface PDFElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
  rotation?: number; // degrees
  opacity?: number; // 0-1
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string; // For shapes
  filter?: string; // grayscale, sepia, etc.
  
  // Text specific
  content?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  
  // Image specific
  src?: string;
  originalWidth?: number;
  originalHeight?: number;
}

export interface PDFFileState {
  file: File | null;
  numPages: number;
  currentPage: number;
  elements: PDFElement[];
  selectedElementId: string | null;
  loading: boolean;
  error: string | null;
  pageWidth?: number;
  pageHeight?: number;
  pageRotations?: { [pageIndex: number]: number };
}
