package com.html.analyzer.controllers;

import com.html.analyzer.services.HTMLScannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Controller
public class HTMLScanController {

    @Autowired
    private HTMLScannerService htmlScannerService;

    @GetMapping("/")
    public String index() {
        return "uploadForm";
    }

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,  @RequestParam("libraryPrefix") String libraryPrefix, Model model) throws IOException {
        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".zip")) {
            model.addAttribute("error", "Please upload  a valid zip file containing HTML files.");
            return "uploadForm";
        }

        Map<String, Object> result = htmlScannerService.processZipFile(file,libraryPrefix);

        model.addAttribute("libraryComponents", result.get("libraryComponents"));
        model.addAttribute("nativeComponents", result.get("nativeComponents"));
        model.addAttribute("libraryClasses", result.get("libraryClasses"));
        model.addAttribute("nativeClasses", result.get("nativeClasses"));
        model.addAttribute("componentBreakdown", result.get("componentBreakdown"));
        model.addAttribute("overriddenStyles", result.get("overriddenStyles"));

        // New attributes added for lines of library code and APIs:
        model.addAttribute("totalLibraryCodeLines", result.get("totalLibraryCodeLines"));
        model.addAttribute("totalLibraryAPIs", result.get("totalLibraryAPIs"));
        model.addAttribute("componentLibraryCodeLines", result.get("componentLibraryCodeLines"));
        model.addAttribute("componentLibraryAPIs", result.get("componentLibraryAPIs"));

        return "scanResults";
    }

    @GetMapping("/api/scanResults")
    @ResponseBody
    public Map<String, Object> getScanResults() {
        return htmlScannerService.getLatestResults();
    }
}