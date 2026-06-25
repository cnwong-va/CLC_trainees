# CLC Geriatric Training Program Schedule

An interactive trainee schedule for the Geriatric Training Program at Community Learning Center (CLC).

## Features

- **Timeline View**: Gantt-style chart showing trainee rotations across the academic year
- **Monthly Calendar View**: Day-by-day calendar of scheduled trainees
- **Filter by Type**: View all trainees or filter by Fellow, MS4, or PSY1
- **Color-coded**: Each trainee type has a distinct color for easy identification

## How to Update Trainees

To add, edit, or remove trainees, simply edit the `trainees.js` file.

### Format

```javascript
{ type:"MS4", name:"Full Name", start:"YYYY-MM-DD", end:"YYYY-MM-DD", location:"CLC" }
```

**Fields:**
- `type`: `"Fellow"`, `"MS4"`, or `"PSY1"`
- `name`: Full name of the trainee
- `start`: Start date (YYYY-MM-DD format)
- `end`: End date (YYYY-MM-DD format)
- `location`: Training location (typically "CLC")

### Example

```javascript
{ type:"MS4", name:"John Smith", start:"2026-07-08", end:"2026-07-30", location:"CLC" }
```

Save your changes and commit:

```bash
git add trainees.js
git commit -m "Update trainee schedule"
git push
```

## Viewing the Schedule

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Or enable GitHub Pages in repository settings to view online

## Files

- `index.html` - Main HTML structure and styling
- `trainees.js` - Trainee data (edit this file to update schedules)
- `app.js` - Application logic and rendering
- `README.md` - This file