import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class RannerApi {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    // console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${RannerApi.token}` };
    const params = (method === "get") ? data : {};

    try {
      // console.debug("RannerApi - Request - TRY:", endpoint, data, method);
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("RannerAPI Error:", err.response);
      let message = err?.response?.data?.error?.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  ///// User API routes /////

  /** Get or search all users. */
  static async getUserAll(query = {}) {
    let res = await this.request(`users`, query);
    return res.users;
  }

  /** Get details on a user by username. */
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Post a new user. */
  static async postUser(properties) {
    let res = await this.request(`users/`, properties, "post");
    return res.user;
  }

  /** Patch a user by username. */
  static async patchUser(username, properties) {
    let res = await this.request(`users/${username}`, properties, "patch");
    return res.user;
  }

  /** Delete a user by username. */
  static async deleteUser(username) {
    await this.request(`users/${username}`, {}, "delete");
  }

  /////// TRIPS ///////

  /** Post a new trip */
  static async postTrip(data) {
    let res = await this.request(`trips`, data, 'post');
    return res;
  }
  /** Update a trip */
  static async updateTrip(id, data) {
    let res = await this.request(`trips/${id}`, data, 'patch');
    return res;
  }
  /** Get all trips */ 
  static async getTrips() {
    let res = await this.request(`trips`);
    return res.trips;
  }
  /** Get trip by ID */ 
  static async getTrip(id) {
    let res = await this.request(`trips/${id}`);
    return res.trip;
  }
    /** Delete a trip by ID */
    static async deleteTrip(id) {
      let res = await this.request(`trips/${id}`, {}, 'delete');
      return res.message;
    }

  /////// SIGN-UP & LOGIN ///////

  /** Sign up a new user */
  static async signUp(data) {
    let res = await this.request('auth/register', data, 'post');
    return res.token;
  }

  /** Login a user */
  static async login(data) {
    let res = await this.request('auth/token', data, 'post');
    return res.token;
  }

  ///// Flight API routes /////

  /** Get or search all flights. */
  static async getFlightAll(query = {}) {
    let res = await this.request(`flights`, query);
    return res.flights;
  }

  /** Get details on a flight by id. */
  static async getFlight(id) {
    let res = await this.request(`flights/${id}`);
    return res.flight;
  }

  /** Post a new flight. */
  static async postFlight(properties) {
    let res = await this.request(`flights`, properties, "post");
    return res.flight;
  }

  /** Patch a flight by id. */
  static async patchFlight(id, properties) {
    let res = await this.request(`flights/${id}`, properties, "patch");
    return res.flight;
  }

  /** Delete a flight by id. */
  static async deleteFlight(id) {
    await this.request(`flights/${id}`, {}, "delete");
  }

  ///// Accommodation API routes /////

  /** Get or search all accommodations. */
  static async getAccommodationAll(query = {}) {
    let res = await this.request(`accommodations`, query);
    return res.accommodations;
  }

  /** Get details on an accommodation by id. */
  static async getAccommodation(id) {
    let res = await this.request(`accommodations/${id}`);
    return res.accommodation;
  }

  /** Post a new accommodation. */
  static async postAccommodation(properties) {
    let res = await this.request(`accommodations`, properties, "post");
    return res.accommodation;
  }

  /** Patch an accommodation by id. */
  static async patchAccommodation(id, properties) {
    let res = await this.request(`accommodations/${id}`, properties, "patch");
    return res.accommodation;
  }

  /** Delete an accommodation by id. */
  static async deleteAccommodation(id) {
    await this.request(`accommodations/${id}`, {}, "delete");
  }
}

// for now, put token ("testuser" / "password" on class)
RannerApi.token = "your-token-here";

export default RannerApi;