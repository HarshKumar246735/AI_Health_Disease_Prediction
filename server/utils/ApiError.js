class ApiError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    Object.assign(this, extra); // e.g. { errors: { field: 'message' }, code: 'ML_UNAVAILABLE' }
  }
}
module.exports = ApiError;
