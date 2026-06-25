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
