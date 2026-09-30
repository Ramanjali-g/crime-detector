package com.crimedetector.controller;

import com.crimedetector.dto.UpdateUserRequest;
import com.crimedetector.dto.UserResponse;
import com.crimedetector.service.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me(Principal principal) {
        return userService.getMe(principal.getName());
    }

    @PutMapping("/me")
    public UserResponse update(Principal principal, @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateMe(principal.getName(), request);
    }
}
