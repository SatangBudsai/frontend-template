/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RegisterDto {
  /** @example "user@example.com" */
  email: string
  /** @example "Example User" */
  name: string
  /**
   * @minLength 12
   * @maxLength 128
   */
  password: string
}

export interface AuthAccountDto {
  /** @format uuid */
  id: string
  /** @format email */
  email: string
  name: string
  /** @example ["user"] */
  roles: string[]
  /** @example ["account:read"] */
  permissions: string[]
}

export interface AuthSessionResponseDto {
  /** Compact JWE access token. */
  accessToken: string
  /** @format date-time */
  accessTokenExpiresAt: string
  /** Send as x-csrf-token for refresh and logout. */
  csrfToken: string
  account: AuthAccountDto
}

export interface LoginDto {
  /** @example "user@example.com" */
  email: string
  /**
   * @minLength 1
   * @maxLength 128
   */
  password: string
}

export interface LogoutDto {
  /** @default "CURRENT_DEVICE" */
  scope?: 'CURRENT_DEVICE' | 'ALL_DEVICES'
}

export interface AuthSessionListItemDto {
  /** @format uuid */
  id: string
  current: boolean
  /** @format date-time */
  issuedAt: string
  /** @format date-time */
  lastUsedAt: string
  /** @format date-time */
  expiresAt: string
}

export interface RoleResponseDto {
  /** @format uuid */
  id: string
  code: string
  name: string
  description?: string | null
  isSystem: boolean
  isActive: boolean
  permissions: string[]
}

export interface PermissionResponseDto {
  code: string
  description?: string | null
}

export interface CreateRoleDto {
  /**
   * @pattern ^[a-z][a-z0-9-]*$
   * @example "content-editor"
   */
  code: string
  /** @example "Content editor" */
  name: string
  /** @maxLength 500 */
  description?: string
  /** @example ["account:read"] */
  permissionCodes: string[]
}

export interface UpdateRoleDto {
  /** @example "Content editor" */
  name?: string
  /** @maxLength 500 */
  description?: string
}

export interface ReplaceRolePermissionsDto {
  permissionCodes: string[]
}

export interface UserRolesResponseDto {
  /** @format uuid */
  userId: string
  roles: string[]
}

export interface ReplaceUserRolesDto {
  /** @example ["user","content-editor"] */
  roleCodes: string[]
}

export interface HealthResponseDto {
  /** @example "ok" */
  status: 'ok'
  /** @example "up" */
  database: 'up'
}

export interface ProblemDetailsDto {
  /** @example "https://api-template.dev/problems/auth-login" */
  type: string
  /** @example "Unauthorized" */
  title: string
  /** @example 401 */
  status: number
  /** @example "Email or password is incorrect." */
  detail: string
  /** @example "/api/auth/login" */
  instance: string
  /** @example "AUTH_LOGIN_001" */
  code: string
  /** @example "442c2bc8-a9de-4bf8-825d-b3cc9fa636f7" */
  traceId: string
  errors?: Record<string, string[]>
}

import type { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from 'axios'
import axios from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || ''
    })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    }
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: any[] = property instanceof Array ? property : [property]

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }

      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = format || this.format || undefined

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body)
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { 'Content-Type': type } : {})
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path
      })
      .then(response => response.data)
  }
}

/**
 * @title API Template
 * @version 1.0.0
 * @contact
 *
 * NestJS API template with JWE authentication, rotating refresh sessions, and RBAC.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerRegister
     * @summary Register and start an authenticated session
     * @request POST:/api/auth/register
     */
    accountControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<AuthSessionResponseDto, any>({
        path: `/api/auth/register`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerLogin
     * @summary Sign in and start an authenticated session
     * @request POST:/api/auth/login
     */
    accountControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<AuthSessionResponseDto, any>({
        path: `/api/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerBootstrap
     * @summary Restore the browser session without rotating the refresh token
     * @request POST:/api/auth/bootstrap
     */
    accountControllerBootstrap: (params: RequestParams = {}) =>
      this.request<AuthSessionResponseDto, any>({
        path: `/api/auth/bootstrap`,
        method: 'POST',
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerRefresh
     * @summary Rotate the refresh token and issue a fresh access token
     * @request POST:/api/auth/refresh
     */
    accountControllerRefresh: (params: RequestParams = {}) =>
      this.request<AuthSessionResponseDto, any>({
        path: `/api/auth/refresh`,
        method: 'POST',
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerLogout
     * @summary End the current session or every account session
     * @request POST:/api/auth/logout
     */
    accountControllerLogout: (data: LogoutDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerMe
     * @request GET:/api/auth/me
     * @secure
     */
    accountControllerMe: (params: RequestParams = {}) =>
      this.request<AuthAccountDto, any>({
        path: `/api/auth/me`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerListSessions
     * @request GET:/api/auth/sessions
     * @secure
     */
    accountControllerListSessions: (params: RequestParams = {}) =>
      this.request<AuthSessionListItemDto[], any>({
        path: `/api/auth/sessions`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name AccountControllerRevokeSession
     * @request DELETE:/api/auth/sessions/{sessionId}
     * @secure
     */
    accountControllerRevokeSession: (sessionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/sessions/${sessionId}`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name RolesControllerList
     * @request GET:/api/roles
     * @secure
     */
    rolesControllerList: (params: RequestParams = {}) =>
      this.request<RoleResponseDto[], any>({
        path: `/api/roles`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name RolesControllerCreate
     * @request POST:/api/roles
     * @secure
     */
    rolesControllerCreate: (data: CreateRoleDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/roles`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name RolesControllerListPermissions
     * @request GET:/api/permissions
     * @secure
     */
    rolesControllerListPermissions: (params: RequestParams = {}) =>
      this.request<PermissionResponseDto[], any>({
        path: `/api/permissions`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name RolesControllerUpdate
     * @request PATCH:/api/roles/{roleId}
     * @secure
     */
    rolesControllerUpdate: (roleId: string, data: UpdateRoleDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/roles/${roleId}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name RolesControllerDeactivate
     * @request DELETE:/api/roles/{roleId}
     * @secure
     */
    rolesControllerDeactivate: (roleId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/roles/${roleId}`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name RolesControllerReplacePermissions
     * @request PUT:/api/roles/{roleId}/permissions
     * @secure
     */
    rolesControllerReplacePermissions: (roleId: string, data: ReplaceRolePermissionsDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/roles/${roleId}/permissions`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name UserRolesControllerGet
     * @request GET:/api/users/{userId}/roles
     * @secure
     */
    userRolesControllerGet: (userId: string, params: RequestParams = {}) =>
      this.request<UserRolesResponseDto, any>({
        path: `/api/users/${userId}/roles`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @tags Access control
     * @name UserRolesControllerReplace
     * @request PUT:/api/users/{userId}/roles
     * @secure
     */
    userRolesControllerReplace: (userId: string, data: ReplaceUserRolesDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/${userId}/roles`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @tags Health
     * @name HealthControllerCheck
     * @request GET:/api/health
     */
    healthControllerCheck: (params: RequestParams = {}) =>
      this.request<HealthResponseDto, any>({
        path: `/api/health`,
        method: 'GET',
        format: 'json',
        ...params
      })
  }
}
