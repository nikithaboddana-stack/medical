export interface SourceFile {
  name: string;
  category: 'Servlet' | 'JSP' | 'HTML' | 'SQL' | 'Config';
  path: string;
  description: string;
  code: string;
}

export const sourceFiles: SourceFile[] = [
  {
    name: 'LoginServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/LoginServlet.java',
    description: 'Validates roll number credentials (username & password == roll number) and initializes session/cookies.',
    code: `package com.med.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String rollNumber = request.getParameter("rollNumber");
        String password = request.getParameter("password");

        // Requirement: Validate credentials: username and password is your roll number
        if (rollNumber != null && !rollNumber.trim().isEmpty() && rollNumber.equals(password)) {
            // Store user information in session for the entire session
            HttpSession session = request.getSession(true);
            session.setAttribute("userRollNumber", rollNumber.trim().toUpperCase());
            session.setAttribute("loginTime", new java.util.Date().toString());
            session.setMaxInactiveInterval(30 * 60); // 30 minutes

            // Also store in cookie as per requirement
            Cookie userCookie = new Cookie("userRollNumber", rollNumber.trim().toUpperCase());
            userCookie.setMaxAge(24 * 60 * 60); // 1 day
            response.addCookie(userCookie);

            // Redirect to home.jsp
            response.sendRedirect("home.jsp");
        } else {
            // Invalid credentials: forward back to login with error message
            request.setAttribute("errorMessage", "Invalid credentials! Both Username and Password must be your Roll Number.");
            request.getRequestDispatcher("login.html").forward(request, response);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Logout handler
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        response.sendRedirect("login.html");
    }
}`
  },
  {
    name: 'DBConnection.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/util/DBConnection.java',
    description: 'JDBC connection helper for MySQL MedicalRecordDB and PatientDB.',
    code: `package com.med.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/MedicalRecordDB?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}`
  },
  {
    name: 'AddPatientServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/AddPatientServlet.java',
    description: 'Handles POST request to insert new patient into Patient table.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/AddPatientServlet")
public class AddPatientServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String name = request.getParameter("name");
        String dob = request.getParameter("date_of_birth");
        String gender = request.getParameter("gender");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone_number");
        String address = request.getParameter("address");

        String sql = "INSERT INTO Patient (name, date_of_birth, gender, email, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setDate(2, java.sql.Date.valueOf(dob));
            ps.setString(3, gender);
            ps.setString(4, email);
            ps.setString(5, phone);
            ps.setString(6, address);
            ps.executeUpdate();
            response.sendRedirect("viewPatient.jsp?msg=added");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("addPatient.jsp?error=" + e.getMessage());
        }
    }
}`
  },
  {
    name: 'ViewPatientServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/ViewPatientServlet.java',
    description: 'Retrieves all patient records from Patient table and forwards to viewPatient.jsp.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.*;
import java.util.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/ViewPatientServlet")
public class ViewPatientServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<Map<String, Object>> patientList = new ArrayList<>();
        String sql = "SELECT * FROM Patient ORDER BY patient_id DESC";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Map<String, Object> p = new HashMap<>();
                p.put("patient_id", rs.getInt("patient_id"));
                p.put("name", rs.getString("name"));
                p.put("date_of_birth", rs.getDate("date_of_birth"));
                p.put("gender", rs.getString("gender"));
                p.put("email", rs.getString("email"));
                p.put("phone_number", rs.getString("phone_number"));
                p.put("address", rs.getString("address"));
                patientList.add(p);
            }
            request.setAttribute("patients", patientList);
            request.getRequestDispatcher("viewPatient.jsp").forward(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("home.jsp?error=" + e.getMessage());
        }
    }
}`
  },
  {
    name: 'UpdatePatientServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/UpdatePatientServlet.java',
    description: 'Updates an existing patient record in Patient table.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/UpdatePatientServlet")
public class UpdatePatientServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("patient_id"));
        String name = request.getParameter("name");
        String dob = request.getParameter("date_of_birth");
        String gender = request.getParameter("gender");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone_number");
        String address = request.getParameter("address");

        String sql = "UPDATE Patient SET name=?, date_of_birth=?, gender=?, email=?, phone_number=?, address=? WHERE patient_id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setDate(2, java.sql.Date.valueOf(dob));
            ps.setString(3, gender);
            ps.setString(4, email);
            ps.setString(5, phone);
            ps.setString(6, address);
            ps.setInt(7, id);
            ps.executeUpdate();
            response.sendRedirect("viewPatient.jsp?msg=updated");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("updatePatient.jsp?id=" + id + "&error=" + e.getMessage());
        }
    }
}`
  },
  {
    name: 'DeletePatientServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/DeletePatientServlet.java',
    description: 'Deletes a patient record by ID from Patient table.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/DeletePatientServlet")
public class DeletePatientServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        int patientId = Integer.parseInt(request.getParameter("id"));
        String sql = "DELETE FROM Patient WHERE patient_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.executeUpdate();
            response.sendRedirect("viewPatient.jsp?msg=deleted");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("viewPatient.jsp?error=Cannot delete patient with linked medical records.");
        }
    }
}`
  },
  {
    name: 'AddRecordServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/AddRecordServlet.java',
    description: 'Inserts new medical record referencing patient_id and doctor_id.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/AddRecordServlet")
public class AddRecordServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        int patientId = Integer.parseInt(request.getParameter("patient_id"));
        int doctorId = Integer.parseInt(request.getParameter("doctor_id"));
        String recordDate = request.getParameter("date");
        String diagnosis = request.getParameter("diagnosis");
        String treatment = request.getParameter("treatment");

        String sql = "INSERT INTO MedicalRecord (patient_id, doctor_id, date, diagnosis, treatment) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.setInt(2, doctorId);
            ps.setDate(3, java.sql.Date.valueOf(recordDate));
            ps.setString(4, diagnosis);
            ps.setString(5, treatment);
            ps.executeUpdate();
            response.sendRedirect("viewRecord.jsp?msg=record_added");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("addRecord.jsp?error=" + e.getMessage());
        }
    }
}`
  },
  {
    name: 'ViewRecordServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/ViewRecordServlet.java',
    description: 'Performs JOIN query across MedicalRecord, Patient, and Doctor tables and forwards to viewRecord.jsp.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.*;
import java.util.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/ViewRecordServlet")
public class ViewRecordServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        List<Map<String, Object>> records = new ArrayList<>();
        String sql = "SELECT mr.record_id, mr.date, mr.diagnosis, mr.treatment, " +
                     "p.patient_id, p.name AS patient_name, " +
                     "d.doctor_id, d.name AS doctor_name, d.specialization " +
                     "FROM MedicalRecord mr " +
                     "JOIN Patient p ON mr.patient_id = p.patient_id " +
                     "JOIN Doctor d ON mr.doctor_id = d.doctor_id " +
                     "ORDER BY mr.date DESC";

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Map<String, Object> r = new HashMap<>();
                r.put("record_id", rs.getInt("record_id"));
                r.put("patient_id", rs.getInt("patient_id"));
                r.put("patient_name", rs.getString("patient_name"));
                r.put("doctor_id", rs.getInt("doctor_id"));
                r.put("doctor_name", rs.getString("doctor_name"));
                r.put("specialization", rs.getString("specialization"));
                r.put("date", rs.getDate("date"));
                r.put("diagnosis", rs.getString("diagnosis"));
                r.put("treatment", rs.getString("treatment"));
                records.add(r);
            }
            request.setAttribute("medicalRecords", records);
            request.getRequestDispatcher("viewRecord.jsp").forward(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("home.jsp?error=" + e.getMessage());
        }
    }
}`
  },
  {
    name: 'UpdateRecordServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/UpdateRecordServlet.java',
    description: 'Updates diagnosis, treatment, and consultation details in MedicalRecord.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/UpdateRecordServlet")
public class UpdateRecordServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        int recordId = Integer.parseInt(request.getParameter("record_id"));
        int patientId = Integer.parseInt(request.getParameter("patient_id"));
        int doctorId = Integer.parseInt(request.getParameter("doctor_id"));
        String recordDate = request.getParameter("date");
        String diagnosis = request.getParameter("diagnosis");
        String treatment = request.getParameter("treatment");

        String sql = "UPDATE MedicalRecord SET patient_id=?, doctor_id=?, date=?, diagnosis=?, treatment=? WHERE record_id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, patientId);
            ps.setInt(2, doctorId);
            ps.setDate(3, java.sql.Date.valueOf(recordDate));
            ps.setString(4, diagnosis);
            ps.setString(5, treatment);
            ps.setInt(6, recordId);
            ps.executeUpdate();
            response.sendRedirect("viewRecord.jsp?msg=record_updated");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("updateRecord.jsp?id=" + recordId + "&error=" + e.getMessage());
        }
    }
}`
  },
  {
    name: 'DeleteRecordServlet.java',
    category: 'Servlet',
    path: 'src/main/java/com/med/servlet/DeleteRecordServlet.java',
    description: 'Deletes a medical record entry by record_id.',
    code: `package com.med.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import com.med.util.DBConnection;

@WebServlet("/DeleteRecordServlet")
public class DeleteRecordServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        int recordId = Integer.parseInt(request.getParameter("id"));
        String sql = "DELETE FROM MedicalRecord WHERE record_id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, recordId);
            ps.executeUpdate();
            response.sendRedirect("viewRecord.jsp?msg=record_deleted");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("viewRecord.jsp?error=" + e.getMessage());
        }
    }
}`
  },
  {
    name: 'schema.sql',
    category: 'SQL',
    path: 'src/main/resources/schema.sql',
    description: 'MySQL DDL statements for creating MedicalRecordDB, PatientDB, and Doctor table.',
    code: `-- ========================================================
-- Lab Exercise: Patient Management System Database Setup
-- ========================================================
CREATE DATABASE IF NOT EXISTS PatientDB;
USE PatientDB;

CREATE TABLE IF NOT EXISTS Patient (
  patient_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  address TEXT
);

-- ========================================================
-- Lab Exercise: Medical Record Management System Database Setup
-- ========================================================
CREATE DATABASE IF NOT EXISTS MedicalRecordDB;
USE MedicalRecordDB;

-- Referenced Doctor table
CREATE TABLE IF NOT EXISTS Doctor (
  doctor_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100),
  department VARCHAR(100),
  email VARCHAR(255),
  phone_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS MedicalRecord (
  record_id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT,
  doctor_id INT,
  date DATE,
  diagnosis TEXT,
  treatment TEXT,
  FOREIGN KEY (patient_id) REFERENCES PatientDB.Patient(patient_id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE RESTRICT
);`
  },
  {
    name: 'login.html',
    category: 'HTML',
    path: 'src/main/webapp/login.html',
    description: 'HTML login form with roll number and password fields targeting LoginServlet.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login - Hospital Management System</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f0f4f8; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .login-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); width: 100%; max-width: 400px; }
    .login-card h2 { margin-top: 0; color: #1e3a8a; text-align: center; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; font-size: 0.9rem; }
    input[type="text"], input[type="password"] { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; box-sizing: border-box; }
    button { width: 100%; padding: 0.85rem; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    button:hover { background: #1d4ed8; }
    .info { font-size: 0.82rem; color: #6b7280; margin-top: 1rem; text-align: center; background: #eff6ff; padding: 0.6rem; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="login-card">
    <h2>Medical System Login</h2>
    <form action="LoginServlet" method="POST">
      <div class="form-group">
        <label for="rollNumber">Roll Number (Username):</label>
        <input type="text" id="rollNumber" name="rollNumber" placeholder="e.g. 21B91A0501" required />
      </div>
      <div class="form-group">
        <label for="password">Password (Same as Roll Number):</label>
        <input type="password" id="password" name="password" placeholder="Enter Roll Number" required />
      </div>
      <button type="submit">Sign In to Lab System</button>
    </form>
    <div class="info">
      <strong>Lab Requirement:</strong> Username and Password is your roll number. Upon login, session & cookies are preserved.
    </div>
  </div>
</body>
</html>`
  },
  {
    name: 'home.jsp',
    category: 'JSP',
    path: 'src/main/webapp/home.jsp',
    description: 'Homepage with navigation menu using include servlet and session validation.',
    code: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Session check
    String rollNo = (String) session.getAttribute("userRollNumber");
    if (rollNo == null) {
        response.sendRedirect("login.html");
        return;
    }
%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Home - Medical System</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Navigation menu included via include directive / servlet -->
  <jsp:include page="navbar.jsp" />

  <div class="container">
    <h1>Welcome, Student <%= rollNo %></h1>
    <p>Session Active: <%= session.getAttribute("loginTime") %></p>

    <div class="dashboard-grid">
      <div class="card">
        <h3>Patient Management</h3>
        <p>Manage patient registrations, details, and personal records.</p>
        <a href="viewPatient.jsp" class="btn">View All Patients</a>
        <a href="addPatient.jsp" class="btn btn-primary">Add New Patient</a>
      </div>

      <div class="card">
        <h3>Medical Record Management</h3>
        <p>Track diagnosis, clinical treatments, and doctor consultations.</p>
        <a href="viewRecord.jsp" class="btn">View Medical Records</a>
        <a href="addRecord.jsp" class="btn btn-primary">Add Medical Record</a>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: 'navbar.jsp',
    category: 'JSP',
    path: 'src/main/webapp/navbar.jsp',
    description: 'Shared navigation menu included across all JSP pages via RequestDispatcher/include.',
    code: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<nav class="navbar">
  <div class="nav-brand">MediCare Lab System</div>
  <ul class="nav-links">
    <li><a href="home.jsp">Home</a></li>
    <li><a href="viewPatient.jsp">Patients</a></li>
    <li><a href="addPatient.jsp">Add Patient</a></li>
    <li><a href="viewRecord.jsp">Medical Records</a></li>
    <li><a href="addRecord.jsp">Add Record</a></li>
  </ul>
  <div class="nav-user">
    <span>Roll No: <%= session.getAttribute("userRollNumber") %></span>
    <a href="LoginServlet" class="btn-logout">Logout</a>
  </div>
</nav>`
  },
  {
    name: 'addPatientForm.html',
    category: 'HTML',
    path: 'src/main/webapp/addPatientForm.html',
    description: 'HTML form for adding patient information submitting to AddPatientServlet.',
    code: `<form action="AddPatientServlet" method="POST" class="med-form">
  <div class="form-group">
    <label for="name">Patient Full Name:</label>
    <input type="text" id="name" name="name" required placeholder="e.g. John Doe">
  </div>
  <div class="form-row">
    <div class="form-group">
      <label for="date_of_birth">Date of Birth:</label>
      <input type="date" id="date_of_birth" name="date_of_birth" required>
    </div>
    <div class="form-group">
      <label for="gender">Gender:</label>
      <select id="gender" name="gender" required>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label for="email">Email Address:</label>
      <input type="email" id="email" name="email" required placeholder="john@example.com">
    </div>
    <div class="form-group">
      <label for="phone_number">Phone Number:</label>
      <input type="tel" id="phone_number" name="phone_number" required placeholder="+1 555-0199">
    </div>
  </div>
  <div class="form-group">
    <label for="address">Residential Address:</label>
    <textarea id="address" name="address" rows="3" required placeholder="Street address, City, State"></textarea>
  </div>
  <button type="submit" class="btn-submit">Add Patient Record</button>
</form>`
  },
  {
    name: 'viewPatient.jsp',
    category: 'JSP',
    path: 'src/main/webapp/viewPatient.jsp',
    description: 'Tabular view of all patients with Edit and Delete options.',
    code: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.med.util.DBConnection" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>View Patients - Medical System</title>
</head>
<body>
  <jsp:include page="navbar.jsp" />
  <div class="container">
    <h2>Patient Directory</h2>
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Date of Birth</th>
          <th>Gender</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <%
          try (Connection conn = DBConnection.getConnection();
               Statement st = conn.createStatement();
               ResultSet rs = st.executeQuery("SELECT * FROM Patient ORDER BY patient_id DESC")) {
            while (rs.next()) {
        %>
        <tr>
          <td><%= rs.getInt("patient_id") %></td>
          <td><strong><%= rs.getString("name") %></strong></td>
          <td><%= rs.getDate("date_of_birth") %></td>
          <td><%= rs.getString("gender") %></td>
          <td><%= rs.getString("email") %></td>
          <td><%= rs.getString("phone_number") %></td>
          <td><%= rs.getString("address") %></td>
          <td>
            <a href="updatePatient.jsp?id=<%= rs.getInt("patient_id") %>">Edit</a> |
            <a href="DeletePatientServlet?id=<%= rs.getInt("patient_id") %>" onclick="return confirm('Are you sure you want to delete this patient?');">Delete</a>
          </td>
        </tr>
        <%
            }
          } catch(Exception e) {
            out.println("<tr><td colspan='8'>Error loading patients: " + e.getMessage() + "</td></tr>");
          }
        %>
      </tbody>
    </table>
  </div>
</body>
</html>`
  },
  {
    name: 'viewRecord.jsp',
    category: 'JSP',
    path: 'src/main/webapp/viewRecord.jsp',
    description: 'Relational table of medical records linking Patient and Doctor with Edit and Delete actions.',
    code: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.med.util.DBConnection" %>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Medical Records - System</title>
</head>
<body>
  <jsp:include page="navbar.jsp" />
  <div class="container">
    <h2>Medical Records Master View</h2>
    <table border="1" cellpadding="8" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>Record #</th>
          <th>Date</th>
          <th>Patient Name (ID)</th>
          <th>Attending Doctor</th>
          <th>Diagnosis</th>
          <th>Treatment Plan</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <%
          String query = "SELECT mr.record_id, mr.date, mr.diagnosis, mr.treatment, " +
                         "p.patient_id, p.name AS patient_name, " +
                         "d.doctor_id, d.name AS doctor_name, d.specialization " +
                         "FROM MedicalRecord mr " +
                         "JOIN Patient p ON mr.patient_id = p.patient_id " +
                         "JOIN Doctor d ON mr.doctor_id = d.doctor_id " +
                         "ORDER BY mr.date DESC";
          try (Connection conn = DBConnection.getConnection();
               Statement st = conn.createStatement();
               ResultSet rs = st.executeQuery(query)) {
            while (rs.next()) {
        %>
        <tr>
          <td><%= rs.getInt("record_id") %></td>
          <td><%= rs.getDate("date") %></td>
          <td><%= rs.getString("patient_name") %> (#<%= rs.getInt("patient_id") %>)</td>
          <td><%= rs.getString("doctor_name") %> (<%= rs.getString("specialization") %>)</td>
          <td><%= rs.getString("diagnosis") %></td>
          <td><%= rs.getString("treatment") %></td>
          <td>
            <a href="updateRecord.jsp?id=<%= rs.getInt("record_id") %>">Edit</a> |
            <a href="DeleteRecordServlet?id=<%= rs.getInt("record_id") %>" onclick="return confirm('Delete this record?');">Delete</a>
          </td>
        </tr>
        <%
            }
          } catch(Exception e) {
            out.println("<tr><td colspan='7'>Error: " + e.getMessage() + "</td></tr>");
          }
        %>
      </tbody>
    </table>
  </div>
</body>
</html>`
  },
  {
    name: 'web.xml',
    category: 'Config',
    path: 'src/main/webapp/WEB-INF/web.xml',
    description: 'Standard Servlet and JSP deployment descriptor.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
  <display-name>Medical Record Management System</display-name>
  <welcome-file-list>
    <welcome-file>login.html</welcome-file>
  </welcome-file-list>
  <session-config>
    <session-timeout>30</session-timeout>
  </session-config>
</web-app>`
  }
];
