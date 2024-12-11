package com.html.analyzer.services;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@Service
public class HTMLScannerService {

    private  String LIBRARY_PREFIX = "";
    private Map<String, Object> latestResults;

    public Map<String, Object> processZipFile(MultipartFile file,String prefix ) throws IOException {
         LIBRARY_PREFIX = prefix;
        File tempFile = File.createTempFile("uploaded", ".zip");
        file.transferTo(tempFile);

        // Initialize result maps
        Map<String, Integer> libraryComponents = new HashMap<>();
        Map<String, Integer> nativeComponents = new HashMap<>();
        Map<String, Integer> libraryClasses = new HashMap<>();
        Map<String, Integer> nativeClasses = new HashMap<>();

        // New maps for line counts and API (attribute) counts
        // For total (across all components):
        Map<String, Integer> totalLibraryCodeLines = new HashMap<>(); // key: tagName, value: total lines of code
        Map<String, Integer> totalLibraryAPIs = new HashMap<>();      // key: attribute name/value combos, value: count

        // For per-component:
        Map<String, Map<String, Integer>> componentLibraryCodeLines = new HashMap<>(); // component -> (tagName -> lines)
        Map<String, Map<String, Integer>> componentLibraryAPIs = new HashMap<>();       // component -> (apiName -> count)

        Map<String, Map<String, Object>> componentBreakdown = new HashMap<>();
        Map<String, Map<String, Map<String, String>>> overriddenStyles = new HashMap<>();

        try (ZipFile zipFile = new ZipFile(tempFile)) {
            Enumeration<ZipArchiveEntry> entries = zipFile.getEntries();
            while (entries.hasMoreElements()) {
                ZipArchiveEntry entry = entries.nextElement();

                if (entry.getName().endsWith(".html")) {
                    String componentName = extractComponentName(entry.getName());

                    // Component-specific counts
                    Map<String, Integer> componentLibraryComponents = new HashMap<>();
                    Map<String, Integer> componentNativeComponents = new HashMap<>();
                    Map<String, Integer> componentLibraryClasses = new HashMap<>();
                    Map<String, Integer> componentNativeClasses = new HashMap<>();

                    // New component-level maps for lines and APIs
                    Map<String, Integer> compLibCodeLines = new HashMap<>();
                    Map<String, Integer> compLibAPIs = new HashMap<>();

                    InputStream inputStream = zipFile.getInputStream(entry);
                    // We need the raw HTML text to count lines in elements
                    String htmlContent = readInputStreamAsString(inputStream);
                    Document doc = Jsoup.parse(htmlContent, "");

                    // Count tags and classes
                    countTags(doc, componentLibraryComponents, componentNativeComponents);
                    countClasses(doc, componentLibraryClasses, componentNativeClasses);

                    // Count library code lines and APIs
                    countLibraryCodeAndAPIs(doc, htmlContent, compLibCodeLines, compLibAPIs);

                    // Update global totals from this component
                    mergeMaps(libraryComponents, componentLibraryComponents);
                    mergeMaps(nativeComponents, componentNativeComponents);
                    mergeMaps(libraryClasses, componentLibraryClasses);
                    mergeMaps(nativeClasses, componentNativeClasses);

                    mergeMaps(totalLibraryCodeLines, compLibCodeLines);
                    mergeMaps(totalLibraryAPIs, compLibAPIs);

                    // Store component-level breakdown
                    Map<String, Object> componentResults = new HashMap<>();
                    componentResults.put("libraryComponents", componentLibraryComponents);
                    componentResults.put("nativeComponents", componentNativeComponents);
                    componentResults.put("libraryClasses", componentLibraryClasses);
                    componentResults.put("nativeClasses", componentNativeClasses);
                    componentResults.put("libraryCodeLines", compLibCodeLines);
                    componentResults.put("libraryAPIs", compLibAPIs);

                    componentBreakdown.put(componentName, componentResults);
                    componentLibraryCodeLines.put(componentName, compLibCodeLines);
                    componentLibraryAPIs.put(componentName, compLibAPIs);

                } else if (entry.getName().endsWith(".scss") || entry.getName().endsWith(".css")) {
                    try (InputStream inputStream = zipFile.getInputStream(entry)) {
                        analyzeOverrides(inputStream, overriddenStyles);
                    }
                }
            }
        } finally {
            if (!tempFile.delete()) {
                System.err.println("Warning: Temporary file could not be deleted.");
            }
        }

        Map<String, Object> results = new HashMap<>();
        results.put("libraryComponents", libraryComponents);
        results.put("nativeComponents", nativeComponents);
        results.put("libraryClasses", libraryClasses);
        results.put("nativeClasses", nativeClasses);
        results.put("componentBreakdown", componentBreakdown);
        results.put("overriddenStyles", overriddenStyles);

        // Add total library code lines and APIs
        results.put("totalLibraryCodeLines", totalLibraryCodeLines);
        results.put("totalLibraryAPIs", totalLibraryAPIs);
        // Add component-level library code lines and APIs
        results.put("componentLibraryCodeLines", componentLibraryCodeLines);
        results.put("componentLibraryAPIs", componentLibraryAPIs);

        latestResults = results;
        return results;
    }

    public Map<String, Object> getLatestResults() {
        return latestResults;
    }

    private void countTags(Document doc, Map<String, Integer> libraryComponents, Map<String, Integer> nativeComponents) {
        for (Element element : doc.getAllElements()) {
            String tagName = element.tagName();
            if (tagName.startsWith(LIBRARY_PREFIX)) {
                libraryComponents.merge(tagName, 1, Integer::sum);
            } else {
                nativeComponents.merge(tagName, 1, Integer::sum);
            }
        }
    }

    private void countClasses(Document doc, Map<String, Integer> libraryClasses, Map<String, Integer> nativeClasses) {
        Elements elementsWithClasses = doc.select("[class]");
        for (Element element : elementsWithClasses) {
            for (String cls : element.classNames()) {
                if (cls.startsWith(LIBRARY_PREFIX)) {
                    libraryClasses.merge(cls, 1, Integer::sum);
                } else {
                    nativeClasses.merge(cls, 1, Integer::sum);
                }
            }
        }
    }

    /**
     * Count library code lines and library APIs (attributes like variation=primary)
     * Library code lines: number of lines inside each library element (including the element's line itself).
     * We can approximate line count by counting newline characters in the element's outerHtml().
     *
     * APIs: Count occurrences of attributes on library elements. For example, if element has attribute "variation=primary",
     * we count that as a library API usage. We tally attributes by "attributeName=attributeValue".
     */
    private void countLibraryCodeAndAPIs(Document doc, String htmlContent,
                                         Map<String, Integer> compLibCodeLines,
                                         Map<String, Integer> compLibAPIs) {

        // Select all library elements
        Elements libraryElements = doc.select(LIBRARY_PREFIX + "*");
        for (Element libElem : libraryElements) {
            String tagName = libElem.tagName();

            // Count lines of code
            String outerHtml = libElem.outerHtml().trim();
            int lineCount = countLines(outerHtml);
            compLibCodeLines.merge(tagName, lineCount, Integer::sum);

            // Count APIs: consider all attributes on this element as a form of API usage
            for (org.jsoup.nodes.Attribute attr : libElem.attributes()) {
                String attrKey = attr.getKey();
                String attrVal = attr.getValue();
                // You could refine what constitutes an API; here we count all attributes on library elements
                String apiSignature = attrKey + "=" + attrVal;
                compLibAPIs.merge(apiSignature, 1, Integer::sum);
            }
        }
    }

    private int countLines(String content) {
        // Count lines by counting '\n' occurrences + 1 if not empty
        if (content == null || content.isEmpty()) return 0;
        int lines = 1;
        for (int i = 0; i < content.length(); i++) {
            if (content.charAt(i) == '\n') {
                lines++;
            }
        }
        return lines;
    }

    private void analyzeOverrides(InputStream inputStream, Map<String, Map<String, Map<String, String>>> overriddenStyles) throws IOException {
        Map<String, Map<String, String>> componentStyles = parseCSS(inputStream);

        for (String selector : componentStyles.keySet()) {
            if (selector.startsWith("." + LIBRARY_PREFIX)) {
                Map<String, String> overridden = new HashMap<>(componentStyles.get(selector));
                Map<String, Map<String, String>> selectorDetails = new HashMap<>();
                selectorDetails.put("custom", overridden);
                overriddenStyles.put(selector, selectorDetails);
            }
        }
    }

    private Map<String, Map<String, String>> parseCSS(InputStream inputStream) throws IOException {
        Map<String, Map<String, String>> styles = new HashMap<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            String currentSelector = null;
            Map<String, String> properties = null;

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.endsWith("{")) {
                    currentSelector = line.substring(0, line.length() - 1).trim();
                    properties = new HashMap<>();
                } else if (line.equals("}")) {
                    if (currentSelector != null && properties != null) {
                        styles.put(currentSelector, properties);
                    }
                    currentSelector = null;
                    properties = null;
                } else if (currentSelector != null && line.contains(":")) {
                    String[] parts = line.split(":", 2);
                    if (parts.length == 2) {
                        properties.put(parts[0].trim(), parts[1].replace(";", "").trim());
                    }
                }
            }
        }
        return styles;
    }

    private String extractComponentName(String fileName) {
        return fileName.substring(fileName.lastIndexOf('/') + 1).replace(".html", "");
    }

    private void mergeMaps(Map<String, Integer> target, Map<String, Integer> source) {
        source.forEach((key, value) -> target.merge(key, value, Integer::sum));
    }

    private String readInputStreamAsString(InputStream inputStream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }
}