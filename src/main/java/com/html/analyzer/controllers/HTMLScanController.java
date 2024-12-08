package com.html.analyzer.controllers;

import com.html.analyzer.services.HTMLScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.Map;

@Controller
public class HTMLScanController {

    @Autowired
    private HTMLScannerService htmlScannerService;

    // Endpoint to show the upload form
    @GetMapping("/")
    public String index() {
        return "uploadForm";
    }

    // Endpoint to handle file upload and analysis, returning the scan results as JSON
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file, Model model) throws IOException {
        // Check if the uploaded file is a zip
        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".zip")) {
            model.addAttribute("error", "Please upload a valid zip file containing HTML files.");
            return "uploadForm"; // Return back to the form with an error message
        }

        // Process the zip file and get the scan results
        Map<String, Object> result = htmlScannerService.processZipFile(file);

        // Add general scan results to the model
        model.addAttribute("libraryComponents", result.get("libraryComponents"));
        model.addAttribute("nativeComponents", result.get("nativeComponents"));
        model.addAttribute("libraryClasses", result.get("libraryClasses"));
        model.addAttribute("nativeClasses", result.get("nativeClasses"));
        model.addAttribute("libraryTagPercentage", result.get("libraryTagPercentage"));
        model.addAttribute("libraryClassPercentage", result.get("libraryClassPercentage"));

        // Add component-level breakdown to the model
        if (result.containsKey("componentBreakdown")) {
            model.addAttribute("componentBreakdown", result.get("componentBreakdown"));
        }

        // Add overridden styles analysis to the model
        if (result.containsKey("overriddenStyles")) {
            model.addAttribute("overriddenStyles", result.get("overriddenStyles"));
        }

        return "scanResults";  // Returns the HTML template to display results
    }

    // Endpoint to provide scan results in JSON format for scripts.js
    @GetMapping("/api/scanResults")
    @ResponseBody
    public Map<String, Object> getScanResults() {
        Map<String, Object> latestResults = htmlScannerService.getLatestResults();

        // Include additional details if available
        if (latestResults != null) {
            if (latestResults.containsKey("componentBreakdown")) {
                latestResults.put("componentBreakdown", latestResults.get("componentBreakdown"));
            }
            if (latestResults.containsKey("overriddenStyles")) {
                latestResults.put("overriddenStyles", latestResults.get("overriddenStyles"));
            }
        }

        return latestResults;
    }
}