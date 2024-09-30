const {
  REGION,
  SDK_SOCKET_TIMEOUT,
  SDK_CONNECTION_TIMEOUT,
  SOCIAL_NETWORK_TABLE_NAME
} = process.env

export const config = {
  region: REGION,
  sdkSocketTimeout: SDK_SOCKET_TIMEOUT,
  sdkConnectionTimeout: SDK_CONNECTION_TIMEOUT,
  socialNetworkTableName: SOCIAL_NETWORK_TABLE_NAME
}