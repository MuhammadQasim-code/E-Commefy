class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  toJSON() {
    return {
      success: this.statusCode < 400,
      message: this.message,
      data: this.data,
    };
  }
}

module.exports = ApiResponse;
