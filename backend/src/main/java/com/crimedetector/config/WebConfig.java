package com.crimedetector.config;

import com.crimedetector.service.FileStorageService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Serves uploaded images read-only under /uploads/**. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final FileStorageService fileStorage;

    public WebConfig(FileStorageService fileStorage) {
        this.fileStorage = fileStorage;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = fileStorage.getRoot().toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }
        registry.addResourceHandler("/uploads/**").addResourceLocations(location);
    }
}
