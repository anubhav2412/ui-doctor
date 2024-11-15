HTML Component Analyzer - Technical Documentation
1. Technology Stack & Dependencies
1.1 Core Technologies

Spring Framework

Spring Boot
Spring MVC (@Controller, @Service annotations)
Spring Dependency Injection (@Autowired)



1.2 External Dependencies

Apache Commons Compress

Used for ZIP file handling
Classes: ZipArchiveEntry, ZipFile
Purpose: Secure extraction and processing of ZIP archives


JSoup

HTML parsing library
Classes: Document, Element, Elements
Purpose: Safe HTML parsing and analysis



1.3 File Processing

Multipart file handling (MultipartFile)
UTF-8 encoding support
Temporary file management

2. Security Analysis
2.1 File Upload Security
javaCopy// Security Feature 1: File Extension Validation
if (file.isEmpty() || !file.getOriginalFilename().endsWith(".zip")) {
    model.addAttribute("error", "Please upload a valid zip file containing HTML files.");
    return "uploadForm";
}

Validates file extensions
Prevents upload of malicious file types
Clear error messaging

2.2 Resource Management
javaCopy// Security Feature 2: Proper Resource Handling
File tempFile = File.createTempFile("uploaded", ".zip");
try (ZipFile zipFile = new ZipFile(tempFile)) {
    // Processing logic
} finally {
    tempFile.delete();
}

Uses try-with-resources for automatic resource closure
Temporary file cleanup
Prevents file system resource leaks

2.3 Input Processing
javaCopy// Security Feature 3: Safe HTML Parsing
Document doc = Jsoup.parse(inputStream, "UTF-8", "");

JSoup provides built-in XSS protection
Proper character encoding handling
Safe HTML parsing

2.4 Memory Management
javaCopy// Security Feature 4: Efficient Data Structures
private Map<String, Integer> libraryComponents = new HashMap<>();
private Map<String, Integer> nativeComponents = new HashMap<>();

Efficient data structure usage
No direct memory management required
Automatic garbage collection support

3. Advantages
3.1 Offline Capability

No internet connection required
Self-contained analysis
Local processing of all files

3.2 Performance

Efficient file processing through streaming
Single-pass analysis for both tags and classes
Optimized data structures for counting and categorization

3.3 Extensibility
javaCopy@Service
public class HTMLScannerService {
    private static final String LIBRARY_PREFIX = "app-";
    // Easy to modify prefix for different component libraries

Configurable component prefix
Service-based architecture for easy extension
Clear separation of concerns

3.4 Comprehensive Analysis

Detailed component usage statistics
Class usage analysis
Percentage calculations for better insights

3.5 Multiple Output Formats
javaCopy// REST API endpoint for JSON output
@GetMapping("/api/scanResults")
@ResponseBody
public Map<String, Object> getScanResults()

// HTML view for human-readable output
@PostMapping("/upload")
public String uploadFile(@RequestParam("file") MultipartFile file, Model model)

Supports both HTML and JSON output
Flexible integration options
User-friendly interface

4. Best Practices Implementation
4.1 Code Organization

Clear separation of concerns (Controller/Service)
Proper package structure
Consistent naming conventions

4.2 Error Handling

Input validation
Proper exception handling
User-friendly error messages

4.3 Resource Management

Proper file handling
Memory-efficient processing
Automatic resource cleanup

5. Usage Guidelines
5.1 Supported File Types

ZIP archives containing HTML files
UTF-8 encoded HTML content
No size restrictions documented (consider adding if needed)

5.2 Component Recognition

Library components must use "app-" prefix
All other components treated as native
Case-sensitive analysis

5.3 Results Interpretation

Component usage statistics
Class usage patterns
Library vs. native usage ratios

6. Future Enhancements
6.1 Potential Improvements

Add support for multiple component library prefixes
Implement batch processing for multiple ZIP files
Add detailed component relationship analysis
Include CSS framework detection
Add support for different archive formats (RAR, 7Z)

6.2 Monitoring and Logging

Add performance metrics
Implement detailed logging
Add analysis history
