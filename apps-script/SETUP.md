# Google Apps Script Setup Guide
## Internal SIH 2026 — St. Xavier's College, Ranchi

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it: **"SIH 2026 Registrations — SXC Ranchi"**
4. Note the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

---

## Step 2: Create a Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder: **"SIH 2026 — Idea Presentations"**
3. Open the folder and copy the Folder ID from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID`

---

## Step 3: Set Up Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Copy the entire contents of `apps-script.gs` and paste it
4. At the top of the script, find this line:

   ```javascript
   const DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID";
   ```

   Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID` with your actual Drive Folder ID from Step 2.

5. Click **Save** (💾)
6. In the function dropdown, select **`initializeSheets`** and click **Run**
   - This creates the 3 sheets with proper headers and formatting
   - Grant permissions when prompted

---

## Step 4: Deploy as Web App

1. Click **Deploy → New Deployment**
2. Click the ⚙️ gear icon next to "Select type" → Choose **Web App**
3. Set these options:
   - **Description**: `SIH 2026 Registration API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. Authorize the app when prompted
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXX/exec
   ```

---

## Step 5: Configure Your Website

1. Open the `.env.local` file in the website project
2. Replace the placeholder URL:
   ```
   NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```
3. Restart the development server: `npm run dev`

---

## Sheet Structure

### Sheet 1: Registrations
| Column | Data |
|--------|------|
| A | Timestamp |
| B | Team ID (e.g., SIH-2026-001) |
| C | Team Name |
| D | Department |
| E | Academic Year |
| F | Category |
| G | Problem Statement |
| H | Idea Title |
| I | Idea Description |
| J | Status (Pending/Approved/Rejected) |

### Sheet 2: Team Members
| Column | Data |
|--------|------|
| A | Team ID |
| B | Member Type (Leader/Member) |
| C | Full Name |
| D | Gender |
| E | Email |
| F | Mobile |

### Sheet 3: Uploads
| Column | Data |
|--------|------|
| A | Team ID |
| B | Presentation PDF URL (Google Drive) |
| C | Submission Time |

---

## Testing

After setup, visit your registration page and submit a test form.

Check that:
- ✅ A new row appears in the `Registrations` sheet
- ✅ 6 rows appear in the `Team Members` sheet
- ✅ A PDF file is uploaded to your Drive folder
- ✅ A row appears in the `Uploads` sheet with the Drive URL
- ✅ The success page shows a Team ID (e.g., `SIH-2026-001`)

---

## Troubleshooting

**"Apps Script URL not configured"** — You haven't set the URL in `.env.local` yet.

**CORS errors** — The Next.js API routes proxy all requests, so CORS is handled server-side. Ensure you're calling `/api/register` not the Apps Script URL directly.

**"Missing required team information"** — Check the Apps Script logs (Apps Script → Executions) for detailed error messages.

**PDF upload fails** — Ensure the Drive Folder ID is correct and the script has Drive access (re-run `initializeSheets` to trigger permission prompts again).

---

## Admin Dashboard Credentials

Default admin password: `admin@sxc2026`

To change it, update `.env.local`:
```
NEXT_PUBLIC_ADMIN_PASSWORD=your_new_secure_password
```

> ⚠️ **Security Note**: Change the admin password before deploying to production.

---

## Contact

For technical issues, contact the SXC Innovation Cell or raise an issue in the project repository.
