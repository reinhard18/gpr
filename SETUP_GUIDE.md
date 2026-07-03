# Setup Guide: Google Sheets & Drive Integration

## Langkah-langkah Setup

### 1. Persiapan Google Sheets
**a. Buat Google Spreadsheet baru:**
   - Buka https://sheets.google.com
   - Klik "Buat spreadsheet baru"
   - Beri nama: "Langganan Internet GPR"
   - Dari URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - **Catat SPREADSHEET_ID**

**b. Buat folder di Google Drive:**
   - Buka https://drive.google.com
   - Klik "+ Buat folder baru"
   - Beri nama: "KTP Uploads" (atau nama lain)
   - Dari URL: `https://drive.google.com/drive/folders/FOLDER_ID`
   - **Catat FOLDER_ID**

### 2. Setup Google Apps Script
**a. Buka Google Apps Script:**
   - Pergi ke https://script.google.com
   - Klik "Proyek baru" (New project)

**b. Copy kode dari `google-apps-script.js` ke editor**

**c. Perbarui konfigurasi:**
   - Ganti `YOUR_SPREADSHEET_ID` dengan SPREADSHEET_ID Anda
   - Ganti `YOUR_DRIVE_FOLDER_ID` dengan FOLDER_ID Anda
   ```javascript
   const SPREADSHEET_ID = 'xxxxxxxxxxxx';
   const DRIVE_FOLDER_ID = 'yyyyyyyyyyyy';
   ```

**d. Jalankan test:**
   - Di editor, pilih function `testSetup` di dropdown
   - Klik tombol "Run"
   - Izinkan akses ketika diminta
   - Lihat hasilnya di "Execution log"

### 3. Deploy sebagai Web App
**a. Klik "Deploy" (atau "New > Deployment")**

**b. Pilih type: "Web app"**

**c. Atur settings:**
   - Execute as: (Gunakan akun Anda)
   - Who has access: "Anyone"

**d. Klik "Deploy"**

**e. Salin URL deployment yang muncul**
   - Format: `https://script.google.com/macros/d/xxxxxxxxxxxxx/usercallback`

### 4. Update langganan.html
**a. Buka `langganan.html`**

**b. Cari baris ini di atas:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercallback';
   ```

**c. Ganti dengan URL deployment Anda:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/AKfycbw...xxxxx/usercallback';
   ```

### 5. Testing
**a. Buka langganan.html di browser**

**b. Isi form dengan data test:**
   - Nama: "Test User"
   - Paket: "Family Basic"
   - Upload file KTP (JPG/PNG/PDF)

**c. Klik "Daftar Sekarang"**

**d. Verifikasi:**
   - Pesan sukses muncul di form
   - Data muncul di Google Sheets
   - File muncul di folder Google Drive

## Troubleshooting

### "Error: Authorization required"
- Jalankan `testSetup()` terlebih dahulu
- Izinkan akses ke akun Google Anda

### File tidak upload tapi data tersimpan
- Periksa folder ID sudah benar
- Pastikan akun Apps Script punya akses ke folder

### Data tidak muncul di Sheets
- Pastikan SPREADSHEET_ID benar
- Cek apakah sheet "Langganan" sudah ada

### URL deployment tidak bekerja
- Update langganan.html dengan URL yang benar
- Pastikan deployment type adalah "Web app" dengan akses "Anyone"

## Fitur yang Ditambahkan

✓ Form input nama lengkap
✓ Dropdown pilihan paket (Family Basic, Family Ultra, Paket Family Gold)
✓ Upload file KTP (JPG, PNG, PDF - max 5MB)
✓ Validasi ukuran file
✓ Data otomatis ke Google Sheets
✓ File otomatis ke Google Drive
✓ Pesan feedback real-time
✓ Timestamp otomatis

## Security Notes

⚠️ Untuk production:
1. Tambahkan email validation
2. Implementasikan CSRF protection
3. Gunakan reCAPTCHA v3
4. Set permissions lebih ketat ("Only me" untuk editor)
5. Tambahkan rate limiting di Apps Script

Contoh tambahan reCAPTCHA:
```javascript
<script src="https://www.google.com/recaptcha/api.js"></script>
<div class="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_SITE_KEY"></div>
```

## Support
Jika ada pertanyaan, periksa Google Apps Script logs untuk detail error.
