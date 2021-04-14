/* eslint-disable consistent-return */
import axios from 'axios';

/**
 * Initializes a new instance of Server
 * @class
 */
export default class Server {
  /**
   * @param {Object} config The server connection configuration
   */
  constructor(config) {
    this._config = config;
  }

  /**
   * @param {Object} entity Initial data
   * @public
   * @returns {Promise} Promise object represents created entity
   */
  async create(entity) {
    try {
      const response = await axios.post(`${this._config.url}`, entity);
      const data = response.data;

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {Number} id Entity id
   * @param {Object} entity Updated data
   * @returns {Promise} Promise object represents updated entity
   * @public
   */
  async update(id, entity) {
    try {
      const response = await axios.put(`${this._config.url}/${id}`, entity);
      const data = response.data;

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @param {Number} id Entity id
   * @returns {Promise} Promise object represents entity status
   * @public
   */
  async status(id) {
    try {
      const response = await axios.get(`${this._config.url}/${id}`);
      const data = response.data;

      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
