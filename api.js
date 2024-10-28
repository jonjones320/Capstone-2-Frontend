import axios from "axios";
import { ErrorHandler } from "./src/utils/errorHandler";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const BASE_URL = import.meta.env.REACT_APP_BASE_URL || "https://capstone-2-backend-iahv.onrender.com";


/** API Class - Static class tying together methods used to get/send to the API. */

class RannerApi {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    try {
      const response = await axios({
        url: `${BASE_URL}/${endpoint}`,
        method,
        data,
        params: (method === "get") ? data : {},
        headers: { Authorization: `Bearer ${RannerApi.token}` }
      });
      return response.data;
    } catch (err) {
      ErrorHandler.handleApiError(err);
    }
  };


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
    let res = await this.request(`users/${username}`, { username });
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
    await this.request(`users/${username}`, { username }, "delete");
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
  static async deleteTrip(id, username) {
    let res = await this.request(`trips/${id}`, { username }, 'delete');
    return res.message;
  }


  ///// Amadeus Flight API routes /////

  /** Get airport suggestions based on user input */
  static async getAirportSuggestions(query) {
    let res = await this.request(`flights/airport-suggestions`, { keyword: query }, 'get');
    return res;
  }

  /** Search for flight offers */
  static async searchFlightOffers(query = {}) {
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
  
  /** Post a new saved flight. */
  static async postFlight(properties) {
    let res = await this.request(`flights`, properties, "post");
    return res.flight;
  }
  /** Get details on a saved flight or flights by filters. */
  static async getFlight(filters) {
    try {
      let params;
      if (typeof filters === 'number' || typeof filters === 'string') {
        // If filters is a number or string, assume it's an ID.
        params = { id: filters };
      } else if (typeof filters === 'object' && filters !== null) {
        // If filters is already an object, use it as is.
        params = filters;
      } else {
        // If filters is neither a number/string nor an object, throw an error.
        throw new Error('Invalid filters parameter');
      }

      let res = await this.request('flights', params);
      return res.flight;
    } catch (error) {
      console.error("api.js - getFlight - ERROR:", error);
      throw error;
    }
  }
  /** Get flights by trip id */
  static async getFlightsByTrip(tripId) {
    let res = await this.request(`flights/trip/${tripId}`);
    return res.flights
  }
  /** Patch a saved flight by id. */
  static async patchFlight(id, properties) {
    let res = await this.request(`flights/${id}`, properties, "patch");
    return res.flight;
  }
  /** Delete a saved flight by id. */
  static async deleteFlight(id, username) {
    await this.request(`flights/${id}`, { username }, "delete");
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



export default RannerApi;