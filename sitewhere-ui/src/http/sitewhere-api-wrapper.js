import {
  BASE_URL, createAxiosAuthorized,

  // Users.
  getUser, listUserTenants,

  // Tenants.
  getTenant,

  // Schedules.
  listSchedules,

  // Assets.
  getAssetModules, searchAssets, getAssetById
} from './sitewhere-api'

// Sites.
import {
  createSite,
  getSite,
  updateSite,
  listSites,
  deleteSite,
  listAssignmentsForSite,
  listLocationsForSite,
  listMeasurementsForSite,
  listAlertsForSite,
  listZonesForSite,
  createZone,
  getZone,
  updateZone,
  deleteZone
} from './sitewhere-sites-api.js'

// Specifications.
import {
  createDeviceSpecification,
  getDeviceSpecification,
  getDeviceSpecificationProtobuf,
  updateDeviceSpecification,
  listDeviceSpecifications,
  deleteDeviceSpecification,
  createDeviceCommand,
  getDeviceCommand,
  listDeviceCommands,
  updateDeviceCommand,
  listDeviceCommandsByNamespace,
  deleteDeviceCommand
} from './sitewhere-specifications-api.js'

// Devices.
import {
  listDevices,
  listFilteredDevices
} from './sitewhere-devices-api.js'

// Assignments.
import {
  getDeviceAssignment,
  releaseAssignment,
  missingAssignment,
  deleteDeviceAssignment,
  createMeasurementsForAssignment,
  listMeasurementsForAssignment,
  createLocationForAssignment,
  listLocationsForAssignment,
  createAlertForAssignment,
  listAlertsForAssignment,
  createCommandInvocationForAssignment,
  scheduleCommandInvocation,
  listCommandInvocationsForAssignment,
  listCommandResponsesForAssignment
} from './sitewhere-assignments-api.js'

// Device Groups.
import {
  listDeviceGroups
} from './sitewhere-device-groups-api.js'

/**
 * Create authorized axios client based on store values.
 */
export function createAxiosFromStore (store) {
  var baseUrl = BASE_URL
  var authToken = store.getters.authToken
  var tenantToken = (store.getters.selectedTenant) ? store.getters.selectedTenant.authenticationToken : ''
  return createAxiosAuthorized(baseUrl, authToken, tenantToken)
}

/**
 * Wrap API call to indicate loading status.
 */
function loaderWrapper (store, apiCall) {
  return new Promise((resolve, reject) => {
    store.commit('startLoading')
    apiCall.then(function (response) {
      store.commit('stopLoading')
      store.commit('error', null)
      resolve(response)
    }).catch(function (e) {
      store.commit('stopLoading')
      store.commit('error', e)
      reject(e)
    })
  })
}

/**
 * Get user by username.
 */
export function _getUser (store, username) {
  let axios = createAxiosFromStore(store)
  var api = getUser(axios, username)
  return loaderWrapper(store, api)
}

/**
 * List authorized tenants for currently logged in user.
 */
export function _listTenantsForCurrentUser (store) {
  let axios = createAxiosFromStore(store)
  let username = store.getters.user.username
  var api = listUserTenants(axios, username, false)
  return loaderWrapper(store, api)
}

/**
 * Get a tenant by tenant id.
 */
export function _getTenant (store, tenantId) {
  let axios = createAxiosFromStore(store)
  let api = getTenant(axios, tenantId)
  return loaderWrapper(store, api)
}

/**
 * Create a site.
 */
export function _createSite (store, site) {
  let axios = createAxiosFromStore(store)
  let api = createSite(axios, site)
  return loaderWrapper(store, api)
}

/**
 * Get a site by unique token.
 */
export function _getSite (store, siteToken) {
  let axios = createAxiosFromStore(store)
  let api = getSite(axios, siteToken)
  return loaderWrapper(store, api)
}

/**
 * Update an existing site.
 */
export function _updateSite (store, siteToken, payload) {
  let axios = createAxiosFromStore(store)
  let api = updateSite(axios, siteToken, payload)
  return loaderWrapper(store, api)
}

/**
 * List sites.
 */
export function _listSites (store, includeAssignments, includeZones, paging) {
  let axios = createAxiosFromStore(store)
  let api = listSites(axios, includeAssignments, includeZones, paging)
  return loaderWrapper(store, api)
}

/**
 * Delete an existing site.
 */
export function _deleteSite (store, siteToken, force) {
  let axios = createAxiosFromStore(store)
  let api = deleteSite(axios, siteToken, force)
  return loaderWrapper(store, api)
}

/**
 * List assignments for a given site.
 */
export function _listAssignmentsForSite (store, siteToken, includeDevice,
  includeAsset, paging) {
  let axios = createAxiosFromStore(store)
  let api = listAssignmentsForSite(axios, siteToken, includeDevice, includeAsset, paging)
  return loaderWrapper(store, api)
}

/**
 * List location events for a given site.
 */
export function _listLocationsForSite (store, siteToken, paging) {
  let axios = createAxiosFromStore(store)
  let api = listLocationsForSite(axios, siteToken, paging)
  return loaderWrapper(store, api)
}

/**
 * List measurement events for a given site.
 */
export function _listMeasurementsForSite (store, siteToken, paging) {
  let axios = createAxiosFromStore(store)
  let api = listMeasurementsForSite(axios, siteToken, paging)
  return loaderWrapper(store, api)
}

/**
 * List alert events for a given site.
 */
export function _listAlertsForSite (store, siteToken, paging) {
  let axios = createAxiosFromStore(store)
  let api = listAlertsForSite(axios, siteToken, paging)
  return loaderWrapper(store, api)
}

/**
 * List zones for a given site.
 */
export function _listZonesForSite (store, siteToken, paging) {
  let axios = createAxiosFromStore(store)
  let api = listZonesForSite(axios, siteToken, paging)
  return loaderWrapper(store, api)
}

/**
 * Create a zone.
 */
export function _createZone (store, siteToken, zone) {
  let axios = createAxiosFromStore(store)
  let api = createZone(axios, siteToken, zone)
  return loaderWrapper(store, api)
}

/**
 * Get a zone by unique token.
 */
export function _getZone (store, zoneToken) {
  let axios = createAxiosFromStore(store)
  let api = getZone(axios, zoneToken)
  return loaderWrapper(store, api)
}

/**
 * Update an existing zone.
 */
export function _updateZone (store, zoneToken, updated) {
  let axios = createAxiosFromStore(store)
  let api = updateZone(axios, zoneToken, updated)
  return loaderWrapper(store, api)
}

/**
 * Delete an existing zone.
 */
export function _deleteZone (store, zoneToken) {
  let axios = createAxiosFromStore(store)
  let api = deleteZone(axios, zoneToken)
  return loaderWrapper(store, api)
}

/**
 * Get a device assignment by unique token.
 */
export function _getDeviceAssignment (store, token) {
  let axios = createAxiosFromStore(store)
  let api = getDeviceAssignment(axios, token)
  return loaderWrapper(store, api)
}

/**
 * Delete a device assignment.
 */
export function _deleteDeviceAssignment (store, token, force) {
  let axios = createAxiosFromStore(store)
  let api = deleteDeviceAssignment(axios, token, force)
  return loaderWrapper(store, api)
}

/**
 * Create measurements event for a device assignment.
 */
export function _createMeasurementsForAssignment (store, token, payload) {
  let axios = createAxiosFromStore(store)
  let api = createMeasurementsForAssignment(axios, token, payload)
  return loaderWrapper(store, api)
}

/**
 * List measurement events for a device assignment.
 */
export function _listMeasurementsForAssignment (store, token, query) {
  let axios = createAxiosFromStore(store)
  let api = listMeasurementsForAssignment(axios, token, query)
  return loaderWrapper(store, api)
}

/**
 * Create location event for a device assignment.
 */
export function _createLocationForAssignment (store, token, payload) {
  let axios = createAxiosFromStore(store)
  let api = createLocationForAssignment(axios, token, payload)
  return loaderWrapper(store, api)
}

/**
 * List location events for a device assignment.
 */
export function _listLocationsForAssignment (store, token, query) {
  let axios = createAxiosFromStore(store)
  let api = listLocationsForAssignment(axios, token, query)
  return loaderWrapper(store, api)
}

/**
 * Create alert event for a device assignment.
 */
export function _createAlertForAssignment (store, token, payload) {
  let axios = createAxiosFromStore(store)
  let api = createAlertForAssignment(axios, token, payload)
  return loaderWrapper(store, api)
}

/**
 * List alert events for a device assignment.
 */
export function _listAlertsForAssignment (store, token, query) {
  let axios = createAxiosFromStore(store)
  let api = listAlertsForAssignment(axios, token, query)
  return loaderWrapper(store, api)
}

/**
 * Create command invocation for a device assignment.
 */
export function _createCommandInvocationForAssignment (store, token, payload) {
  let axios = createAxiosFromStore(store)
  let api = createCommandInvocationForAssignment(axios, token, payload)
  return loaderWrapper(store, api)
}

/**
 * Schedule command invocation for a device assignment.
 */
export function _scheduleCommandInvocation (store, token, schedule, payload) {
  let axios = createAxiosFromStore(store)
  let api = scheduleCommandInvocation(axios, token, schedule, payload)
  return loaderWrapper(store, api)
}

/**
 * List command invocation events for a device assignment.
 */
export function _listCommandInvocationsForAssignment (store, token, query) {
  let axios = createAxiosFromStore(store)
  let api = listCommandInvocationsForAssignment(axios, token, query)
  return loaderWrapper(store, api)
}

/**
 * List command response events for a device assignment.
 */
export function _listCommandResponsesForAssignment (store, token, query) {
  let axios = createAxiosFromStore(store)
  let api = listCommandResponsesForAssignment(axios, token, query)
  return loaderWrapper(store, api)
}

/**
 * Release an assignment.
 */
export function _releaseAssignment (store, token) {
  let axios = createAxiosFromStore(store)
  let api = releaseAssignment(axios, token)
  return loaderWrapper(store, api)
}

/**
 * Report an assignment as missing.
 */
export function _missingAssignment (store, token) {
  let axios = createAxiosFromStore(store)
  let api = missingAssignment(axios, token)
  return loaderWrapper(store, api)
}

/**
 * Create a new device specification.
 */
export function _createDeviceSpecification (store, payload) {
  let axios = createAxiosFromStore(store)
  let api = createDeviceSpecification(axios, payload)
  return loaderWrapper(store, api)
}

/**
 * Get a device specification by token.
 */
export function _getDeviceSpecification (store, token) {
  let axios = createAxiosFromStore(store)
  let api = getDeviceSpecification(axios, token)
  return loaderWrapper(store, api)
}

/**
 * Get a device specification protocol buffer definition.
 */
export function _getDeviceSpecificationProtobuf (store, token) {
  let axios = createAxiosFromStore(store)
  let api = getDeviceSpecificationProtobuf(axios, token)
  return loaderWrapper(store, api)
}

/**
 * Update an existing device specification.
 */
export function _updateDeviceSpecification (store, token, payload) {
  let axios = createAxiosFromStore(store)
  let api = updateDeviceSpecification(axios, token, payload)
  return loaderWrapper(store, api)
}

/**
 * List device specifications.
 */
export function _listDeviceSpecifications (store, includeDeleted, includeAsset, paging) {
  let axios = createAxiosFromStore(store)
  let api = listDeviceSpecifications(axios, includeDeleted, includeAsset, paging)
  return loaderWrapper(store, api)
}

/**
 * Delete an existing device specification.
 */
export function _deleteDeviceSpecification (store, token, force) {
  let axios = createAxiosFromStore(store)
  let api = deleteDeviceSpecification(axios, token, force)
  return loaderWrapper(store, api)
}

/**
 * Create a device command.
 */
export function _createDeviceCommand (store, token, payload) {
  let axios = createAxiosFromStore(store)
  let api = createDeviceCommand(axios, token, payload)
  return loaderWrapper(store, api)
}

/**
 * Get a device command by token.
 */
export function _getDeviceCommand (store, token) {
  let axios = createAxiosFromStore(store)
  let api = getDeviceCommand(axios, token)
  return loaderWrapper(store, api)
}

/**
 * Update an exiting device command.
 */
export function _updateDeviceCommand (store, token, payload) {
  let axios = createAxiosFromStore(store)
  let api = updateDeviceCommand(axios, token, payload)
  return loaderWrapper(store, api)
}

/**
 * List commands for a device specification.
 */
export function _listDeviceCommands (store, token, includeDeleted) {
  let axios = createAxiosFromStore(store)
  let api = listDeviceCommands(axios, token, includeDeleted)
  return loaderWrapper(store, api)
}

/**
 * List device specification commands organized by namespace.
 */
export function _listDeviceCommandsByNamespace (store, token, includeDeleted) {
  let axios = createAxiosFromStore(store)
  let api = listDeviceCommandsByNamespace(axios, token, includeDeleted)
  return loaderWrapper(store, api)
}

/**
 * Delete a device command.
 */
export function _deleteDeviceCommand (store, token, force) {
  let axios = createAxiosFromStore(store)
  let api = deleteDeviceCommand(axios, token, force)
  return loaderWrapper(store, api)
}

/**
 * List devices.
 */
export function _listDevices (store, includeSpecification, includeAssignment,
  paging) {
  let axios = createAxiosFromStore(store)
  let api = listDevices(axios, includeSpecification, includeAssignment,
    paging)
  return loaderWrapper(store, api)
}

/**
 * List devices.
 */
export function _listFilteredDevices (store, site, specification, includeDeleted,
  excludeAssigned, includeSpecification, includeAssignment, paging) {
  let axios = createAxiosFromStore(store)
  let api = listFilteredDevices(axios, site, specification, includeDeleted,
    excludeAssigned, includeSpecification, includeAssignment, paging)
  return loaderWrapper(store, api)
}

/**
 * List device groups.
 */
export function _listDeviceGroups (store, role, includeDeleted, paging) {
  let axios = createAxiosFromStore(store)
  let api = listDeviceGroups(axios, role, includeDeleted, paging)
  return loaderWrapper(store, api)
}

/**
 * List schedules.
 */
export function _listSchedules (store, paging) {
  let axios = createAxiosFromStore(store)
  let api = listSchedules(axios, paging)
  return loaderWrapper(store, api)
}

/**
 * Get asset modules.
 */
export function _getAssetModules (store, type) {
  let axios = createAxiosFromStore(store)
  let api = getAssetModules(axios, type)
  return loaderWrapper(store, api)
}

/**
 * Search asset module for assets matching criteria.
 */
export function _searchAssets (store, moduleId, criteria) {
  let axios = createAxiosFromStore(store)
  let api = searchAssets(axios, moduleId, criteria)
  return loaderWrapper(store, api)
}

/**
 * Get asset by unique id.
 */
export function _getAssetById (store, moduleId, assetId) {
  let axios = createAxiosFromStore(store)
  let api = getAssetById(axios, moduleId, assetId)
  return loaderWrapper(store, api)
}