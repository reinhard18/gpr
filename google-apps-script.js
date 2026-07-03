/**
 * Google Apps Script for handling form submissions
 * This script stores form data to Google Sheets and uploads files to Google Drive
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Copy this code into the script editor
 * 4. Replace the IDs below with your actual Google Sheets and Drive folder IDs
 * 5. Deploy as a web app (New > Deployment > Web app)
 * 6. Copy the deployment URL and paste it in langganan.html (GOOGLE_APPS_SCRIPT_URL)
 */

// CONFIGURATION - UPDATE THESE WITH YOUR GOOGLE IDs
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Get from URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SHEET_NAME = 'Langganan'; // Name of the sheet tab
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID'; // Get from URL: https://drive.google.com/drive/folders/FOLDER_ID

/**
 * Main function to handle POST requests from the form
 */
function doPost(e) {
  try {
    const params = e.parameters;
    const fileBlob = e.parameter.file ? Utilities.newBlob(e.parameter.file) : null;
    
    // Extract form data
    const nama = params.nama ? params.nama[0] : '';
    const alamat = params.alamat ? params.alamat[0] : '';
    const paket = params.paket ? params.paket[0] : '';
    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    let ktpLink = '';

    // Upload KTP file to Google Drive if provided
    if (fileBlob && fileBlob.getBytes().length > 0) {
      try {
        const file = uploadFileToDrive(fileBlob, nama);
        ktpLink = file.getUrl();
      } catch (uploadError) {
        Logger.log('File upload error: ' + uploadError);
        // Continue even if file upload fails
      }
    }

    // Add data to Google Sheets
    const sheet = getOrCreateSheet();
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;

    // Write data to sheet
    sheet.getRange(newRow, 1).setValue(timestamp);
    sheet.getRange(newRow, 2).setValue(nama);
    sheet.getRange(newRow, 3).setValue(alamat);
    sheet.getRange(newRow, 4).setValue(paket);
    sheet.getRange(newRow, 5).setValue(ktpLink);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data berhasil disimpan'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Terjadi kesalahan: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get or create the Google Sheet
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    // Create headers
    const headers = ['Waktu', 'Nama', 'Alamat', 'Paket', 'KTP Link'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#00f3ff').setFontColor('#000000');
  }

  return sheet;
}

/**
 * Upload file to Google Drive
 */
function uploadFileToDrive(fileBlob, customerName) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const fileName = `KTP_${customerName}_${new Date().getTime()}`;
    const file = folder.createFile(fileBlob.setName(fileName));
    return file;
  } catch (error) {
    Logger.log('Upload error: ' + error);
    throw new Error('Gagal mengunggah file: ' + error.toString());
  }
}

/**
 * Test function (optional) - Run this to test your setup
 */
function testSetup() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('✓ Spreadsheet ditemukan: ' + spreadsheet.getName());

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    Logger.log('✓ Folder Drive ditemukan: ' + folder.getName());

    getOrCreateSheet();
    Logger.log('✓ Sheet dibuat/ditemukan');

    Logger.log('✓ Setup berhasil!');
  } catch (error) {
    Logger.log('✗ Error: ' + error);
  }
}
