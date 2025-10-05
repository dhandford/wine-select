import Papa from "papaparse";

// Fetch and parse CSV from a raw GitHub URL
export async function fetchCSV(url) {
  const response = await fetch(url);
  const text = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      complete: (result) => resolve(result.data),
      error: (err) => reject(err),
    });
  });
}
