
HTML Component Scanner - A Simple Guide
What Does This Tool Do?
This is a desktop application that helps you understand how your website is built - kind of like getting an X-ray of your website's building blocks! It works completely offline, so you don't need internet access to use it.
Why Is It Useful?
Imagine you're looking at a house and want to know:

How many custom-built pieces are used vs. standard building materials
What special features have been added
How much of the house uses premium materials vs. standard ones

This tool does exactly that, but for websites!
Key Features
1. Easy to Use

Just upload a ZIP file containing your website files
Get instant results
No technical knowledge needed

2. Safe and Secure

Works on your computer without internet
Doesn't modify your files - just reads them
Automatically cleans up after itself

3. Clear Results
You get to see:

How much of your website uses custom components
How much uses standard web components
Easy-to-understand percentages and breakdowns

How Is It Safe?
Think of it like a metal detector at an airport:

It only accepts specific types of files (ZIP files)
It checks what's inside before processing
It doesn't keep any of your data after analysis
It works offline, so your data never leaves your computer

What You Get
1. Visual Reports

Charts showing the makeup of your website
Clear breakdowns of custom vs. standard parts
Easy-to-read percentages

2. Detailed Information

Lists of all components used
How often each component is used
What special features your website uses

When Should You Use It?
This tool is perfect when:

You're taking over a website and want to understand how it's built
You're checking if a website follows your company's standards
You want to know how much custom code vs. standard code is used
You need to document what components are used in your website

Benefits

Time Saving: Get instant insights instead of manually checking code
Quality Check: Easily see if your website follows standards
Documentation: Get clear reports about your website's structure
Security: All analysis happens on your computer only
Simplicity: No need for technical knowledge to understand results

What You Need

A computer (Windows, Mac, or Linux)
Your website files in a ZIP format
That's it! No internet needed

Common Questions
"Is it safe to use with my files?"
Yes! The tool:

Never modifies your original files
Works like a PDF reader - it just looks at the files
Doesn't send any data anywhere
Cleans up after itself automatically

"Do I need technical knowledge?"
No! While the tool analyzes technical aspects of websites, it presents results in an easy-to-understand format.
"What kind of files can I analyze?"

ZIP files containing website files
Files must be properly formatted HTML
That's all you need!

"Will it change my files?"
No! The tool only reads your files - like looking at a document through a magnifying glass. It doesn't make any changes to your original files.
Tips for Best Results

Make sure your files are in a ZIP format
Include all HTML files you want to analyze
Wait for the analysis to complete before closing
Save the reports if you need them later

Need Help?
The tool includes clear error messages that tell you:

If your file isn't the right type
If something needs to be fixed
What to do next

Remember: This is like having an X-ray machine for your website - it helps you see what's inside without changing anything!

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
