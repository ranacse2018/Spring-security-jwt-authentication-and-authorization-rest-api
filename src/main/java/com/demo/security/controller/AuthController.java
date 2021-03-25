package com.demo.security.controller;


import com.demo.security.jwt.JwtUtils;
import com.demo.security.model.Role;
import com.demo.security.model.RoleName;
import com.demo.security.model.User;
import com.demo.security.repository.RoleRepository;
import com.demo.security.repository.UserRepository;
import com.demo.security.request.AddRoleRequest;
import com.demo.security.request.LoginRequest;
import com.demo.security.request.SignupRequest;
import com.demo.security.request.StatusResponse;
import com.demo.security.response.JwtResponse;
import com.demo.security.response.MessageResponse;
import com.demo.security.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

/*    //role name add Example:- ROLE_ADMIN
    @PostMapping("/addRoles")
    public ResponseEntity<?> addRoles(@RequestBody Role role) {
        roleRepository.save(role);
        return ResponseEntity.ok(new MessageResponse("Role added successfully!"));
    }*/

    @PostMapping("/addrole")
    public StatusResponse addRolesWithId(@RequestBody AddRoleRequest addRoleRequest/*@RequestParam("userId") Long userId, @RequestParam("role") String roleName*/) {
        String status = null;
        Set<Role> roles = new HashSet<>();
        List<String> list = new ArrayList<>();
        User user = userRepository.findById(addRoleRequest.getUserId()).get();
        for (Role i : user.getRoles()) {
            list.add(i.getName().toString());
        }
        roles = user.getRoles();
        if (list.contains(addRoleRequest.getRole())) {

            status = "This role is already taken";
        } else {
            if (addRoleRequest.getRole().equals("ROLE_USER")) {
                Role UserRole = roleRepository.findByName(RoleName.ROLE_USER).get();
                roles.add(UserRole);
            } else if (addRoleRequest.getRole().equals("ROLE_ADMIN")) {
                Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).get();
                roles.add(adminRole);
            } else {
                Role modRole = roleRepository.findByName(RoleName.ROLE_MODERATOR).get();
                roles.add(modRole);
            }
            user.setRoles(roles);
            userRepository.save(user);
            status = "Role rigistered successfully";
        }

        StatusResponse msg = new StatusResponse(status);
        return msg;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(RoleName.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
