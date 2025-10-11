# fs-client

#### Basic Usage
```
node serv/image-serv.js
# or
ts-node serv/image-serv.ts
```

#### Custom Search Path
```
node serv/image-serv.js /path/to/your/images
# or
ts-node serv/image-serv.ts ../assets/images
```

### Available Endpoints

#### Static File Serving
```
/files/myimage.jpg - serves myimage.jpg from your source directory

/files/subfolder/logo.png - serves files from subdirectories
```

#### Dynamic SVG Generation supports all common image formats with proper MIME types
```
/name/folder - UI folder icon
/name/angular - Angular logo
/ext/png - PNG file type icon
/path/ext/jpg - Alternative path-based access
```

1. Command Line Argument Support
- The server now accepts an optional sourcePath argument
- If not provided, defaults to './images' relative to the server location
- The path is resolved to an absolute path for consistency

2. MIME Type Detection
3. SVG Generation Helpers
4. Security Checks


2. Static File Serving
New endpoint: /files/{filepath} - serves actual image files from the source directory
Security: Implements path traversal protection to prevent access outside the source directory
MIME type detection: Automatically detects proper content types for various image formats (JPEG, PNG, GIF, SVG, WebP, BMP, ICO, TIFF)
3. Enhanced File System Operations
Creates the source directory if it doesn't exist
Handles file existence checks before serving
Proper error handling for file operations