# MorbidiSense Navigation System Update

This document outlines the new navigation system implemented for the MorbidiSense front-end application.

## Overview

The new navigation system provides:

- Smooth, SPA-like page transitions
- Consistent header and sidebar across all pages
- Improved user experience with loading states
- Better code organization with reusable components

## Files Added/Modified

### New Files
- `scripts/navigation.js` - Core navigation logic
- `scripts/loadTemplates.js` - Handles loading of header/sidebar templates
- `templates/header.html` - Reusable header component
- `templates/sidebar.html` - Reusable sidebar component
- `scripts/update-navigation.js` - Utility to update HTML files

### Modified Files
- `style/core.css` - Added navigation styles and transitions
- `pages/login.html` - Updated to use new navigation system
- `pages/predict-risk.html` - Updated to use new navigation system

## How to Update Existing Pages

### Option 1: Automatic Update (Recommended)

1. Make sure you have Node.js installed
2. Run the update script:
   ```bash
   cd front-end
   node scripts/update-navigation.js
   ```
3. The script will automatically update all HTML files in the `pages` directory

### Option 2: Manual Update

For each HTML file, make these changes:

1. In the `<head>` section, add:
   ```html
   <link rel="stylesheet" href="../style/core.css">
   <script src="../scripts/navigation.js" defer></script>
   <script src="../scripts/loadTemplates.js" defer></script>
   ```

2. Replace the opening `<body>` tag with:
   ```html
   <body>
       <!-- Header will be loaded here -->
       <div id="header-placeholder"></div>
   
       <!-- Sidebar will be loaded here -->
       <div id="sidebar-placeholder"></div>
       
       <!-- Page transition overlay -->
       <div id="page-transition" class="page-transition">
           <div class="loader"></div>
       </div>
   
       <div class="main-content">
   ```

3. Before the closing `</body>` tag, add:
   ```html
       </div>
   </body>
   ```

## Navigation Links

Use `data-route` attributes for internal navigation:

```html
<a href="home.html" data-route="home">Home</a>
```

## Customizing the Navigation

### Header
Edit `templates/header.html` to modify the header content.

### Sidebar
Edit `templates/sidebar.html` to modify the navigation menu.

### Styling
Navigation styles are in `style/core.css`. Look for the "Navigation" section.

## Troubleshooting

- If a page doesn't update, clear your browser cache
- Check browser console for JavaScript errors
- Ensure all file paths are correct

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)
