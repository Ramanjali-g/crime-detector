package com.crimedetector.service;

import com.crimedetector.exception.ApiException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Local-disk image storage. To use cloud storage later (S3, Cloudinary...), keep this
 * class's public methods and swap the implementation; the rest of the app only stores
 * the returned URL/path string.
 */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");

    private final Path root;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) throws IOException {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public Path getRoot() {
        return root;
    }

    /** Stores the image and returns its public path (e.g. /uploads/abc.png), or null if no file was sent. */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        int dot = original.lastIndexOf('.');
        String extension = dot >= 0 ? original.substring(dot + 1).toLowerCase(Locale.ROOT) : "";
        String contentType = file.getContentType() == null ? "" : file.getContentType();
        if (!ALLOWED_EXTENSIONS.contains(extension) || !contentType.startsWith("image/")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only JPG, PNG, GIF or WEBP images are allowed.");
        }
        String filename = UUID.randomUUID() + "." + extension; // never trust the client's filename
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, root.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "The image could not be saved. Please try again.");
        }
        return "/uploads/" + filename;
    }

    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        try {
            Files.deleteIfExists(root.resolve(Paths.get(imageUrl).getFileName().toString()));
        } catch (IOException ignored) {
            // A leftover file is harmless; do not fail the request.
        }
    }
}
