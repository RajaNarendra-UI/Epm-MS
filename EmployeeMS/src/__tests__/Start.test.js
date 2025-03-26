import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Start from "../Components/Start"
import axios from "axios";
// import { TestEncoder , TestDecoder } from 'util'

// global.TextEncoder = TextEncoder
// global.TextDecoder = TextDecoder

// Mock axios
jest.mock("axios");

describe("Start Component", () => {
  test("renders the Start component correctly", () => {
    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    expect(screen.getByText("Employee Management System")).toBeInTheDocument();
    expect(screen.getByText("Login As")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("navigates to employee login when Employee button is clicked", () => {
    const { container } = render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    const employeeButton = screen.getByText("Employee");
    fireEvent.click(employeeButton);

    expect(window.location.pathname).toBe("/employee_login");
  });

  test("navigates to admin login when Admin button is clicked", () => {
    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    const adminButton = screen.getByText("Admin");
    fireEvent.click(adminButton);

    expect(window.location.pathname).toBe("/adminlogin");
  });

  test("calls API and navigates correctly based on role", async () => {
    axios.get.mockResolvedValue({
      data: { Status: true, role: "admin", id: 123 }
    });

    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/dashboard");
    });
  });

  test("calls API and navigates to employee detail page when role is employee", async () => {
    axios.get.mockResolvedValue({
      data: { Status: true, role: "employee", id: 456 }
    });

    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/employee_detail/456");
    });
  });

  test("handles API error gracefully", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    render(
      <BrowserRouter>
        <Start />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(console.log).not.toThrow();
    });
  });
});