



h1. HTML Component Analyzer

{panel:title=Quick Links|borderStyle=solid|borderColor=#ccc}
	•	[Overview|#Overview]
	•	[Technical Documentation|#Technical-Documentation]
	•	[Usage Guidelines|#Usage-Guidelines]
{panel}

{status:title=Project Status|color=green}
Production Ready
{status}

h2. About This Space

This space contains documentation for the HTML Component Analyzer tool.

{info}
🔍 New users: Start with the [Overview|#Overview] section
👨‍💻 Developers: Check the [Technical Documentation|#Technical-Documentation]
{info}

h1. Overview {anchor:Overview}

The HTML Component Analyzer is a desktop application designed to provide an in-depth understanding of how your website is constructed. Think of it as an X-ray machine for your website’s building blocks! It operates entirely offline, ensuring that you don’t need an internet connection to use it.

h2. Why Use the HTML Component Analyzer?

Imagine wanting to analyze a house to understand:
	•	Custom vs. Standard Materials: How many custom-built pieces are used compared to standard building materials?
	•	Special Features: What unique features have been added?
	•	Material Quality: How much of the house uses premium materials versus standard ones?

This tool offers a similar analysis for websites, helping you:
	•	Determine the proportion of custom components versus standard web components.
	•	Identify special features and custom code used in your website.
	•	Understand the overall structure and component usage within your site.

h2. Key Features

h3. 1. User-Friendly Interface
	•	Simple Upload: Just upload a ZIP file containing your website’s files.
	•	Instant Results: Receive immediate analysis without waiting.
	•	No Technical Expertise Required: Designed for users without a technical background.

h3. 2. Safe and Secure
	•	Offline Operation: Runs entirely on your computer without needing an internet connection.
	•	Read-Only Analysis: Doesn’t modify your files—only reads them for analysis.
	•	Automatic Cleanup: Cleans up temporary files after completing the analysis.

h3. 3. Clear and Detailed Results
	•	Visual Reports: Provides charts and graphs showing the composition of your website.
	•	Component Breakdown: Detailed statistics on custom versus standard components.
	•	Easy Interpretation: Presents data in understandable percentages and summaries.

h2. How It Ensures Safety

Similar to a metal detector at an airport, the HTML Component Analyzer:
	•	Accepts Only Specific Files: Only processes ZIP files containing HTML files.
	•	Pre-Processing Checks: Validates and checks files before analysis.
	•	Data Privacy: Your data never leaves your computer since it works offline.
	•	No Residual Data: Does not retain any of your data post-analysis.

h2. What You Receive

h3. 1. Visual Reports
	•	Charts and Graphs: Visual representations of your website’s structure.
	•	Component Composition: Breakdown of custom and standard parts.
	•	Percentage Metrics: Easy-to-read percentages for quick insights.

h3. 2. Detailed Information
	•	Component Lists: Comprehensive lists of all components used.
	•	Usage Frequency: Data on how often each component appears.
	•	Special Features: Identification of unique features and custom code.

h2. Ideal Use Cases
	•	Website Onboarding: When taking over a website and needing to understand its construction.
	•	Compliance Checking: Verifying if a website adheres to company or industry standards.
	•	Code Analysis: Determining the balance between custom code and standard code.
	•	Documentation: Creating detailed reports on the components used within a website.

h2. Benefits
	•	Time-Saving: Eliminates the need for manual code inspection.
	•	Quality Assurance: Quickly assess if your website follows best practices and standards.
	•	Comprehensive Documentation: Provides clear and detailed reports.
	•	Enhanced Security: All analysis is conducted locally on your machine.
	•	Ease of Use: No technical knowledge required to interpret the results.

h2. Requirements
	•	Operating System: Compatible with Windows, macOS, and Linux.
	•	Input Files: Your website files packaged in a ZIP format.
	•	No Internet Needed: Operates entirely offline.

h2. Frequently Asked Questions

h3. Is it safe to use with my files?

Absolutely! The tool:
	•	Read-Only Access: Never modifies your original files.
	•	Local Processing: Works like a PDF reader—it only views your files.
	•	Data Privacy: Does not send any data over the internet.
	•	Automatic Cleanup: Deletes temporary files after analysis.

h3. Do I need technical knowledge?

No technical expertise is required. While the tool analyzes technical aspects, it presents the results in a user-friendly format that’s easy to understand.

h3. What kind of files can I analyze?
	•	Supported Files: ZIP files containing properly formatted HTML files.
	•	Simple Requirements: As long as your website files are in a ZIP archive, you’re good to go!

h3. Will it change my files?

Not at all. The tool only reads your files, much like looking at a document through a magnifying glass. Your original files remain untouched.

h2. Tips for Best Results
	•	Correct File Format: Ensure your files are zipped in a ZIP format.
	•	Include All Relevant Files: Add all the HTML files you wish to analyze.
	•	Patience During Analysis: Wait for the analysis to complete before closing the application.
	•	Save Your Reports: If you need to reference the results later, be sure to save them.

h2. Need Help?

The tool provides clear error messages to guide you:
	•	File Type Errors: Alerts if the uploaded file isn’t a ZIP archive.
	•	Processing Issues: Notifies if there are problems that need attention.
	•	Next Steps: Offers guidance on how to resolve any issues encountered.

{info:title=Remember}
This tool is like having an X-ray machine for your website—it allows you to see what’s inside without making any changes!
{info}

h1. Technical Documentation {anchor:Technical-Documentation}

h2. 1. Technology Stack & Dependencies

h3. 1.1 Core Technologies
	•	Spring Framework
	•	Spring Boot: Simplifies the bootstrapping and development of new Spring applications.
	•	Spring MVC: Utilizes @Controller and @Service annotations for handling web requests.
	•	Spring Dependency Injection: Employs @Autowired for managing dependencies.

h3. 1.2 External Dependencies
	•	Apache Commons Compress
	•	Purpose: Secure handling and processing of ZIP archives.
	•	Classes Used: ZipArchiveEntry, ZipFile.
	•	JSoup
	•	Purpose: Safe parsing and analysis of HTML content.
	•	Classes Used: Document, Element, Elements.

h3. 1.3 File Processing
	•	Multipart File Handling: Manages file uploads using MultipartFile.
	•	Encoding Support: Ensures proper handling of UTF-8 encoded files.
	•	Temporary File Management: Creates and deletes temporary files during processing.

h2. 2. Security Analysis

h3. 2.1 File Upload Security

{noformat}
if (file.isEmpty() || !file.getOriginalFilename().endsWith(”.zip”)) {
model.addAttribute(“error”, “Please upload a valid zip file containing HTML files.”);
return “uploadForm”;
}
{noformat}
	•	Validation: Checks if the uploaded file is not empty and has a .zip extension.
	•	Prevention: Blocks the upload of potentially malicious file types.
	•	User Feedback: Provides clear error messages for incorrect file types.

h3. 2.2 Resource Management

{noformat}
File tempFile = File.createTempFile(“uploaded”, “.zip”);
try (ZipFile zipFile = new ZipFile(tempFile)) {
// Processing logic
} finally {
tempFile.delete();
}
{noformat}
	•	Resource Handling: Utilizes try-with-resources for automatic closure.
	•	Cleanup: Deletes temporary files after processing.
	•	Prevention: Avoids file system resource leaks.

h3. 2.3 Input Processing

{noformat}
Document doc = Jsoup.parse(inputStream, “UTF-8”, “”);
{noformat}
	•	Safety: JSoup provides built-in protection against XSS attacks.
	•	Encoding: Handles character encoding properly.
	•	Parsing: Ensures safe processing of HTML content.

h3. 2.4 Memory Management

{noformat}
private Map<String, Integer> libraryComponents = new HashMap<>();
private Map<String, Integer> nativeComponents = new HashMap<>();
{noformat}
	•	Efficiency: Uses appropriate data structures for counting and categorization.
	•	Memory Management: Relies on Java’s automatic garbage collection.
	•	Performance: Optimizes memory usage without manual intervention.

h2. 3. Advantages

h3. 3.1 Offline Capability
	•	No Internet Required: All processing is done locally.
	•	Data Privacy: Ensures that your files and data remain on your machine.
	•	Self-Contained: Does not depend on external services.

h3. 3.2 Performance
	•	Efficient Processing: Uses streaming for file handling.
	•	Single-Pass Analysis: Scans for tags and classes in one go.
	•	Optimized Structures: Employs data structures that enhance speed and efficiency.

h3. 3.3 Extensibility

{noformat}
@Service
public class HTMLScannerService {
private static final String LIBRARY_PREFIX = “app-”;
// Easy to modify prefix for different component libraries
}
{noformat}
	•	Configurable Prefix: Easily adjust the component library prefix as needed.
	•	Modular Architecture: Service-based design allows for straightforward extension.
	•	Separation of Concerns: Distinct layers for different functionalities.

h3. 3.4 Comprehensive Analysis
	•	Detailed Statistics: Provides extensive data on component usage.
	•	Class Analysis: Examines and reports on class usage patterns.
	•	Insightful Metrics: Calculates percentages and ratios for better understanding.

h3. 3.5 Multiple Output Formats

{noformat}
// REST API endpoint for JSON output
@GetMapping(”/api/scanResults”)
@ResponseBody
public Map<String, Object> getScanResults() {
// Implementation
}

// HTML view for human-readable output
@PostMapping(”/upload”)
public String uploadFile(@RequestParam(“file”) MultipartFile file, Model model) {
// Implementation
}
{noformat}
	•	Flexible Output: Supports both JSON for API integration and HTML for user interfaces.
	•	Integration: Can be incorporated into other tools or systems.
	•	User-Friendly: Provides outputs that are accessible to both technical and non-technical users.

h2. 4. Best Practices Implementation

h3. 4.1 Code Organization
	•	Modular Design: Clear separation between controllers and services.
	•	Package Structure: Organized packages for easier navigation.
	•	Naming Conventions: Consistent and descriptive naming for classes and methods.

h3. 4.2 Error Handling
	•	Input Validation: Checks user inputs and files before processing.
	•	Exception Handling: Catches and manages exceptions gracefully.
	•	User Feedback: Provides meaningful error messages to guide the user.

h3. 4.3 Resource Management
	•	File Handling: Proper opening and closing of file streams.
	•	Memory Efficiency: Processes files and data without excessive memory consumption.
	•	Cleanup: Ensures that temporary resources are deleted after use.

h1. Usage Guidelines {anchor:Usage-Guidelines}

h2. 5. Usage Guidelines

h3. 5.1 Supported File Types
	•	ZIP Archives: Only accepts ZIP files containing HTML files.
	•	HTML Content: Files must be properly formatted and UTF-8 encoded.
	•	File Size: No documented size restrictions (considerations for large files may be added in future versions).

h3. 5.2 Component Recognition
	•	Library Components: Must use the “app-” prefix to be recognized as library components.
	•	Native Components: All other components are treated as native HTML elements.
	•	Case Sensitivity: Analysis is case-sensitive; ensure consistent naming conventions.

h3. 5.3 Results Interpretation
	•	Usage Statistics: Understand how frequently components are used.
	•	Class Patterns: Identify patterns in class usage across your website.
	•	Usage Ratios: Analyze the proportion of library components versus native components.

h2. 6. Future Enhancements

h3. 6.1 Potential Improvements
	•	Multiple Prefix Support: Add the ability to recognize multiple component library prefixes.
	•	Batch Processing: Implement functionality to process multiple ZIP files simultaneously.
	•	Component Relationships: Analyze and report on relationships between components.
	•	CSS Framework Detection: Identify and report on CSS frameworks used.
	•	Additional Archive Formats: Support for other archive types like RAR and 7Z.

h3. 6.2 Monitoring and Logging
	•	Performance Metrics: Introduce metrics to monitor performance and resource usage.
	•	Detailed Logging: Implement comprehensive logging for debugging and auditing.
	•	Analysis History: Maintain a history of analyses for future reference.

h2. Need Assistance?

The tool is designed to be intuitive, but if you encounter issues:
	•	Error Messages: Pay attention to any error messages—they provide guidance on resolving common problems.
	•	Contact Support: Reach out to the development team for assistance with unexpected issues.
	•	Documentation: Refer to this guide for detailed information on features and usage.

Enjoy exploring your website’s inner workings with the HTML Component Analyzer!
