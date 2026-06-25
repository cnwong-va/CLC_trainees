# CLC Geriatric Training Program Schedule

An interactive trainee schedule for the Geriatric Training Program at Community Learning Center (CLC).

## 🌐 View Online

**[Open the CLC Trainee Schedule](https://cnwong-va.github.io/CLC_trainees/)**

## Features

- **Timeline View**: Gantt-style chart showing trainee rotations across the academic year
- **Monthly Calendar View**: Day-by-day calendar of scheduled trainees
- **Filter by Type**: View all trainees or filter by Fellow, MS4, or PSY1
- **Color-coded**: Each trainee type has a distinct color for easy identification
- **File Upload**: Easy tab-delimited file upload to update trainee information
- **Current Trainees**: View all current trainees at a glance

## How to Update Trainees

### Option 1: Upload a Tab-Delimited File (Recommended)

1. Go to the website: https://cnwong-va.github.io/CLC_trainees/
2. Click the **"📤 Upload Trainees"** tab
3. Prepare a `.txt` or `.csv` file with tab-separated columns:
   ```
   Name	Type	Start Date	End Date	Location
   First Last	MS4	2026-07-08	2026-07-30	CLC
   First Last	Fellow	2026-07-01	2026-08-15	CLC
   ```
4. Drag and drop the file into the upload area or click to browse
5. Review the preview and download the generated `trainees.js` file
6. Replace the `trainees.js` file in the repository
7. Commit and push your changes

### Option 2: Direct Edit

Edit the `trainees.js` file directly in the repository:

```javascript
{ type:"MS4", name:"First Last", start:"YYYY-MM-DD", end:"YYYY-MM-DD", location:"CLC" }
```

**Fields:**
- `type`: `"Fellow"`, `"MS4"`, or `"PSY1"`
- `name`: Full name of the trainee
- `start`: Start date (YYYY-MM-DD format)
- `end`: End date (YYYY-MM-DD format)
- `location`: Training location (typically "CLC")

### Example

```javascript
{ type:"MS4", name:"First Last", start:"2026-07-08", end:"2026-07-30", location:"CLC" }
```

Save your changes and commit:

```bash
git add trainees.js
git commit -m "Update trainee schedule"
git push
```

## Viewing Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/cnwong-va/CLC_trainees.git
   cd CLC_trainees
   ```

2. Open `index.html` in your web browser

## Files

- `index.html` - Main management interface with upload, schedule view, and trainee list
- `schedule.html` - Schedule viewer (timeline and monthly views)
- `trainees.js` - Trainee data (edit this file to update schedules)
- `app.js` - Application logic and rendering
- `README.md` - This file

## Repository Settings

This repository has branch protection enabled on `main` to require pull request reviews before merging changes. This ensures all trainee updates are reviewed before going live.
