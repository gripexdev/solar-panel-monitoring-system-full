package com.example.solarpanelmonitoringsystem.service;

import com.example.solarpanelmonitoringsystem.dto.ReqRes;
import com.example.solarpanelmonitoringsystem.entity.OurUsers;
import com.example.solarpanelmonitoringsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // User Registration
    public ReqRes register(ReqRes registrationRequest){
        ReqRes resp = new ReqRes();

        try{
            if(usersRepo.existsByEmail(registrationRequest.getEmail())){
                resp.setStatusCode(409);
                resp.setMessage("User with this email already exist.");
            }else{
                OurUsers ourUser = new OurUsers();
                ourUser.setEmail(registrationRequest.getEmail());
                ourUser.setRole(registrationRequest.getRole());
                ourUser.setName(registrationRequest.getName());
                ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
                OurUsers ourUsersResult = usersRepo.save(ourUser);


                if(ourUsersResult.getId()>0) {
                    resp.setOurUsers(ourUsersResult);
                    resp.setMessage("User Saved Successfully");
                    resp.setStatusCode(200);
                }
            }

        }
        catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    // Login implementation
    public ReqRes login(ReqRes loginRequest){
        ReqRes response = new ReqRes();

        try {
            // This line authenticates the user’s email and password
            authenticationManager.
                    authenticate
                            (new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            var user = usersRepo.findByEmail(loginRequest.getEmail());
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully logged in");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }
    // Generate refresh token
    public ReqRes refreshToken(ReqRes refreshTokenRequest){
        ReqRes response = new ReqRes();

        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            OurUsers users = usersRepo.findByEmail(ourEmail);
            if(jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)){
                var jwt = jwtUtils.generateToken(users);

                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hrs");
                response.setMessage("Successfully Refreshed the token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    // Get All Users
    public ReqRes getAllUsers(){
        ReqRes reqRes = new ReqRes();

        try{
            List<OurUsers> result = usersRepo.findAll();

            if(!result.isEmpty()){
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("No Users Found");
            }
            return reqRes;
        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred : " + e.getMessage());
            return reqRes;
        }
    }

    // Get user by ID
    public ReqRes getUserByID(Integer id){
        ReqRes reqRes = new ReqRes();

        try {
            OurUsers userById = usersRepo.findById(Long.valueOf(id)).orElseThrow(() -> new RuntimeException("User Not Found"));
            reqRes.setOurUsers(userById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("User with id '" + id + "' found successfully");

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage(e.getMessage());
        }
        return reqRes;

    }

    // Delete User
    public ReqRes deleteUser(Integer userId){
        ReqRes reqRes = new ReqRes();

        try {
            Optional<OurUsers> userOptional = usersRepo.findById(Long.valueOf(userId));

            if(userOptional.isPresent()){
                usersRepo.deleteById(Long.valueOf(userId));
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error Occurred while deleting user : " + e.getMessage());
        }

        return reqRes;
    }

    // update User
    public ReqRes updateUser(Integer userId, OurUsers updatedUser){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(Long.valueOf(userId));
            if(userOptional.isPresent()){
                OurUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setCity(updatedUser.getCity());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if(updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()){
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error Occurred while updating the user : " + e.getMessage());
        }
        return reqRes;
    }

    // Get my info
    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try{
            Optional<OurUsers> userOptional = Optional.ofNullable(usersRepo.findByEmail(email));
            if(userOptional.isPresent()){
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            }else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User is not found");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting your info : " + e.getMessage());
        }
        return reqRes;
    }
}

