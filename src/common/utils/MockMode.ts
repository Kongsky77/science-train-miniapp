export function isMockMode(): boolean {
  return process.env.VUE_APP_USE_MOCK_DATA === "true"
}

export function isIntegrationMode(): boolean {
  return process.env.VUE_APP_INTEGRATION_MODE === "true"
}
