# HTML Component Analyzer Documentation

## Quick Links
- [Overview](#overview)
- [Technical Documentation](#technical-documentation)
- [Usage Guidelines](#usage-guidelines)

---

## Project Status
**Production Ready**

---

## Overview

The HTML Component Analyzer is a desktop application that provides an in-depth understanding of the structure and composition of your website. Operating entirely offline, it allows users to analyze their website files securely, with no internet connection required.

### Key Features
1. **User-Friendly Interface**:
   - Simple ZIP file upload for analysis.
   - Instant results with no technical expertise needed.

2. **Detailed Metrics**:
   - Visual reports including pie charts and tables.
   - Component breakdown by library and native elements.

3. **Safe and Secure**:
   - Offline operation ensures privacy.
   - Temporary files are automatically deleted after processing.

---

## Technical Documentation

### Core Technologies

#### Spring Framework
- **Spring Boot**: Simplifies application development.
- **Spring MVC**: Handles web requests using annotations.
- **Dependency Injection**: Manages dependencies seamlessly.

#### External Libraries
- **Apache Commons Compress**: Processes ZIP files securely.
- **JSoup**: Parses HTML files safely.

### Processing Workflow
1. **File Upload**:
   - Users upload a ZIP archive containing their website files.
2. **HTML Analysis**:
   - Extracts and analyzes components and classes from HTML files.
3. **CSS Analysis**:
   - Identifies and highlights overridden styles.

### Security Features
- File type validation ensures only ZIP files are processed.
- JSoup protects against malicious HTML content.
- Temporary files are deleted to maintain security and efficiency.

---

## Usage Guidelines

### Supported Files
- **ZIP Format**: Contains HTML, CSS, and SCSS files.
- **Proper Encoding**: UTF-8 encoding required for all files.

### Results Interpretation
1. **Metrics**:
   - Percentage of library vs. native components.
   - Unique and total component counts.
2. **Visual Reports**:
   - Pie charts showing component distribution.
   - Detailed tables listing components and their usage.

### Tips for Best Results
- Ensure all website files are included in the ZIP archive.
- Maintain consistent naming conventions for components and classes.

---

## Future Enhancements

### Planned Features
- **Multi-Prefix Support**: Recognize multiple component library prefixes.
- **Batch Processing**: Analyze multiple ZIP files simultaneously.
- **Component Relationships**: Visualize interdependencies between components.
- **Additional Formats**: Support for RAR and 7Z archives.

### Monitoring and Logging
- **Performance Metrics**: Track resource usage during analysis.
- **Analysis History**: Save results for future reference.

---

## Frequently Asked Questions

### Is it safe to use with my files?
Yes, the tool works offline and only reads your files without making any modifications.

### Do I need technical expertise?
No. The tool provides clear, user-friendly reports.

### What kind of files can I analyze?
ZIP archives containing HTML, CSS, and SCSS files.

---

## Support
If you encounter any issues or have questions:
- Refer to this documentation.
- Pay attention to error messages for guidance.
- Contact the development team for further assistance.

---

**Enjoy exploring your website's structure with the HTML Component Analyzer!**

