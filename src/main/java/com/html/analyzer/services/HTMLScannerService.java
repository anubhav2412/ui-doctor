package com.html.analyzer.services;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Service
public class HTMLScannerService {

    private static final String LIBRARY_PREFIX = "app-";

    // Store the latest results for retrieval via other endpoints
    private Map<String, Object> latestResults;

    public Map<String, Object> processZipFile(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("uploaded", ".zip");
        file.transferTo(tempFile);

        // Initialize the result maps
        Map<String, Integer> libraryComponents = new HashMap<>();
        Map<String, Integer> nativeComponents = new HashMap<>();
        Map<String, Integer> libraryClasses = new HashMap<>();
        Map<String, Integer> nativeClasses = new HashMap<>();
        int totalTags = 0;
        int totalClasses = 0;


        try (ZipFile zipFile = new ZipFile(tempFile)) {
            Enumeration<ZipArchiveEntry> entries = zipFile.getEntries();
            while (entries.hasMoreElements()) {
                ZipArchiveEntry entry = entries.nextElement();
                if (entry.getName().endsWith(".html")) {
                    // Parse the document once and count both tags and classes
                    InputStream inputStream = zipFile.getInputStream(entry);
                    Document doc = Jsoup.parse(inputStream, "UTF-8", "");
                    totalTags += countTags(doc, libraryComponents, nativeComponents);
                    totalClasses += countClasses(doc, libraryClasses, nativeClasses);
                }
            }
        } finally {
            tempFile.delete();
        }

        // Calculate percentages
        double libraryTagPercentage = (totalTags == 0) ? 0 : (100.0 * libraryComponents.values().stream().mapToInt(Integer::intValue).sum() / totalTags);
        double libraryClassPercentage = (totalClasses == 0) ? 0 : (100.0 * libraryClasses.values().stream().mapToInt(Integer::intValue).sum() / totalClasses);

        // Store the results for later retrieval
        Map<String, Object> results = new HashMap<>();
        results.put("libraryComponents", libraryComponents);
        results.put("nativeComponents", nativeComponents);
        results.put("libraryClasses", libraryClasses);
        results.put("nativeClasses", nativeClasses);
        results.put("libraryTagPercentage", libraryTagPercentage);
        results.put("libraryClassPercentage", libraryClassPercentage);

        // Update the latest results
        latestResults = results;
        return results;
    }

    public Map<String, Object> getLatestResults() {
        return latestResults;
    }

    private int countTags(Document doc, Map<String, Integer> libraryComponents, Map<String, Integer> nativeComponents) {
        int tagCount = 0;
        for (Element element : doc.getAllElements()) {
            String tagName = element.tagName();
            if (tagName.startsWith(LIBRARY_PREFIX)) {
                libraryComponents.merge(tagName, 1, Integer::sum);
            } else {
                nativeComponents.merge(tagName, 1, Integer::sum);
            }
            tagCount++;
        }
        return tagCount;
    }

    private int countClasses(Document doc, Map<String, Integer> libraryClasses, Map<String, Integer> nativeClasses) {
        int classCount = 0;
        Elements elementsWithClasses = doc.select("[class]");
        for (Element element : elementsWithClasses) {
            for (String cls : element.classNames()) {
                if (cls.startsWith(LIBRARY_PREFIX)) {
                    libraryClasses.merge(cls, 1, Integer::sum);
                } else {
                    nativeClasses.merge(cls, 1, Integer::sum);
                }
                classCount++;
            }
        }
        return classCount;
    }
}