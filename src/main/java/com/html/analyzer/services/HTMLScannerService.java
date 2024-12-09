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
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Service
public class HTMLScannerService {

    private static final String LIBRARY_PREFIX = "app-";
    private Map<String, Object> latestResults;

    public Map<String, Object> processZipFile(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("uploaded", ".zip");
        file.transferTo(tempFile);

        // Initialize result maps
        Map<String, Integer> libraryComponents = new HashMap<>();
        Map<String, Integer> nativeComponents = new HashMap<>();
        Map<String, Integer> libraryClasses = new HashMap<>();
        Map<String, Integer> nativeClasses = new HashMap<>();
        Map<String, Map<String, Object>> componentBreakdown = new HashMap<>();
        Map<String, Map<String, Map<String, String>>> overriddenStyles = new HashMap<>();

        try (ZipFile zipFile = new ZipFile(tempFile)) {
            Enumeration<ZipArchiveEntry> entries = zipFile.getEntries();
            while (entries.hasMoreElements()) {
                ZipArchiveEntry entry = entries.nextElement();

                if (entry.getName().endsWith(".html")) {
                    // Process HTML files for component analysis
                    String componentName = extractComponentName(entry.getName());
                    InputStream inputStream = zipFile.getInputStream(entry);
                    Document doc = Jsoup.parse(inputStream, "UTF-8", "");

                    // Component-specific counts
                    Map<String, Integer> componentLibraryComponents = new HashMap<>();
                    Map<String, Integer> componentNativeComponents = new HashMap<>();
                    Map<String, Integer> componentLibraryClasses = new HashMap<>();
                    Map<String, Integer> componentNativeClasses = new HashMap<>();

                    countTags(doc, componentLibraryComponents, componentNativeComponents);
                    countClasses(doc, componentLibraryClasses, componentNativeClasses);

                    // Add component breakdown
                    Map<String, Object> componentResults = new HashMap<>();
                    componentResults.put("libraryComponents", componentLibraryComponents);
                    componentResults.put("nativeComponents", componentNativeComponents);
                    componentResults.put("libraryClasses", componentLibraryClasses);
                    componentResults.put("nativeClasses", componentNativeClasses);
                    componentBreakdown.put(componentName, componentResults);

                    // Update global counts
                    mergeMaps(libraryComponents, componentLibraryComponents);
                    mergeMaps(nativeComponents, componentNativeComponents);
                    mergeMaps(libraryClasses, componentLibraryClasses);
                    mergeMaps(nativeClasses, componentNativeClasses);

                } else if (entry.getName().endsWith(".scss") || entry.getName().endsWith(".css")) {
                    // Analyze overrides for CSS/SCSS files
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

        // Store results
        Map<String, Object> results = new HashMap<>();
        results.put("libraryComponents", libraryComponents);
        results.put("nativeComponents", nativeComponents);
        results.put("libraryClasses", libraryClasses);
        results.put("nativeClasses", nativeClasses);
        results.put("componentBreakdown", componentBreakdown);
        results.put("overriddenStyles", overriddenStyles);

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

    private void analyzeOverrides(InputStream inputStream, Map<String, Map<String, Map<String, String>>> overriddenStyles) throws IOException {
        Map<String, Map<String, String>> componentStyles = parseCSS(inputStream);

        for (String selector : componentStyles.keySet()) {
            if (selector.startsWith("." + LIBRARY_PREFIX)) {
                // Mark all properties as overridden since we are not validating against library styles
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
}