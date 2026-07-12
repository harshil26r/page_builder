import { NextResponse } from "next/server";

/**
 * Standardized Success Response
 */
export function successResponse(data = {}, message = "Success", status = 200) {
  return NextResponse.json({ success: true, message, ...data }, { status });
}

/**
 * Centralized Error Handler for API routes across the application
 */
export function errorResponse(error, fallbackMessage = "An unexpected error occurred", defaultStatus = 500) {
  let message = fallbackMessage;
  let status = defaultStatus;

  if (typeof error === "string") {
    message = error;
    if (status === 500) status = 400;
  } else if (error) {
    // Mongoose Duplicate Key Error (E11000)
    if (error.code === 11000) {
      status = 400;
      const keyPattern = Object.keys(error.keyPattern || {})[0] || "field";
      const duplicateValue = error.keyValue ? error.keyValue[keyPattern] : "";
      message = `A page with this ${keyPattern} "${duplicateValue}" already exists. Please choose a unique ${keyPattern}.`;
    }
    // Mongoose Validation Error
    else if (error.name === "ValidationError") {
      status = 400;
      const firstError = Object.values(error.errors || {})[0];
      message = firstError?.message || "Invalid input data provided.";
    }
    // Mongoose Cast Error (Invalid ObjectId)
    else if (error.name === "CastError") {
      status = 400;
      message = `Invalid ID format for ${error.path || "resource"}.`;
    }
    // Generic Error with explicit message
    else if (error.message) {
      message = error.message;
    }
  }

  console.error(`[API Error Response ${status}]:`, error);
  return NextResponse.json({ success: false, error: message }, { status });
}
