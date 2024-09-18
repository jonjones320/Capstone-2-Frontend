import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class - Static class tying together methods used to get/send to the API. */

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
  static async getTrips(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    let res = await this.request(`trips?${params}`);
    return res.trips;
  }
  /** Get trip by username */
  static async getTripsByUsername(username) {
    let res = await this.request(`trips/user/${username}`);
    return res.trips;
  }
  /** Get trip by ID */ 
  static async getTripById(id) {
    let res = await this.request(`trips/${id}`);
    return res.trip;
  }
  /** Delete a trip by ID */
  static async deleteTrip(id) {
    let res = await this.request(`trips/${id}`, {}, 'delete');
    return res.message;
  }

  ///// Amadeus Flight API routes /////

  /** Search for flight offers */
  static async searchFlightOffers(query = {}) {
    console.log("RannerApi - searchFlightOffers - query:", query);
    let res = await this.request(`flights/offers`, query);
    return res;
  }

  /** Post a flight search offer */
  static async postFlightOffers(data = {}) {
    let res = await this.request(`flights/offers`, data, "post");
    return res;
  }

  /** Get flight destinations based on origin */
  static async getFlightDestinations(query = {}) {
    let res = await this.request(`flights/destinations`, query);
    return res;
  }

  /** Get flight dates based on origin and destination */
  static async getFlightDates(query = {}) {
    let res = await this.request(`flights/dates`, query);
    return res;
  }

  /** Get flight offer price */
  static async getFlightOfferPrice(query = {}) {
    let res = await this.request(`flights/offers/price`, query);
    return res;
  }

  /** Post flight offer price with additional data (e.g. bags) */
  static async postFlightOfferPrice(data = {}) {
    let res = await this.request(`flights/offers/price`, data, "post");
    return res;
  }

  /** Create a flight order */
  static async createFlightOrder(data = {}) {
    let res = await this.request(`flights/orders`, data, "post");
    return res;
  }

  /** Retrieve a flight order by ID */
  static async getFlightOrder(id) {
    let res = await this.request(`flights/orders/${id}`);
    return res;
  }

  /** Cancel a flight order by ID */
  static async deleteFlightOrder(id) {
    let res = await this.request(`flights/orders/${id}`, {}, "delete");
    return res;
  }

  /** Get seat map for a flight */
  static async getFlightSeatMap(query = {}) {
    let res = await this.request(`flights/seatmaps`, query);
    return res;
  }

  /** Get seat map for a flight order by ID */
  static async getFlightOrderSeatMap(id) {
    let res = await this.request(`flights/orders/${id}/seatmap`);
    return res;
  }

  /** Get flight availabilities */
  static async postFlightAvailabilities(data = {}) {
    let res = await this.request(`flights/availabilities`, data, "post");
    return res;
  }

  /** Post branded fares upsell */
  static async postFlightUpselling(data = {}) {
    let res = await this.request(`flights/offers/upselling`, data, "post");
    return res;
  }

  /** Get flight choice prediction */
  static async getFlightPrediction(query = {}) {
    let res = await this.request(`flights/offers/prediction`, query);
    return res;
  }

  /** Get airline check-in links */
  static async getCheckinLinks(query = {}) {
    let res = await this.request(`airline/checkinLinks`, query);
    return res;
  }

  /** Get on-demand flight status */
  static async getFlightStatus(query = {}) {
    let res = await this.request(`flights/status`, query);
    return res;
  }

  /** Get busiest traveling period */
  static async getBusiestTravelPeriod(query = {}) {
    let res = await this.request(`flights/busiestPeriod`, query);
    return res;
  }
  
  ///// Saved Flight API routes /////
  
  /** Get or search all flights. */
  static async getFlightAll(query = {}) {
    let res = await this.request(`flights`, query);
    return res.flights;
  }
  /** Get details on a saved flight by id. */
  static async getFlight(id) {
    let res = await this.request(`flights/${id}`);
    return res.flight;
  }
  /** Post a new saved flight. */
  static async postFlight(properties) {
    let res = await this.request(`flights`, properties, "post");
    return res.flight;
  }
  /** Patch a saved flight by id. */
  static async patchFlight(id, properties) {
    let res = await this.request(`flights/${id}`, properties, "patch");
    return res.flight;
  }
  /** Delete a saved flight by id. */
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

  ///// Parsing /////

    // Trip Parser request from the frontend
  static async parseTrip(data) {
    let res = await this.request(`tripParser`, data, "post");
    return res;
  }
}

// for now, put token ("testuser" / "password" on class)
RannerApi.token = "your-token-here";

export default RannerApi;